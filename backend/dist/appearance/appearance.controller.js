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
exports.AppearanceController = void 0;
const common_1 = require("@nestjs/common");
const appearance_service_1 = require("./appearance.service");
const create_appearance_dto_1 = require("./dto/create-appearance.dto");
const update_appearance_dto_1 = require("./dto/update-appearance.dto");
const permission_guard_1 = require("../guards/permission.guard");
let AppearanceController = class AppearanceController {
    constructor(appearanceService) {
        this.appearanceService = appearanceService;
    }
    create(createAppearanceDto) {
        return this.appearanceService.create(createAppearanceDto);
    }
    findAll() {
        return this.appearanceService.findAll();
    }
    findDefault() {
        return this.appearanceService.findDefault();
    }
    findOne(id) {
        return this.appearanceService.findOne(id);
    }
    update(id, updateAppearanceDto) {
        return this.appearanceService.update(id, updateAppearanceDto);
    }
    remove(id) {
        return this.appearanceService.remove(id);
    }
    setAsDefault(id) {
        return this.appearanceService.setAsDefault(id);
    }
};
exports.AppearanceController = AppearanceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appearance_dto_1.CreateAppearanceDto]),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('default'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "findDefault", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appearance_dto_1.UpdateAppearanceDto]),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/set-default'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppearanceController.prototype, "setAsDefault", null);
exports.AppearanceController = AppearanceController = __decorate([
    (0, common_1.Controller)('appearance'),
    (0, common_1.UseGuards)(permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [appearance_service_1.AppearanceService])
], AppearanceController);
