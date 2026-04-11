import { PartialType } from '@nestjs/swagger';
import { CreatePermissionCatalogDto } from './create-permission-catalog.dto';

export class UpdatePermissionCatalogDto extends PartialType(CreatePermissionCatalogDto) {}
