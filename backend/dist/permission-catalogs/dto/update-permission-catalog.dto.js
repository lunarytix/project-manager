"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionCatalogDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_permission_catalog_dto_1 = require("./create-permission-catalog.dto");
class UpdatePermissionCatalogDto extends (0, swagger_1.PartialType)(create_permission_catalog_dto_1.CreatePermissionCatalogDto) {
}
exports.UpdatePermissionCatalogDto = UpdatePermissionCatalogDto;
