import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ example: 'Usuarios' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Gestion de usuarios del sistema' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ example: 'group' })
  @IsOptional()
  @IsString()
  icono?: string;

  @ApiProperty({ example: '/users/list' })
  @IsString()
  ruta: string;

  @ApiPropertyOptional({
    example: ['admin', 'supervisor'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  rolesPermitidos?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  activo?: boolean;
}
