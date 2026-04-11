import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'Crear modulo' })
  @Post()
  create(@Body() createDto: CreateModuleDto) {
    return this.modulesService.create(createDto);
  }

  @ApiOperation({ summary: 'Listar modulos' })
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @ApiOperation({ summary: 'Listar modulos por rol' })
  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: string) {
    return this.modulesService.findByRole(roleId);
  }

  @ApiOperation({ summary: 'Obtener modulo por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar modulo' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar modulo' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
