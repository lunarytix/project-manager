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
exports.AppearanceEntity = void 0;
const typeorm_1 = require("typeorm");
let AppearanceEntity = class AppearanceEntity {
};
exports.AppearanceEntity = AppearanceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#3B82F6' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#1E3A8A' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "primaryDarkColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#BFDBFE' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "primaryLightColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#10B981' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "secondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#064E3B' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "secondaryDarkColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#BBFBF2' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "secondaryLightColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#F59E0B' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "tertiaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#92400E' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "tertiaryDarkColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#FEF3C7' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "tertiaryLightColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#FFFFFF' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "backgroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#F8FAFC' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "backgroundSecondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#E2E8F0' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "borderColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#111827' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "textPrimaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#6B7280' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "textSecondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#9CA3AF' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "textMutedColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#EF4444' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "dangerColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#22C55E' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "successColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#F59E0B' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "warningColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#3B82F6' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "infoColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Inter, system-ui, -apple-system, sans-serif' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "fontFamily", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '16px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "fontSize", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '14px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "fontSizeSmall", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '18px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "fontSizeLarge", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '400' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "fontWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1.5' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "lineHeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '0px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "letterSpacing", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'none' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "textShadow", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '8px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "borderRadius", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '4px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "borderRadiusSmall", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '12px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "borderRadiusLarge", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '0 1px 3px rgba(0, 0, 0, 0.1)' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "boxShadow", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '0px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "backdropBlur", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '1' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "backgroundOpacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AppearanceEntity.prototype, "glassEffect", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#FFFFFF' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "inputBackgroundColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#E2E8F0' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "inputBorderColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#3B82F6' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "inputFocusColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '12px 16px' }),
    __metadata("design:type", String)
], AppearanceEntity.prototype, "inputPadding", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], AppearanceEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AppearanceEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AppearanceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AppearanceEntity.prototype, "updatedAt", void 0);
exports.AppearanceEntity = AppearanceEntity = __decorate([
    (0, typeorm_1.Entity)('appearance')
], AppearanceEntity);
