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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./permission.entity");
const role_entity_1 = require("../roles/role.entity");
const module_entity_1 = require("../modules/module.entity");
const permission_catalog_entity_1 = require("../permission-catalogs/permission-catalog.entity");
let PermissionsService = class PermissionsService {
    constructor(repo, roleRepo, moduleRepo, catalogRepo) {
        this.repo = repo;
        this.roleRepo = roleRepo;
        this.moduleRepo = moduleRepo;
        this.catalogRepo = catalogRepo;
    }
    findAll() {
        return this.repo.find();
    }
    findByRole(roleId) {
        return this.repo.find({ where: { role: { id: roleId } } });
    }
    findByModule(moduleId) {
        return this.repo.find({ where: { module: { id: moduleId } } });
    }
    async create(dto) {
        const role = await this.roleRepo.findOneBy({ id: dto.roleId });
        const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
        const catalog = await this.catalogRepo.findOneBy({ id: dto.permissionCatalogId });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        if (!module)
            throw new common_1.NotFoundException('Module not found');
        if (!catalog)
            throw new common_1.NotFoundException('Permission catalog not found');
        const entity = this.repo.create({
            role,
            module,
            permissionCatalog: catalog,
            isGranted: dto.isGranted ?? true
        });
        return this.repo.save(entity);
    }
    async updateRolePermissions(roleId, permissions) {
        // Delete existing permissions for this role
        await this.repo.delete({ role: { id: roleId } });
        // Create new permissions
        const permissionEntities = [];
        for (const perm of permissions) {
            const role = await this.roleRepo.findOneBy({ id: roleId });
            const module = await this.moduleRepo.findOneBy({ id: perm.moduleId });
            const catalog = await this.catalogRepo.findOneBy({ id: perm.permissionCatalogId });
            if (role && module && catalog) {
                const entity = this.repo.create({
                    role,
                    module,
                    permissionCatalog: catalog,
                    isGranted: true
                });
                permissionEntities.push(entity);
            }
        }
        if (permissionEntities.length > 0) {
            return this.repo.save(permissionEntities);
        }
        return [];
    }
    async update(id, dto) {
        const entity = await this.repo.findOneBy({ id });
        if (!entity)
            throw new common_1.NotFoundException('Permission not found');
        if (dto.roleId) {
            const role = await this.roleRepo.findOneBy({ id: dto.roleId });
            if (!role)
                throw new common_1.NotFoundException('Role not found');
            entity.role = role;
        }
        if (dto.moduleId) {
            const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
            if (!module)
                throw new common_1.NotFoundException('Module not found');
            entity.module = module;
        }
        if (dto.permissionCatalogId) {
            const catalog = await this.catalogRepo.findOneBy({ id: dto.permissionCatalogId });
            if (!catalog)
                throw new common_1.NotFoundException('Permission catalog not found');
            entity.permissionCatalog = catalog;
        }
        if (dto.isGranted !== undefined) {
            entity.isGranted = dto.isGranted;
        }
        return this.repo.save(entity);
    }
    remove(id) {
        return this.repo.delete(id);
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(permission_catalog_entity_1.PermissionCatalogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionsService);
