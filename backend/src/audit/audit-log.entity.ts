import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  @Column({ type: 'varchar', nullable: true })
  userEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  userNombre: string | null;

  @Column({ type: 'varchar', nullable: true })
  roleId: string | null;

  @Column({ type: 'varchar' })
  moduleRuta: string;

  @Column({ type: 'varchar', nullable: true })
  moduleNombre: string | null;

  @Column({ type: 'varchar' })
  actionType: string;

  @Column({ type: 'varchar' })
  method: string;

  @Column({ type: 'varchar' })
  endpoint: string;

  @Column({ type: 'int', default: 0 })
  statusCode: number;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'text', nullable: true })
  queryData: string | null;

  @Column({ type: 'text', nullable: true })
  bodyData: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
