import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: '3b6db4f4-9c2f-454f-a06e-08d6e16f24db' })
  @IsUUID()
  @IsNotEmpty()
  roleId!: string;

  @ApiProperty({ example: '9c4f2d10-4f0a-4ac8-9258-a5eb5e7f9e65' })
  @IsUUID()
  @IsNotEmpty()
  moduleId!: string;

  @ApiProperty({ example: 'ceac4aa4-f78b-4f35-97aa-8f8f8bd8f335' })
  @IsUUID()
  @IsNotEmpty()
  permissionCatalogId!: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isGranted?: boolean;
}
