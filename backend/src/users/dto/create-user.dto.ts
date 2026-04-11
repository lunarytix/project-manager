import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Administrador Principal' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'admin@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '3b6db4f4-9c2f-454f-a06e-08d6e16f24db' })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: '/uploads/profile/profile-1742975500012.png' })
  @IsOptional()
  @IsString()
  photo?: string;
}
