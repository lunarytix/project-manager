import { Module } from '@nestjs/common';
import { PermissionCatalogsService } from './permission-catalogs.service';
import { PermissionCatalogsController } from './permission-catalogs.controller';

@Module({
  providers: [PermissionCatalogsService],
  controllers: [PermissionCatalogsController]
})
export class PermissionCatalogsModule {}
