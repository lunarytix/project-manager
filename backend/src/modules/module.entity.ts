import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  icono: string;

  @Column()
  ruta: string;

  @Column('simple-json', { nullable: true })
  rolesPermitidos: string[];

  @Column({ default: true })
  activo: boolean;

  @Column({ default: 0 })
  orden: number;
}
