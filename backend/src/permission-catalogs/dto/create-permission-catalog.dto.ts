import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionCatalogDto {
  @ApiProperty({ example: 'Leer' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ example: 'Permiso para leer registros de un modulo' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'visibility' })
  @IsOptional()
  @IsString()
  icono?: string;
}
