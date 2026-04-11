import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @ApiOperation({ summary: 'Listar permisos' })
  @Get()
  findAll() { return this.service.findAll(); }

  @ApiOperation({ summary: 'Listar permisos por rol' })
  @ApiParam({ name: 'roleId', example: '9ab9b471-5f58-4056-99fd-8fdb0fb6563b' })
  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: string) { return this.service.findByRole(roleId); }

  @ApiOperation({ summary: 'Listar permisos por modulo' })
  @ApiParam({ name: 'moduleId', example: '9c4f2d10-4f0a-4ac8-9258-a5eb5e7f9e65' })
  @Get('module/:moduleId')
  findByModule(@Param('moduleId') moduleId: string) { return this.service.findByModule(moduleId); }

  @ApiOperation({ summary: 'Actualizar permisos de un rol' })
  @ApiBody({ type: UpdateRolePermissionsDto })
  @Put('role/:roleId/update')
  updateRolePermissions(@Param('roleId') roleId: string, @Body() body: UpdateRolePermissionsDto) {
    return this.service.updateRolePermissions(roleId, body.permissions);
  }

  @ApiOperation({ summary: 'Crear permiso' })
  @Post()
  create(@Body() dto: CreatePermissionDto) { return this.service.create(dto); }

  @ApiOperation({ summary: 'Actualizar permiso' })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) { return this.service.update(id, dto); }

  @ApiOperation({ summary: 'Eliminar permiso' })
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
