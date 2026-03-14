import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionCatalogEntity } from './permission-catalog.entity';

@Entity('permission_catalog_mappings')
export class PermissionCatalogMappingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  permission!: PermissionEntity;

  @ManyToOne(() => PermissionCatalogEntity, { eager: true, onDelete: 'CASCADE' })
  catalog!: PermissionCatalogEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
