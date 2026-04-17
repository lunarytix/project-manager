import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export type ProjectScope = 'auto' | 'frontend' | 'backend' | 'fullstack';
export type ProjectStatus = 'CREATED' | 'DOWNLOADED' | 'DEPLOYED' | 'RUNNING' | 'STOPPED' | 'ERROR';

@Entity('project_controls')
export class ProjectControlEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar' })
  gitUrl: string;

  @Column({ type: 'varchar', default: 'main' })
  gitBranch: string;

  @Column({ type: 'varchar', default: 'auto' })
  scope: ProjectScope;

  @Column({ type: 'varchar', nullable: true })
  localPath: string | null;

  @Column({ type: 'varchar', default: 'CREATED' })
  status: ProjectStatus;

  @Column({ type: 'varchar', nullable: true })
  lastAction: string | null;

  @Column({ type: 'text', nullable: true })
  lastOutput: string | null;

  @Column({ type: 'varchar', default: 'sqlite' })
  dbEngine: string;

  @Column({ type: 'varchar', nullable: true })
  dbName: string | null;

  @Column({ type: 'varchar', nullable: true })
  dbFilePath: string | null;

  @Column({ type: 'varchar', default: 'npm install' })
  installCommand: string;

  @Column({ type: 'varchar', nullable: true })
  startCommand: string | null;

  @Column({ type: 'varchar', nullable: true })
  frontendStartCommand: string | null;

  @Column({ type: 'varchar', nullable: true })
  backendStartCommand: string | null;

  @Column('simple-json', { nullable: true })
  runtime: {
    rootPid?: number;
    frontendPid?: number;
    backendPid?: number;
  } | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
