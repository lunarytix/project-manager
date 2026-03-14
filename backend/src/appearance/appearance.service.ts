import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateAppearanceDto } from './dto/create-appearance.dto';
import { UpdateAppearanceDto } from './dto/update-appearance.dto';
import { AppearanceEntity } from './appearance.entity';

@Injectable()
export class AppearanceService {
  constructor(
    @InjectRepository(AppearanceEntity)
    private appearanceRepository: Repository<AppearanceEntity>,
  ) {}

  async create(createAppearanceDto: CreateAppearanceDto): Promise<AppearanceEntity> {
    // If this should be the default theme, unset all other defaults
    if (createAppearanceDto.isDefault) {
      await this.appearanceRepository.update({ isDefault: true }, { isDefault: false });
    }

    const appearance = this.appearanceRepository.create(createAppearanceDto);
    return this.appearanceRepository.save(appearance);
  }

  async findAll(): Promise<AppearanceEntity[]> {
    return this.appearanceRepository.find({
      where: { isActive: true },
      order: { isDefault: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AppearanceEntity> {
    const appearance = await this.appearanceRepository.findOne({
      where: { id, isActive: true },
    });

    if (!appearance) {
      throw new NotFoundException(`Tema con ID ${id} no encontrado`);
    }

    return appearance;
  }

  async findDefault(): Promise<AppearanceEntity> {
    let appearance = await this.appearanceRepository.findOne({
      where: { isDefault: true, isActive: true },
    });

    // If no default found, get the first one
    if (!appearance) {
      appearance = await this.appearanceRepository.findOne({
        where: { isActive: true },
        order: { createdAt: 'ASC' },
      });
    }

    if (!appearance) {
      throw new NotFoundException('No se encontró ningún tema activo');
    }

    return appearance;
  }

  async update(id: string, updateAppearanceDto: UpdateAppearanceDto): Promise<AppearanceEntity> {
    const appearance = await this.findOne(id);

    // If this should be the default theme, unset all other defaults
    if (updateAppearanceDto.isDefault) {
      await this.appearanceRepository.update(
        { isDefault: true, id: Not(id) },
        { isDefault: false }
      );
    }

    Object.assign(appearance, updateAppearanceDto);
    return this.appearanceRepository.save(appearance);
  }

  async remove(id: string): Promise<void> {
    const appearance = await this.findOne(id);
    
    // Don't allow deletion of default theme
    if (appearance.isDefault) {
      throw new NotFoundException('No se puede eliminar el tema por defecto');
    }

    appearance.isActive = false;
    await this.appearanceRepository.save(appearance);
  }

  async setAsDefault(id: string): Promise<AppearanceEntity> {
    const appearance = await this.findOne(id);
    
    // Unset all other defaults (only update records that are currently default)
    await this.appearanceRepository.update({ isDefault: true }, { isDefault: false });
    
    // Set this one as default
    appearance.isDefault = true;
    return this.appearanceRepository.save(appearance);
  }
}