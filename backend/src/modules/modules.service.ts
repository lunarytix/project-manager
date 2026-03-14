import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleEntity } from './module.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(@InjectRepository(ModuleEntity) private repo: Repository<ModuleEntity>) {}

  create(createDto: CreateModuleDto) {
    const entity = this.repo.create(createDto as any);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async update(id: string, updateDto: UpdateModuleDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) throw new NotFoundException('Module not found');
    Object.assign(entity, updateDto as any);
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const res = await this.repo.delete(id);
    return { affected: res.affected };
  }

  findByRole(roleId: string) {
    return this.repo.createQueryBuilder('m').where("json_extract(m.rolesPermitidos, '$') LIKE :r", { r: `%${roleId}%` }).getMany();
  }
}
