import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @IsUUID()
  @IsNotEmpty()
  moduleId!: string;

  @IsUUID()
  @IsNotEmpty()
  permissionCatalogId!: string;

  @IsBoolean()
  @IsOptional()
  isGranted?: boolean;
}
