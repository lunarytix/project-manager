import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { RoleEntity } from '../roles/role.entity';
import { ModuleEntity } from '../modules/module.entity';
import { PermissionCatalogEntity } from '../permission-catalogs/permission-catalog.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => RoleEntity, { eager: true, onDelete: 'CASCADE' })
  role!: RoleEntity;

  @ManyToOne(() => ModuleEntity, { eager: true, onDelete: 'CASCADE' })
  module!: ModuleEntity;

  @ManyToOne(() => PermissionCatalogEntity, { eager: true, onDelete: 'CASCADE' })
  permissionCatalog!: PermissionCatalogEntity;

  @Column({ type: 'boolean', default: true })
  isGranted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
