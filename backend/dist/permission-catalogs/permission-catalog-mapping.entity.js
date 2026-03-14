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
exports.PermissionCatalogMappingEntity = void 0;
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../permissions/permission.entity");
const permission_catalog_entity_1 = require("./permission-catalog.entity");
let PermissionCatalogMappingEntity = class PermissionCatalogMappingEntity {
};
exports.PermissionCatalogMappingEntity = PermissionCatalogMappingEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PermissionCatalogMappingEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.PermissionEntity, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", permission_entity_1.PermissionEntity)
], PermissionCatalogMappingEntity.prototype, "permission", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_catalog_entity_1.PermissionCatalogEntity, { eager: true, onDelete: 'CASCADE' }),
    __metadata("design:type", permission_catalog_entity_1.PermissionCatalogEntity)
], PermissionCatalogMappingEntity.prototype, "catalog", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PermissionCatalogMappingEntity.prototype, "createdAt", void 0);
exports.PermissionCatalogMappingEntity = PermissionCatalogMappingEntity = __decorate([
    (0, typeorm_1.Entity)('permission_catalog_mappings')
], PermissionCatalogMappingEntity);
