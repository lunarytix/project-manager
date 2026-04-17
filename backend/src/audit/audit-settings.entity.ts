import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('audit_settings')
export class AuditSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  debugModeEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  trackReadQueries: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
