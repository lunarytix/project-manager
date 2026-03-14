import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PermissionCatalogEntity } from './permission-catalog.entity';
import { PermissionCatalogMappingEntity } from './permission-catalog-mapping.entity';

@Injectable()
export class PermissionCatalogsService {
  constructor(private dataSource: DataSource) {}

  private catalogRepo() {
    return this.dataSource.getRepository(PermissionCatalogEntity);
  }

  private mappingRepo() {
    return this.dataSource.getRepository(PermissionCatalogMappingEntity);
  }

  async findAll() {
    return this.catalogRepo().find();
  }

  async findOne(id: string) {
    const r = await this.catalogRepo().findOne({ where: { id } });
    if (!r) throw new NotFoundException('Catalog not found');
    return r;
  }

  async create(payload: Partial<PermissionCatalogEntity>) {
    return this.catalogRepo().save(this.catalogRepo().create(payload as any));
  }

  async update(id: string, payload: Partial<PermissionCatalogEntity>) {
    const repo = this.catalogRepo();
    const item = await repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Catalog not found');
    Object.assign(item, payload);
    return repo.save(item);
  }

  async remove(id: string) {
    const repo = this.catalogRepo();
    const item = await repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Catalog not found');
    return repo.remove(item);
  }

  async addMappings(permissionId: string, catalogIds: string[]) {
    const repo = this.mappingRepo();
    const results = [];
    for (const cid of catalogIds) {
      const exists = await repo.findOne({ where: { permission: { id: permissionId }, catalog: { id: cid } } as any });
      if (!exists) {
        const m = repo.create({ permission: { id: permissionId } as any, catalog: { id: cid } as any } as any);
        results.push(await repo.save(m));
      }
    }
    return results;
  }

  async getMappingsByPermission(permissionId: string) {
    return this.mappingRepo().find({ where: { permission: { id: permissionId } } as any });
  }

  async removeMapping(permissionId: string, catalogId: string) {
    const repo = this.mappingRepo();
    const item = await repo.findOne({ where: { permission: { id: permissionId }, catalog: { id: catalogId } } as any });
    if (!item) throw new NotFoundException('Mapping not found');
    return repo.remove(item);
  }
}
