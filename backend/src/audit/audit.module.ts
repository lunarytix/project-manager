import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditLogEntity } from './audit-log.entity';
import { AuditSettingsEntity } from './audit-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity, AuditSettingsEntity])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
