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
exports.AppearanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appearance_entity_1 = require("./appearance.entity");
let AppearanceService = class AppearanceService {
    constructor(appearanceRepository) {
        this.appearanceRepository = appearanceRepository;
    }
    async create(createAppearanceDto) {
        // If this should be the default theme, unset all other defaults
        if (createAppearanceDto.isDefault) {
            await this.appearanceRepository.update({ isDefault: true }, { isDefault: false });
        }
        const appearance = this.appearanceRepository.create(createAppearanceDto);
        return this.appearanceRepository.save(appearance);
    }
    async findAll() {
        return this.appearanceRepository.find({
            where: { isActive: true },
            order: { isDefault: 'DESC', name: 'ASC' },
        });
    }
    async findOne(id) {
        const appearance = await this.appearanceRepository.findOne({
            where: { id, isActive: true },
        });
        if (!appearance) {
            throw new common_1.NotFoundException(`Tema con ID ${id} no encontrado`);
        }
        return appearance;
    }
    async findDefault() {
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
            throw new common_1.NotFoundException('No se encontró ningún tema activo');
        }
        return appearance;
    }
    async update(id, updateAppearanceDto) {
        const appearance = await this.findOne(id);
        // If this should be the default theme, unset all other defaults
        if (updateAppearanceDto.isDefault) {
            await this.appearanceRepository.update({ isDefault: true, id: (0, typeorm_2.Not)(id) }, { isDefault: false });
        }
        Object.assign(appearance, updateAppearanceDto);
        return this.appearanceRepository.save(appearance);
    }
    async remove(id) {
        const appearance = await this.findOne(id);
        // Don't allow deletion of default theme
        if (appearance.isDefault) {
            throw new common_1.NotFoundException('No se puede eliminar el tema por defecto');
        }
        appearance.isActive = false;
        await this.appearanceRepository.save(appearance);
    }
    async setAsDefault(id) {
        const appearance = await this.findOne(id);
        // Unset all other defaults (only update records that are currently default)
        await this.appearanceRepository.update({ isDefault: true }, { isDefault: false });
        // Set this one as default
        appearance.isDefault = true;
        return this.appearanceRepository.save(appearance);
    }
};
exports.AppearanceService = AppearanceService;
exports.AppearanceService = AppearanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appearance_entity_1.AppearanceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppearanceService);
