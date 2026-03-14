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
exports.PermissionCatalogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const permission_catalog_entity_1 = require("./permission-catalog.entity");
const permission_catalog_mapping_entity_1 = require("./permission-catalog-mapping.entity");
let PermissionCatalogsService = class PermissionCatalogsService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    catalogRepo() {
        return this.dataSource.getRepository(permission_catalog_entity_1.PermissionCatalogEntity);
    }
    mappingRepo() {
        return this.dataSource.getRepository(permission_catalog_mapping_entity_1.PermissionCatalogMappingEntity);
    }
    async findAll() {
        return this.catalogRepo().find();
    }
    async findOne(id) {
        const r = await this.catalogRepo().findOne({ where: { id } });
        if (!r)
            throw new common_1.NotFoundException('Catalog not found');
        return r;
    }
    async create(payload) {
        return this.catalogRepo().save(this.catalogRepo().create(payload));
    }
    async update(id, payload) {
        const repo = this.catalogRepo();
        const item = await repo.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Catalog not found');
        Object.assign(item, payload);
        return repo.save(item);
    }
    async remove(id) {
        const repo = this.catalogRepo();
        const item = await repo.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Catalog not found');
        return repo.remove(item);
    }
    async addMappings(permissionId, catalogIds) {
        const repo = this.mappingRepo();
        const results = [];
        for (const cid of catalogIds) {
            const exists = await repo.findOne({ where: { permission: { id: permissionId }, catalog: { id: cid } } });
            if (!exists) {
                const m = repo.create({ permission: { id: permissionId }, catalog: { id: cid } });
                results.push(await repo.save(m));
            }
        }
        return results;
    }
    async getMappingsByPermission(permissionId) {
        return this.mappingRepo().find({ where: { permission: { id: permissionId } } });
    }
    async removeMapping(permissionId, catalogId) {
        const repo = this.mappingRepo();
        const item = await repo.findOne({ where: { permission: { id: permissionId }, catalog: { id: catalogId } } });
        if (!item)
            throw new common_1.NotFoundException('Mapping not found');
        return repo.remove(item);
    }
};
exports.PermissionCatalogsService = PermissionCatalogsService;
exports.PermissionCatalogsService = PermissionCatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PermissionCatalogsService);
