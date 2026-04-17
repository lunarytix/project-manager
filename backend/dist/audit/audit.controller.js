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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const audit_service_1 = require("./audit.service");
const update_audit_settings_dto_1 = require("./dto/update-audit-settings.dto");
const user_entity_1 = require("../users/user.entity");
const role_entity_1 = require("../roles/role.entity");
let AuditController = class AuditController {
    constructor(auditService, dataSource) {
        this.auditService = auditService;
        this.dataSource = dataSource;
    }
    extractUserIdFromAuthHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No authorization');
        }
        const token = authHeader.replace('Bearer ', '').trim();
        const prefix = 'fake-jwt-token-';
        if (!token.startsWith(prefix)) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return token.substring(prefix.length);
    }
    async ensureAdmin(authHeader) {
        const userId = this.extractUserIdFromAuthHeader(authHeader);
        const userRepo = this.dataSource.getRepository(user_entity_1.UserEntity);
        const roleRepo = this.dataSource.getRepository(role_entity_1.RoleEntity);
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        let roleId = user.roleId;
        let roleName = '';
        if (roleId && roleId.length < 40) {
            roleName = roleId;
        }
        else {
            const role = await roleRepo.findOne({ where: { id: roleId } });
            roleName = role?.nombre || '';
        }
        if ((roleName || '').toLowerCase() !== 'admin') {
            throw new common_1.ForbiddenException('Only admin can access audit');
        }
    }
    async getSettings(authHeader) {
        await this.ensureAdmin(authHeader);
        return this.auditService.getSettings();
    }
    async updateSettings(authHeader, dto) {
        await this.ensureAdmin(authHeader);
        return this.auditService.updateSettings(dto);
    }
    async getLogs(authHeader, userId, moduleRuta, method, actionType, from, to, limit) {
        await this.ensureAdmin(authHeader);
        return this.auditService.getLogs({
            userId,
            moduleRuta,
            method,
            actionType,
            from,
            to,
            limit: limit ? Number(limit) : undefined,
        });
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener configuracion de auditoria/debug (solo admin)' }),
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getSettings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar configuracion de auditoria/debug (solo admin)' }),
    (0, common_1.Put)('settings'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_audit_settings_dto_1.UpdateAuditSettingsDto]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "updateSettings", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar logs de auditoria (solo admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'moduleRuta', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'method', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'actionType', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('moduleRuta')),
    __param(3, (0, common_1.Query)('method')),
    __param(4, (0, common_1.Query)('actionType')),
    __param(5, (0, common_1.Query)('from')),
    __param(6, (0, common_1.Query)('to')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "getLogs", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('Audit'),
    (0, common_1.Controller)('audit'),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        typeorm_1.DataSource])
], AuditController);
