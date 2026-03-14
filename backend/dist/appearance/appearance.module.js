"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppearanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const appearance_service_1 = require("./appearance.service");
const appearance_controller_1 = require("./appearance.controller");
const appearance_entity_1 = require("./appearance.entity");
let AppearanceModule = class AppearanceModule {
};
exports.AppearanceModule = AppearanceModule;
exports.AppearanceModule = AppearanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([appearance_entity_1.AppearanceEntity])],
        controllers: [appearance_controller_1.AppearanceController],
        providers: [appearance_service_1.AppearanceService],
        exports: [appearance_service_1.AppearanceService],
    })
], AppearanceModule);
