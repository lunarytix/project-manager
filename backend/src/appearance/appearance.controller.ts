import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppearanceService } from './appearance.service';
import { CreateAppearanceDto } from './dto/create-appearance.dto';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { PermissionGuard } from '../guards/permission.guard';

@ApiTags('Appearance')
@Controller('appearance')
@UseGuards(PermissionGuard)
export class AppearanceController {
  constructor(private readonly appearanceService: AppearanceService) {}

  @ApiOperation({ summary: 'Crear configuracion de apariencia' })
  @Post()
  create(@Body() createAppearanceDto: CreateAppearanceDto) {
    return this.appearanceService.create(createAppearanceDto);
  }

  @ApiOperation({ summary: 'Listar configuraciones de apariencia' })
  @Get()
  findAll() {
    return this.appearanceService.findAll();
  }

  @ApiOperation({ summary: 'Obtener apariencia por defecto' })
  @Get('default')
  findDefault() {
    return this.appearanceService.findDefault();
  }

  @ApiOperation({ summary: 'Obtener configuracion de apariencia por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appearanceService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar configuracion de apariencia' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppearanceDto: UpdateAppearanceDto) {
    return this.appearanceService.update(id, updateAppearanceDto);
  }

  @ApiOperation({ summary: 'Eliminar configuracion de apariencia' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appearanceService.remove(id);
  }

  @ApiOperation({ summary: 'Marcar apariencia como predeterminada' })
  @Post(':id/set-default')
  setAsDefault(@Param('id') id: string) {
    return this.appearanceService.setAsDefault(id);
  }
}
