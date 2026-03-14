import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RoleEntity } from '../roles/role.entity';
import { ModuleEntity } from '../modules/module.entity';
import { PermissionCatalogEntity } from '../permission-catalogs/permission-catalog.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity) private repo: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(ModuleEntity) private moduleRepo: Repository<ModuleEntity>,
    @InjectRepository(PermissionCatalogEntity) private catalogRepo: Repository<PermissionCatalogEntity>
  ) {}

  findAll() {
    return this.repo.find();
  }

  findByRole(roleId: string) {
    return this.repo.find({ where: { role: { id: roleId } } as any });
  }

  findByModule(moduleId: string) {
    return this.repo.find({ where: { module: { id: moduleId } } as any });
  }

  async create(dto: CreatePermissionDto) {
    const role = await this.roleRepo.findOneBy({ id: dto.roleId });
    const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
    const catalog = await this.catalogRepo.findOneBy({ id: dto.permissionCatalogId });

    if (!role) throw new NotFoundException('Role not found');
    if (!module) throw new NotFoundException('Module not found');
    if (!catalog) throw new NotFoundException('Permission catalog not found');

    const entity = this.repo.create({
      role,
      module,
      permissionCatalog: catalog,
      isGranted: dto.isGranted ?? true
    });
    return this.repo.save(entity);
  }

  async updateRolePermissions(roleId: string, permissions: any[]) {
    // Delete existing permissions for this role
    await this.repo.delete({ role: { id: roleId } as any });

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

  async update(id: string, dto: UpdatePermissionDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new NotFoundException('Permission not found');

    if (dto.roleId) {
      const role = await this.roleRepo.findOneBy({ id: dto.roleId });
      if (!role) throw new NotFoundException('Role not found');
      entity.role = role;
    }
    if (dto.moduleId) {
      const module = await this.moduleRepo.findOneBy({ id: dto.moduleId });
      if (!module) throw new NotFoundException('Module not found');
      entity.module = module;
    }
    if (dto.permissionCatalogId) {
      const catalog = await this.catalogRepo.findOneBy({ id: dto.permissionCatalogId });
      if (!catalog) throw new NotFoundException('Permission catalog not found');
      entity.permissionCatalog = catalog;
    }
    if (dto.isGranted !== undefined) {
      entity.isGranted = dto.isGranted;
    }

    return this.repo.save(entity);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
