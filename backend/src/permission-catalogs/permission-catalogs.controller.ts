import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PermissionCatalogsService } from './permission-catalogs.service';

@Controller('permission-catalogs')
export class PermissionCatalogsController {
  constructor(private svc: PermissionCatalogsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Post(':permissionId/mappings')
  addMappings(@Param('permissionId') permissionId: string, @Body() body: { catalogIds: string[] }) {
    return this.svc.addMappings(permissionId, body.catalogIds || []);
  }

  @Get(':permissionId/mappings')
  getMappings(@Param('permissionId') permissionId: string) {
    return this.svc.getMappingsByPermission(permissionId);
  }

  @Delete(':permissionId/mappings/:catalogId')
  removeMapping(@Param('permissionId') permissionId: string, @Param('catalogId') catalogId: string) {
    return this.svc.removeMapping(permissionId, catalogId);
  }
}
