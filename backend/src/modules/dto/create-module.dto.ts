import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  icono?: string;

  @IsString()
  ruta: string;

  @IsOptional()
  @IsArray()
  rolesPermitidos?: string[];

  @IsOptional()
  activo?: boolean;
}
