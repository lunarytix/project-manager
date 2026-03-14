import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private service: PermissionsService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: string) { return this.service.findByRole(roleId); }

  @Get('module/:moduleId')
  findByModule(@Param('moduleId') moduleId: string) { return this.service.findByModule(moduleId); }

  @Put('role/:roleId/update')
  updateRolePermissions(@Param('roleId') roleId: string, @Body() body: { permissions: any[] }) {
    return this.service.updateRolePermissions(roleId, body.permissions);
  }

  @Post()
  create(@Body() dto: CreatePermissionDto) { return this.service.create(dto); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
