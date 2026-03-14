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
exports.PermissionEntity = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../roles/role.entity");
const module_entity_1 = require("../modules/module.entity");
const permission_catalog_entity_1 = require("../permission-catalogs/permission-catalog.entity");
let PermissionEntity = class PermissionEntity {
};
exports.PermissionEntity = PermissionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PermissionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.RoleEntity, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", role_entity_1.RoleEntity)
], PermissionEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.ModuleEntity, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", module_entity_1.ModuleEntity)
], PermissionEntity.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_catalog_entity_1.PermissionCatalogEntity, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", permission_catalog_entity_1.PermissionCatalogEntity)
], PermissionEntity.prototype, "permissionCatalog", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], PermissionEntity.prototype, "isGranted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PermissionEntity.prototype, "createdAt", void 0);
exports.PermissionEntity = PermissionEntity = __decorate([
    (0, typeorm_1.Entity)('permissions')
], PermissionEntity);
