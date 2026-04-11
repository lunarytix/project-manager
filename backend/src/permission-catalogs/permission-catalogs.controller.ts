import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionCatalogsService } from './permission-catalogs.service';
import { CreatePermissionCatalogDto } from './dto/create-permission-catalog.dto';
import { UpdatePermissionCatalogDto } from './dto/update-permission-catalog.dto';
import { AddMappingsDto } from './dto/add-mappings.dto';

@ApiTags('Permission Catalogs')
@Controller('permission-catalogs')
export class PermissionCatalogsController {
  constructor(private svc: PermissionCatalogsService) {}

  @ApiOperation({ summary: 'Listar catalogo de permisos' })
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @ApiOperation({ summary: 'Obtener catalogo por ID' })
  @ApiParam({ name: 'id', example: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @ApiOperation({ summary: 'Crear elemento del catalogo de permisos' })
  @ApiBody({ type: CreatePermissionCatalogDto })
  @Post()
  create(@Body() body: CreatePermissionCatalogDto) {
    return this.svc.create(body);
  }

  @ApiOperation({ summary: 'Actualizar elemento del catalogo de permisos' })
  @ApiBody({ type: UpdatePermissionCatalogDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePermissionCatalogDto) {
    return this.svc.update(id, body);
  }

  @ApiOperation({ summary: 'Eliminar elemento del catalogo de permisos' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @ApiOperation({ summary: 'Asociar catalogos a un permiso' })
  @ApiBody({ type: AddMappingsDto })
  @ApiParam({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' })
  @Post(':permissionId/mappings')
  addMappings(@Param('permissionId') permissionId: string, @Body() body: AddMappingsDto) {
    return this.svc.addMappings(permissionId, body.catalogIds || []);
  }

  @ApiOperation({ summary: 'Obtener asociaciones de catalogos por permiso' })
  @ApiParam({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' })
  @Get(':permissionId/mappings')
  getMappings(@Param('permissionId') permissionId: string) {
    return this.svc.getMappingsByPermission(permissionId);
  }

  @ApiOperation({ summary: 'Eliminar asociacion de catalogo en permiso' })
  @ApiParam({ name: 'permissionId', example: 'f8fe80a5-cf4a-4206-9ea8-c6f34d8f44bc' })
  @ApiParam({ name: 'catalogId', example: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335' })
  @Delete(':permissionId/mappings/:catalogId')
  removeMapping(@Param('permissionId') permissionId: string, @Param('catalogId') catalogId: string) {
    return this.svc.removeMapping(permissionId, catalogId);
  }
}
