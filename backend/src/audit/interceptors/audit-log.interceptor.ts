import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { Request, Response } from 'express';
import { AuditService } from '../audit.service';
import { UserEntity } from '../../users/user.entity';
import { ModuleEntity } from '../../modules/module.entity';
import { RoleEntity } from '../../roles/role.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  private sanitizePayload(payload: any): string | null {
    if (!payload || typeof payload !== 'object') return null;

    const clone = JSON.parse(JSON.stringify(payload));
    const sensitiveKeys = ['password', 'token', 'authorization'];

    for (const key of Object.keys(clone)) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        clone[key] = '***';
      }
    }

    try {
      return JSON.stringify(clone);
    } catch {
      return null;
    }
  }

  private getModuleRuta(path: string): string {
    let route = path.replace(/^\/api/, '');
    const parts = route.split('/').filter(Boolean);
    if (parts.length === 0) return '/';
    return '/' + parts[0];
  }

  private mapActionType(method: string): string {
    switch (method) {
      case 'GET':
        return 'CONSULTA';
      case 'POST':
        return 'INSERTAR';
      case 'PUT':
      case 'PATCH':
        return 'MODIFICAR';
      case 'DELETE':
        return 'ELIMINAR';
      default:
        return method;
    }
  }

  private extractUserIdFromAuthHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.replace('Bearer ', '').trim();
    const prefix = 'fake-jwt-token-';
    if (!token.startsWith(prefix)) return null;

    return token.substring(prefix.length);
  }

  private isUuid(value?: string): boolean {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private async createAuditLog(req: Request, res: Response, note?: string): Promise<void> {
    const method = (req.method || 'GET').toUpperCase();
    const shouldLog = await this.auditService.shouldLogRequest(method);
    if (!shouldLog) return;

    const moduleRuta = this.getModuleRuta(req.path || req.url || '/');
    const moduleRepo = this.dataSource.getRepository(ModuleEntity);
    const userRepo = this.dataSource.getRepository(UserEntity);
    const roleRepo = this.dataSource.getRepository(RoleEntity);

    const module = await moduleRepo.findOne({ where: { ruta: moduleRuta } as any });
    const userId = this.extractUserIdFromAuthHeader(req.headers.authorization as string | undefined);

    let userEmail: string | null = null;
    let userNombre: string | null = null;
    let roleId: string | null = null;

    if (userId) {
      const user = await userRepo.findOne({ where: { id: userId } as any });
      if (user) {
        userEmail = user.email;
        userNombre = user.nombre;
        roleId = user.roleId;

        if (this.isUuid(roleId)) {
          const role = await roleRepo.findOne({ where: { id: roleId } as any });
          if (role?.nombre) {
            roleId = `${roleId} (${role.nombre})`;
          }
        }
      }
    }

    const debugEnabled = await this.auditService.isDebugEnabled();
    const queryData = this.sanitizePayload(req.query);
    const bodyData = this.sanitizePayload(req.body);

    await this.auditService.createLog({
      userId,
      userEmail,
      userNombre,
      roleId,
      moduleRuta,
      moduleNombre: module?.nombre || null,
      actionType: this.mapActionType(method),
      method,
      endpoint: req.originalUrl || req.url,
      statusCode: res.statusCode || 0,
      ipAddress: (req.ip || req.socket?.remoteAddress || null) as string | null,
      userAgent: (req.headers['user-agent'] || null) as string | null,
      queryData,
      bodyData,
      note: note || null,
    });

    if (debugEnabled) {
      console.log(`🧭 AUDIT ${method} ${moduleRuta} - user=${userEmail || 'anonymous'} status=${res.statusCode}`);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap({
        next: () => {
          this.createAuditLog(req, res).catch((err) => {
            console.error('Error creating audit log:', err?.message || err);
          });
        },
        error: (err) => {
          this.createAuditLog(req, res, err?.message || 'Request failed').catch((auditErr) => {
            console.error('Error creating audit log:', auditErr?.message || auditErr);
          });
        },
      }),
    );
  }
}
