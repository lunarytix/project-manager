import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsHexColor } from 'class-validator';

export class CreateAppearanceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Primary colors
  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @IsHexColor()
  @IsOptional()
  primaryDarkColor?: string;

  @IsHexColor()
  @IsOptional()
  primaryLightColor?: string;

  // Secondary colors
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
  @IsHexColor()
  @IsOptional()
  backgroundColor?: string;

  @IsHexColor()
  @IsOptional()
  backgroundSecondaryColor?: string;

  @IsHexColor()
  @IsOptional()
  borderColor?: string;

  // Text colors
  @IsHexColor()
  @IsOptional()
  textPrimaryColor?: string;

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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}