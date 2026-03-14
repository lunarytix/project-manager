import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() createDto: CreateModuleDto) {
    return this.modulesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('role/:roleId')
  findByRole(@Param('roleId') roleId: string) {
    return this.modulesService.findByRole(roleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateModuleDto) {
    return this.modulesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(id);
  }
}
