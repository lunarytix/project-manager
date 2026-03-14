"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const module_entity_1 = require("../modules/module.entity");
const permission_entity_1 = require("../permissions/permission.entity");
const role_entity_1 = require("../roles/role.entity");
let PermissionGuard = class PermissionGuard {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const path = req.path || '';
        const method = (req.method || '').toUpperCase();
        console.log(`🔐 Permission Guard - ${method} ${path}`);
        // Skip auth routes
        if (path.startsWith('/api/auth'))
            return true;
        // Only enforce for state-changing methods
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method))
            return true;
        // determine module ruta from path: take first segment after '/api'
        let route = path.replace(/^\/api/, '');
        const parts = route.split('/').filter(Boolean);
        if (parts.length === 0)
            return true; // nothing to check
        const moduleRuta = '/' + parts[0];
        console.log(`🔗 Looking for module with ruta: ${moduleRuta}`);
        const moduleRepo = this.dataSource.getRepository(module_entity_1.ModuleEntity);
        const module = await moduleRepo.findOne({ where: { ruta: moduleRuta } });
        const strict = (process.env.PERMISSION_STRICT || 'false').toLowerCase() === 'true';
        console.log(`📦 Module found:`, module ? `${module.nombre} (${module.id})` : 'NOT FOUND');
        if (!module) {
            // If strict flag enabled, deny when module is unknown. Otherwise allow.
            if (strict)
                throw new common_1.ForbiddenException('Module not found');
            return true; // unknown module -> allow by default
        }
        // extract user id from Authorization header (supports fake-jwt-token-<id>)
        const auth = (req.headers['authorization'] || '');
        if (!auth || !auth.startsWith('Bearer '))
            throw new common_1.ForbiddenException('No authorization');
        const token = auth.replace('Bearer ', '').trim();
        const prefix = 'fake-jwt-token-';
        let userId = null;
        if (token.startsWith(prefix))
            userId = token.substring(prefix.length);
        if (!userId)
            throw new common_1.ForbiddenException('Invalid token');
        console.log(`👤 User ID from token: ${userId}`);
        const userRepo = this.dataSource.getRepository(user_entity_1.UserEntity);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.ForbiddenException('User not found');
        console.log(`👤 User found: ${user.nombre} (${user.email}) - Role: ${user.roleId}`);
        let roleId = user.roleId;
        const roleRepo = this.dataSource.getRepository(role_entity_1.RoleEntity);
        // if roleId looks like a name, try resolve
        if (roleId && roleId.length < 40) {
            const rr = await roleRepo.findOne({ where: { nombre: roleId } });
            if (rr)
                roleId = rr.id;
        }
        console.log(`🔑 Final role ID: ${roleId}`);
        const permRepo = this.dataSource.getRepository(permission_entity_1.PermissionEntity);
        // Get permissions for this role and module
        const permissions = await permRepo.find({
            where: { role: { id: roleId }, module: { id: module.id } },
            relations: ['permissionCatalog']
        });
        console.log(`🛡️  Permissions found: ${permissions.length}`);
        if (!permissions || permissions.length === 0) {
            throw new common_1.ForbiddenException('No permissions for this module');
        }
        // Check if user has the required permission based on HTTP method
        let requiredPermissionName = '';
        if (method === 'GET')
            requiredPermissionName = 'Leer';
        if (method === 'POST')
            requiredPermissionName = 'Crear';
        if (method === 'PUT' || method === 'PATCH')
            requiredPermissionName = 'Editar';
        if (method === 'DELETE')
            requiredPermissionName = 'Eliminar';
        const hasPermission = permissions.some(perm => perm.permissionCatalog?.nombre === requiredPermissionName && perm.isGranted);
        if (!hasPermission) {
            throw new common_1.ForbiddenException(`${requiredPermissionName} not allowed`);
        }
        console.log(`✅ Permission granted for ${method} on ${moduleRuta}`);
        return true;
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PermissionGuard);
