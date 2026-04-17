import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { UserEntity } from '../users/user.entity';
import { ModuleEntity } from '../modules/module.entity';
import { PermissionEntity } from '../permissions/permission.entity';
import { RoleEntity } from '../roles/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const path = req.path || '';
    const method = (req.method || '').toUpperCase();

    console.log(`🔐 Permission Guard - ${method} ${path}`);

    // Skip auth routes
    if (path.startsWith('/api/auth')) return true;

    // Frontend audit event ingestion should not require module CRUD permissions.
    if (path.startsWith('/api/audit/frontend-event')) return true;

    // Only enforce for state-changing methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return true;

    // determine module ruta from path: take first segment after '/api'
    let route = path.replace(/^\/api/, '');
    const parts = route.split('/').filter(Boolean);
    if (parts.length === 0) return true; // nothing to check
    const moduleRuta = '/' + parts[0];

    console.log(`🔗 Looking for module with ruta: ${moduleRuta}`);

    const moduleRepo = this.dataSource.getRepository(ModuleEntity);
    const module = await moduleRepo.findOne({ where: { ruta: moduleRuta } as any });
    const strict = (process.env.PERMISSION_STRICT || 'false').toLowerCase() === 'true';

    console.log(`📦 Module found:`, module ? `${module.nombre} (${module.id})` : 'NOT FOUND');

    if (!module) {
      // If strict flag enabled, deny when module is unknown. Otherwise allow.
      if (strict) throw new ForbiddenException('Module not found');
      return true; // unknown module -> allow by default
    }

    // extract user id from Authorization header (supports fake-jwt-token-<id>)
    const auth = (req.headers['authorization'] || '') as string;
    if (!auth || !auth.startsWith('Bearer ')) throw new ForbiddenException('No authorization');
    const token = auth.replace('Bearer ', '').trim();
    const prefix = 'fake-jwt-token-';
    let userId: string | null = null;
    if (token.startsWith(prefix)) userId = token.substring(prefix.length);
    if (!userId) throw new ForbiddenException('Invalid token');

    console.log(`👤 User ID from token: ${userId}`);

    const userRepo = this.dataSource.getRepository(UserEntity);
    const user = await userRepo.findOne({ where: { id: userId } as any });
    if (!user) throw new ForbiddenException('User not found');

    console.log(`👤 User found: ${user.nombre} (${user.email}) - Role: ${user.roleId}`);

    let roleId = user.roleId;
    const roleRepo = this.dataSource.getRepository(RoleEntity);
    // if roleId looks like a name, try resolve
    if (roleId && roleId.length < 40) {
      const rr = await roleRepo.findOne({ where: { nombre: roleId } as any });
      if (rr) roleId = rr.id;
    }

    console.log(`🔑 Final role ID: ${roleId}`);

    const permRepo = this.dataSource.getRepository(PermissionEntity);

    // Get permissions for this role and module
    const permissions = await permRepo.find({
      where: { role: { id: roleId }, module: { id: module.id } } as any,
      relations: ['permissionCatalog']
    });

    console.log(`🛡️  Permissions found: ${permissions.length}`);

    if (!permissions || permissions.length === 0) {
      throw new ForbiddenException('No permissions for this module');
    }

    // Check if user has the required permission based on HTTP method
    let requiredPermissionName = '';
    if (method === 'GET') requiredPermissionName = 'Leer';
    if (method === 'POST') requiredPermissionName = 'Crear';
    if (method === 'PUT' || method === 'PATCH') requiredPermissionName = 'Editar';
    if (method === 'DELETE') requiredPermissionName = 'Eliminar';

    const hasPermission = permissions.some(perm =>
      perm.permissionCatalog?.nombre === requiredPermissionName && perm.isGranted
    );

    if (!hasPermission) {
      throw new ForbiddenException(`${requiredPermissionName} not allowed`);
    }

    console.log(`✅ Permission granted for ${method} on ${moduleRuta}`);
    return true;
  }
}
