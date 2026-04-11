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
exports.PermissionCatalogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permission_catalogs_service_1 = require("./permission-catalogs.service");
const create_permission_catalog_dto_1 = require("./dto/create-permission-catalog.dto");
const update_permission_catalog_dto_1 = require("./dto/update-permission-catalog.dto");
const add_mappings_dto_1 = require("./dto/add-mappings.dto");
let PermissionCatalogsController = class PermissionCatalogsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll() {
        return this.svc.findAll();
    }
    findOne(id) {
        return this.svc.findOne(id);
    }
    create(body) {
        return this.svc.create(body);
    }
    update(id, body) {
        return this.svc.update(id, body);
    }
    remove(id) {
        return this.svc.remove(id);
    }
    addMappings(permissionId, body) {
        return this.svc.addMappings(permissionId, body.catalogIds || []);
    }
    getMappings(permissionId) {
        return this.svc.getMappingsByPermission(permissionId);
    }
    removeMapping(permissionId, catalogId) {
        return this.svc.removeMapping(permissionId, catalogId);
    }
};
exports.PermissionCatalogsController = PermissionCatalogsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar catalogo de permisos' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener catalogo por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear elemento del catalogo de permisos' }),
    (0, swagger_1.ApiBody)({ type: create_permission_catalog_dto_1.CreatePermissionCatalogDto }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_catalog_dto_1.CreatePermissionCatalogDto]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar elemento del catalogo de permisos' }),
    (0, swagger_1.ApiBody)({ type: update_permission_catalog_dto_1.UpdatePermissionCatalogDto }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_permission_catalog_dto_1.UpdatePermissionCatalogDto]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar elemento del catalogo de permisos' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Asociar catalogos a un permiso' }),
    (0, swagger_1.ApiBody)({ type: add_mappings_dto_1.AddMappingsDto }),
    (0, swagger_1.ApiParam)({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' }),
    (0, common_1.Post)(':permissionId/mappings'),
    __param(0, (0, common_1.Param)('permissionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_mappings_dto_1.AddMappingsDto]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "addMappings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener asociaciones de catalogos por permiso' }),
    (0, swagger_1.ApiParam)({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' }),
    (0, common_1.Get)(':permissionId/mappings'),
    __param(0, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "getMappings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar asociacion de catalogo en permiso' }),
    (0, swagger_1.ApiParam)({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' }),
    (0, swagger_1.ApiParam)({ name: 'catalogId', example: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335' }),
    (0, common_1.Delete)(':permissionId/mappings/:catalogId'),
    __param(0, (0, common_1.Param)('permissionId')),
    __param(1, (0, common_1.Param)('catalogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PermissionCatalogsController.prototype, "removeMapping", null);
exports.PermissionCatalogsController = PermissionCatalogsController = __decorate([
    (0, swagger_1.ApiTags)('Permission Catalogs'),
    (0, common_1.Controller)('permission-catalogs'),
    __metadata("design:paramtypes", [permission_catalogs_service_1.PermissionCatalogsService])
], PermissionCatalogsController);
