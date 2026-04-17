import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectControlDto } from './create-project-control.dto';

export class UpdateProjectControlDto extends PartialType(CreateProjectControlDto) {}
