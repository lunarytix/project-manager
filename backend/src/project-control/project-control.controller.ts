import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectControlDto } from './dto/create-project-control.dto';
import { InitProjectDatabaseDto } from './dto/init-project-database.dto';
import { UpdateProjectControlDto } from './dto/update-project-control.dto';
import { ProjectControlService } from './project-control.service';

@ApiTags('ProjectControl')
@Controller('project-control')
export class ProjectControlController {
  constructor(private readonly service: ProjectControlService) {}

  @ApiOperation({ summary: 'Crear configuracion de proyecto de software' })
  @Post()
  create(@Body() dto: CreateProjectControlDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listar proyectos configurados' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obtener proyecto por id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar configuracion de proyecto' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectControlDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar configuracion de proyecto' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @ApiOperation({ summary: 'Descargar o actualizar repo git por rama' })
  @Post(':id/download')
  download(@Param('id') id: string) {
    return this.service.downloadProject(id);
  }

  @ApiOperation({ summary: 'Crear base de datos y ejecutar SQL' })
  @Post(':id/database/init')
  initDatabase(@Param('id') id: string, @Body() dto: InitProjectDatabaseDto) {
    return this.service.initializeDatabase(id, dto);
  }

  @ApiOperation({ summary: 'Desplegar proyecto (frontend/backend/fullstack)' })
  @Post(':id/deploy')
  deploy(@Param('id') id: string) {
    return this.service.deployProject(id);
  }

  @ApiOperation({ summary: 'Reiniciar proyecto desplegado' })
  @Post(':id/restart')
  restart(@Param('id') id: string) {
    return this.service.restartProject(id);
  }

  @ApiOperation({ summary: 'Detener proyecto desplegado' })
  @Post(':id/stop')
  stop(@Param('id') id: string) {
    return this.service.stopProject(id);
  }
}
