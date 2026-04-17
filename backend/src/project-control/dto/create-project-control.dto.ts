import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectControlDto {
  @IsString()
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsString()
  @MaxLength(1000)
  gitUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  gitBranch?: string;

  @IsOptional()
  @IsString()
  @IsIn(['auto', 'frontend', 'backend', 'fullstack'])
  scope?: 'auto' | 'frontend' | 'backend' | 'fullstack';

  @IsOptional()
  @IsString()
  @MaxLength(120)
  dbName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  dbEngine?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  installCommand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  startCommand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  frontendStartCommand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  backendStartCommand?: string;
}
