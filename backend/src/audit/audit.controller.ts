import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AuditService } from './audit.service';
import { UpdateAuditSettingsDto } from './dto/update-audit-settings.dto';
import { CreateFrontendAuditEventDto } from './dto/create-frontend-audit-event.dto';
import { UserEntity } from '../users/user.entity';
import { RoleEntity } from '../roles/role.entity';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  private extractUserIdFromAuthHeader(authHeader?: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const prefix = 'fake-jwt-token-';
    if (!token.startsWith(prefix)) {
      throw new UnauthorizedException('Invalid token');
    }

    return token.substring(prefix.length);
  }

  private isUuid(value?: string): boolean {
    if (!value) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private async ensureAdmin(authHeader?: string): Promise<void> {
    const userId = this.extractUserIdFromAuthHeader(authHeader);
    const userRepo = this.dataSource.getRepository(UserEntity);
    const roleRepo = this.dataSource.getRepository(RoleEntity);

    const user = await userRepo.findOne({ where: { id: userId } as any });
    if (!user) throw new UnauthorizedException('User not found');

    let roleId = user.roleId;
    let roleName = '';

    if (this.isUuid(roleId)) {
      const role = await roleRepo.findOne({ where: { id: roleId } as any });
      roleName = role?.nombre || '';
    } else {
      roleName = roleId || '';
    }

    const normalizedRole = (roleName || '').toLowerCase();
    if (normalizedRole !== 'admin' && normalizedRole !== 'administrador') {
      throw new ForbiddenException('Only admin can access audit');
    }
  }

  private async resolveUserFromAuthHeader(authHeader?: string): Promise<{
    id: string;
    email: string | null;
    nombre: string | null;
    roleId: string | null;
  } | null> {
    try {
      const userId = this.extractUserIdFromAuthHeader(authHeader);
      const userRepo = this.dataSource.getRepository(UserEntity);
      const user = await userRepo.findOne({ where: { id: userId } as any });
      if (!user) return null;

      return {
        id: user.id,
        email: user.email ?? null,
        nombre: user.nombre ?? null,
        roleId: user.roleId ?? null,
      };
    } catch {
      return null;
    }
  }

  @ApiOperation({ summary: 'Obtener configuracion de auditoria/debug (solo admin)' })
  @Get('settings')
  async getSettings(@Headers('authorization') authHeader?: string) {
    await this.ensureAdmin(authHeader);
    return this.auditService.getSettings();
  }

  @ApiOperation({ summary: 'Actualizar configuracion de auditoria/debug (solo admin)' })
  @Put('settings')
  async updateSettings(
    @Headers('authorization') authHeader: string | undefined,
    @Body() dto: UpdateAuditSettingsDto,
  ) {
    await this.ensureAdmin(authHeader);
    return this.auditService.updateSettings(dto);
  }

  @ApiOperation({ summary: 'Listar logs de auditoria (solo admin)' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'moduleRuta', required: false })
  @ApiQuery({ name: 'method', required: false })
  @ApiQuery({ name: 'actionType', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @Get('logs')
  async getLogs(
    @Headers('authorization') authHeader: string | undefined,
    @Query('userId') userId?: string,
    @Query('moduleRuta') moduleRuta?: string,
    @Query('method') method?: string,
    @Query('actionType') actionType?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    await this.ensureAdmin(authHeader);

    return this.auditService.getLogs({
      userId,
      moduleRuta,
      method,
      actionType,
      from,
      to,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @ApiOperation({ summary: 'Registrar eventos del frontend (movimientos y errores)' })
  @Post('frontend-event')
  async createFrontendEvent(
    @Headers('authorization') authHeader: string | undefined,
    @Body() dto: CreateFrontendAuditEventDto,
  ) {
    const user = await this.resolveUserFromAuthHeader(authHeader);

    const serializedPayload = dto.payload ? JSON.stringify(dto.payload) : null;
    const note = dto.message || null;
    const method = 'FRONTEND';

    await this.auditService.createLog({
      userId: user?.id ?? null,
      userEmail: user?.email ?? null,
      userNombre: user?.nombre ?? null,
      roleId: user?.roleId ?? null,
      moduleRuta: '/frontend',
      moduleNombre: 'Frontend',
      actionType: dto.eventType,
      method,
      endpoint: dto.currentUrl || '/',
      statusCode: 0,
      ipAddress: null,
      userAgent: null,
      queryData: serializedPayload,
      bodyData: dto.component ? JSON.stringify({ component: dto.component }) : null,
      note,
    });

    return { ok: true };
  }
}
