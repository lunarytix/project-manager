"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_entity_1 = require("./module.entity");
let ModulesService = class ModulesService {
    constructor(repo) {
        this.repo = repo;
    }
    create(createDto) {
        const entity = this.repo.create(createDto);
        return this.repo.save(entity);
    }
    findAll() {
        return this.repo.find();
    }
    findOne(id) {
        return this.repo.findOneBy({ id });
    }
    async update(id, updateDto) {
        const entity = await this.repo.findOneBy({ id });
        if (!entity)
            throw new common_1.NotFoundException('Module not found');
        Object.assign(entity, updateDto);
        return this.repo.save(entity);
    }
    async remove(id) {
        const res = await this.repo.delete(id);
        return { affected: res.affected };
    }
    findByRole(roleId) {
        return this.repo.createQueryBuilder('m').where("json_extract(m.rolesPermitidos, '$') LIKE :r", { r: `%${roleId}%` }).getMany();
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModulesService);
