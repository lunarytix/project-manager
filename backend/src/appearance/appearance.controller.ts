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
import { AppearanceService } from './appearance.service';
import { CreateAppearanceDto } from './dto/create-appearance.dto';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { PermissionGuard } from '../guards/permission.guard';

@Controller('appearance')
@UseGuards(PermissionGuard)
export class AppearanceController {
  constructor(private readonly appearanceService: AppearanceService) {}

  @Post()
  create(@Body() createAppearanceDto: CreateAppearanceDto) {
    return this.appearanceService.create(createAppearanceDto);
  }

  @Get()
  findAll() {
    return this.appearanceService.findAll();
  }

  @Get('default')
  findDefault() {
    return this.appearanceService.findDefault();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appearanceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppearanceDto: UpdateAppearanceDto) {
    return this.appearanceService.update(id, updateAppearanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appearanceService.remove(id);
  }

  @Post(':id/set-default')
  setAsDefault(@Param('id') id: string) {
    return this.appearanceService.setAsDefault(id);
  }
}