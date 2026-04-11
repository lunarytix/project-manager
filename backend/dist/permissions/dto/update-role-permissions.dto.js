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
exports.UpdateRolePermissionsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateRolePermissionsDto {
}
exports.UpdateRolePermissionsDto = UpdateRolePermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Listado de permisos a actualizar para el rol',
        example: [
            {
                moduleId: '9c4f2d10-4f0a-4ac8-9258-a5eb5e7f9e65',
                permissionCatalogId: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335',
                isGranted: true,
            },
        ],
        type: [Object],
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateRolePermissionsDto.prototype, "permissions", void 0);
