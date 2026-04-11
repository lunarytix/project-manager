import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@test.com', description: 'Correo del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', minLength: 6, description: 'Contrasena del usuario' })
  @IsString()
  @MinLength(6)
  password: string;
}
