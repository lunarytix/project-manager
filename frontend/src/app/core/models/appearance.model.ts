export interface Appearance {
  id: string;
  name: string;
  description?: string;

  // Primary colors
  primaryColor: string;
  primaryDarkColor: string;
  primaryLightColor: string;

  // Secondary colors
  secondaryColor: string;
  secondaryDarkColor: string;
  secondaryLightColor: string;

  // Tertiary colors
  tertiaryColor: string;
  tertiaryDarkColor: string;
  tertiaryLightColor: string;

  // Background colors
  backgroundColor: string;
  backgroundSecondaryColor: string;
  borderColor: string;

  // Text colors
  textPrimaryColor: string;
  textSecondaryColor: string;
  textMutedColor: string;

  // Status colors
  dangerColor: string;
  successColor: string;
  warningColor: string;
  infoColor: string;

  // Typography settings
  fontFamily: string;
  fontSize: string;
  fontSizeSmall: string;
  fontSizeLarge: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;

  // Visual effects
  textShadow: string;
  borderRadius: string;
  borderRadiusSmall: string;
  borderRadiusLarge: string;
  boxShadow: string;
  backdropBlur: string;
  backgroundOpacity: string;
  glassEffect: boolean;

  // Input styles
  inputBackgroundColor: string;
  inputBorderColor: string;
  inputFocusColor: string;
  inputPadding: string;

  // Component-specific styles
  gridHeaderBgColor?: string;
  gridBodyBgColor?: string;

  gridIconColor?: string;

  tableHeaderBgColor?: string;
  tableRowBgColor?: string;

  menuBgColor?: string;
  menuTextColor?: string;

  loginBackgroundColor?: string;
  loginFormBgColor?: string;
  loginHeaderColor?: string;

  isActive: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppearanceRequest {
  name: string;
  description?: string;

  // Primary colors
  primaryColor?: string;
  primaryDarkColor?: string;
  primaryLightColor?: string;

  // Secondary colors
  secondaryColor?: string;
  secondaryDarkColor?: string;
  secondaryLightColor?: string;

  // Tertiary colors
  tertiaryColor?: string;
  tertiaryDarkColor?: string;
  tertiaryLightColor?: string;

  // Background colors
  backgroundColor?: string;
  backgroundSecondaryColor?: string;
  borderColor?: string;

  // Text colors
  textPrimaryColor?: string;
  textSecondaryColor?: string;
  textMutedColor?: string;

  // Status colors
  dangerColor?: string;
  successColor?: string;
  warningColor?: string;
  infoColor?: string;

  // Typography settings
  fontFamily?: string;
  fontSize?: string;
  fontSizeSmall?: string;
  fontSizeLarge?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;

  // Visual effects
  textShadow?: string;
  borderRadius?: string;
  borderRadiusSmall?: string;
  borderRadiusLarge?: string;
  boxShadow?: string;
  backdropBlur?: string;
  backgroundOpacity?: string;
  glassEffect?: boolean;

  // Input styles
  inputBackgroundColor?: string;
  inputBorderColor?: string;
  inputFocusColor?: string;
  inputPadding?: string;

  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateAppearanceRequest extends Partial<CreateAppearanceRequest> {}
