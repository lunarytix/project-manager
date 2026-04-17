import { IsOptional, IsString, MaxLength } from 'class-validator';

export class InitProjectDatabaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  dbName?: string;

  @IsString()
  sqlContent: string;
}
