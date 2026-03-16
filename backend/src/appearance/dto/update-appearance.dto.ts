import { PartialType } from '@nestjs/mapped-types';
import { CreateAppearanceDto } from './create-appearance.dto';

export class UpdateAppearanceDto extends PartialType(CreateAppearanceDto) {}
