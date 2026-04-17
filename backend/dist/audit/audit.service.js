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
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_settings_entity_1 = require("./audit-settings.entity");
const audit_log_entity_1 = require("./audit-log.entity");
let AuditService = class AuditService {
    constructor(settingsRepo, logRepo) {
        this.settingsRepo = settingsRepo;
        this.logRepo = logRepo;
    }
    async getSettings() {
        const existing = await this.settingsRepo.findOne({ where: {} });
        if (existing)
            return existing;
        const settings = this.settingsRepo.create({
            debugModeEnabled: false,
            trackReadQueries: false,
        });
        return this.settingsRepo.save(settings);
    }
    async updateSettings(dto) {
        const settings = await this.getSettings();
        Object.assign(settings, dto);
        return this.settingsRepo.save(settings);
    }
    async shouldLogRequest(method) {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method))
            return true;
        if (method === 'GET') {
            const settings = await this.getSettings();
            return settings.trackReadQueries || settings.debugModeEnabled;
        }
        return false;
    }
    async isDebugEnabled() {
        const settings = await this.getSettings();
        return settings.debugModeEnabled;
    }
    async createLog(input) {
        const entity = this.logRepo.create({
            userId: input.userId ?? null,
            userEmail: input.userEmail ?? null,
            userNombre: input.userNombre ?? null,
            roleId: input.roleId ?? null,
            moduleRuta: input.moduleRuta,
            moduleNombre: input.moduleNombre ?? null,
            actionType: input.actionType,
            method: input.method,
            endpoint: input.endpoint,
            statusCode: input.statusCode,
            ipAddress: input.ipAddress ?? null,
            userAgent: input.userAgent ?? null,
            queryData: input.queryData ?? null,
            bodyData: input.bodyData ?? null,
            note: input.note ?? null,
        });
        await this.logRepo.save(entity);
    }
    async getLogs(params) {
        const qb = this.logRepo.createQueryBuilder('l').orderBy('l.createdAt', 'DESC');
        if (params.userId) {
            qb.andWhere('l.userId = :userId', { userId: params.userId });
        }
        if (params.moduleRuta) {
            qb.andWhere('l.moduleRuta LIKE :moduleRuta', { moduleRuta: `%${params.moduleRuta}%` });
        }
        if (params.method) {
            qb.andWhere('l.method = :method', { method: params.method.toUpperCase() });
        }
        if (params.actionType) {
            qb.andWhere('l.actionType LIKE :actionType', { actionType: `%${params.actionType}%` });
        }
        if (params.from) {
            qb.andWhere('l.createdAt >= :from', { from: params.from });
        }
        if (params.to) {
            qb.andWhere('l.createdAt <= :to', { to: params.to });
        }
        const limit = Math.min(Math.max(params.limit ?? 200, 1), 1000);
        qb.take(limit);
        return qb.getMany();
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_settings_entity_1.AuditSettingsEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLogEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuditService);
