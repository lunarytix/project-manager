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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const typeorm_1 = require("typeorm");
const audit_service_1 = require("../audit.service");
const user_entity_1 = require("../../users/user.entity");
const module_entity_1 = require("../../modules/module.entity");
const role_entity_1 = require("../../roles/role.entity");
let AuditLogInterceptor = class AuditLogInterceptor {
    constructor(auditService, dataSource) {
        this.auditService = auditService;
        this.dataSource = dataSource;
    }
    sanitizePayload(payload) {
        if (!payload || typeof payload !== 'object')
            return null;
        const clone = JSON.parse(JSON.stringify(payload));
        const sensitiveKeys = ['password', 'token', 'authorization'];
        for (const key of Object.keys(clone)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                clone[key] = '***';
            }
        }
        try {
            return JSON.stringify(clone);
        }
        catch {
            return null;
        }
    }
    getModuleRuta(path) {
        let route = path.replace(/^\/api/, '');
        const parts = route.split('/').filter(Boolean);
        if (parts.length === 0)
            return '/';
        return '/' + parts[0];
    }
    mapActionType(method) {
        switch (method) {
            case 'GET':
                return 'CONSULTA';
            case 'POST':
                return 'INSERTAR';
            case 'PUT':
            case 'PATCH':
                return 'MODIFICAR';
            case 'DELETE':
                return 'ELIMINAR';
            default:
                return method;
        }
    }
    extractUserIdFromAuthHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return null;
        const token = authHeader.replace('Bearer ', '').trim();
        const prefix = 'fake-jwt-token-';
        if (!token.startsWith(prefix))
            return null;
        return token.substring(prefix.length);
    }
    async createAuditLog(req, res, note) {
        const method = (req.method || 'GET').toUpperCase();
        const shouldLog = await this.auditService.shouldLogRequest(method);
        if (!shouldLog)
            return;
        const moduleRuta = this.getModuleRuta(req.path || req.url || '/');
        const moduleRepo = this.dataSource.getRepository(module_entity_1.ModuleEntity);
        const userRepo = this.dataSource.getRepository(user_entity_1.UserEntity);
        const roleRepo = this.dataSource.getRepository(role_entity_1.RoleEntity);
        const module = await moduleRepo.findOne({ where: { ruta: moduleRuta } });
        const userId = this.extractUserIdFromAuthHeader(req.headers.authorization);
        let userEmail = null;
        let userNombre = null;
        let roleId = null;
        if (userId) {
            const user = await userRepo.findOne({ where: { id: userId } });
            if (user) {
                userEmail = user.email;
                userNombre = user.nombre;
                roleId = user.roleId;
                if (roleId && roleId.length >= 40) {
                    const role = await roleRepo.findOne({ where: { id: roleId } });
                    if (role?.nombre) {
                        roleId = `${roleId} (${role.nombre})`;
                    }
                }
            }
        }
        const debugEnabled = await this.auditService.isDebugEnabled();
        const queryData = debugEnabled ? this.sanitizePayload(req.query) : null;
        const bodyData = debugEnabled ? this.sanitizePayload(req.body) : null;
        await this.auditService.createLog({
            userId,
            userEmail,
            userNombre,
            roleId,
            moduleRuta,
            moduleNombre: module?.nombre || null,
            actionType: this.mapActionType(method),
            method,
            endpoint: req.originalUrl || req.url,
            statusCode: res.statusCode || 0,
            ipAddress: (req.ip || req.socket?.remoteAddress || null),
            userAgent: (req.headers['user-agent'] || null),
            queryData,
            bodyData,
            note: note || null,
        });
        if (debugEnabled) {
            console.log(`🧭 AUDIT ${method} ${moduleRuta} - user=${userEmail || 'anonymous'} status=${res.statusCode}`);
        }
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                this.createAuditLog(req, res).catch((err) => {
                    console.error('Error creating audit log:', err?.message || err);
                });
            },
            error: (err) => {
                this.createAuditLog(req, res, err?.message || 'Request failed').catch((auditErr) => {
                    console.error('Error creating audit log:', auditErr?.message || auditErr);
                });
            },
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        typeorm_1.DataSource])
], AuditLogInterceptor);
