import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from '../roles/role.entity';
import { ModuleEntity } from '../modules/module.entity';
import { PermissionCatalogEntity } from '../permission-catalogs/permission-catalog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, RoleEntity, ModuleEntity, PermissionCatalogEntity])],
  providers: [PermissionsService],
  controllers: [PermissionsController]
})
export class PermissionsModule {}
