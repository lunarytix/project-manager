import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppearanceDto {
  @ApiProperty({ example: 'Tema Corporativo Azul' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Tema principal para el sistema administrativo' })
  @IsString()
  @IsOptional()
  description?: string;

  // Primary colors
  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @ApiPropertyOptional({ example: '#1E3A8A' })
  @IsHexColor()
  @IsOptional()
  primaryDarkColor?: string;

  @ApiPropertyOptional({ example: '#BFDBFE' })
  @IsHexColor()
  @IsOptional()
  primaryLightColor?: string;

  // Secondary colors
  @ApiPropertyOptional({ example: '#10B981' })
  @IsHexColor()
  @IsOptional()
  secondaryColor?: string;

  @IsHexColor()
  @IsOptional()
  secondaryDarkColor?: string;

  @IsHexColor()
  @IsOptional()
  secondaryLightColor?: string;

  // Tertiary colors
  @IsHexColor()
  @IsOptional()
  tertiaryColor?: string;

  @IsHexColor()
  @IsOptional()
  tertiaryDarkColor?: string;

  @IsHexColor()
  @IsOptional()
  tertiaryLightColor?: string;

  // Background colors
  @ApiPropertyOptional({ example: '#FFFFFF' })
  @IsHexColor()
  @IsOptional()
  backgroundColor?: string;

  @ApiPropertyOptional({ example: '#F8FAFC' })
  @IsHexColor()
  @IsOptional()
  backgroundSecondaryColor?: string;

  @IsHexColor()
  @IsOptional()
  borderColor?: string;

  // Text colors
  @ApiPropertyOptional({ example: '#111827' })
  @IsHexColor()
  @IsOptional()
  textPrimaryColor?: string;

  @ApiPropertyOptional({ example: '#6B7280' })
  @IsHexColor()
  @IsOptional()
  textSecondaryColor?: string;

  @IsHexColor()
  @IsOptional()
  textMutedColor?: string;

  // Status colors
  @IsHexColor()
  @IsOptional()
  dangerColor?: string;

  @IsHexColor()
  @IsOptional()
  successColor?: string;

  @IsHexColor()
  @IsOptional()
  warningColor?: string;

  @IsHexColor()
  @IsOptional()
  infoColor?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  // Component-specific styles
  @ApiPropertyOptional({ example: '#4A90E2' })
  @IsString()
  @IsOptional()
  gridHeaderBgColor?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @IsString()
  @IsOptional()
  gridBodyBgColor?: string;

  @ApiPropertyOptional({ example: '#3B82F6' })
  @IsString()
  @IsOptional()
  gridIconColor?: string;

  @IsString()
  @IsOptional()
  tableHeaderBgColor?: string;

  @IsString()
  @IsOptional()
  tableRowBgColor?: string;

  @IsString()
  @IsOptional()
  menuBgColor?: string;

  @IsString()
  @IsOptional()
  menuTextColor?: string;

  @IsString()
  @IsOptional()
  loginBackgroundColor?: string;

  @IsString()
  @IsOptional()
  loginFormBgColor?: string;

  @IsString()
  @IsOptional()
  loginHeaderColor?: string;

  @ApiPropertyOptional({ example: '/uploads/login/background.jpg' })
  @IsString()
  @IsOptional()
  loginBackgroundImage?: string;

  @IsString()
  @IsOptional()
  loginBackgroundSize?: string;

  @IsString()
  @IsOptional()
  loginBackgroundPosition?: string;

  @IsString()
  @IsOptional()
  loginBackgroundRepeat?: string;

  @ApiPropertyOptional({ example: 0.5 })
  @IsOptional()
  loginBackgroundOverlayOpacity?: number;
}
