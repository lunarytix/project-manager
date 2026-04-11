"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppearanceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_appearance_dto_1 = require("./create-appearance.dto");
class UpdateAppearanceDto extends (0, swagger_1.PartialType)(create_appearance_dto_1.CreateAppearanceDto) {
}
exports.UpdateAppearanceDto = UpdateAppearanceDto;
