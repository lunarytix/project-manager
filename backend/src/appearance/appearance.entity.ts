import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('appearance')
export class AppearanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Primary colors
  @Column({ default: '#3B82F6' })
  primaryColor: string;

  @Column({ default: '#1E3A8A' })
  primaryDarkColor: string;

  @Column({ default: '#BFDBFE' })
  primaryLightColor: string;

  // Secondary colors
  @Column({ default: '#10B981' })
  secondaryColor: string;

  @Column({ default: '#064E3B' })
  secondaryDarkColor: string;

  @Column({ default: '#BBFBF2' })
  secondaryLightColor: string;

  // Tertiary colors
  @Column({ default: '#F59E0B' })
  tertiaryColor: string;

  @Column({ default: '#92400E' })
  tertiaryDarkColor: string;

  @Column({ default: '#FEF3C7' })
  tertiaryLightColor: string;

  // Background colors
  @Column({ default: '#FFFFFF' })
  backgroundColor: string;

  @Column({ default: '#F8FAFC' })
  backgroundSecondaryColor: string;

  @Column({ default: '#E2E8F0' })
  borderColor: string;

  // Text colors
  @Column({ default: '#111827' })
  textPrimaryColor: string;

  @Column({ default: '#6B7280' })
  textSecondaryColor: string;

  @Column({ default: '#9CA3AF' })
  textMutedColor: string;

  // Status colors
  @Column({ default: '#EF4444' })
  dangerColor: string;

  @Column({ default: '#22C55E' })
  successColor: string;

  @Column({ default: '#F59E0B' })
  warningColor: string;

  @Column({ default: '#3B82F6' })
  infoColor: string;

  // Typography settings
  @Column({ default: 'Inter, system-ui, -apple-system, sans-serif' })
  fontFamily: string;

  @Column({ default: '16px' })
  fontSize: string;

  @Column({ default: '14px' })
  fontSizeSmall: string;

  @Column({ default: '18px' })
  fontSizeLarge: string;

  @Column({ default: '400' })
  fontWeight: string;

  @Column({ default: '1.5' })
  lineHeight: string;

  @Column({ default: '0px' })
  letterSpacing: string;

  // Visual effects
  @Column({ default: 'none' })
  textShadow: string;

  @Column({ default: '8px' })
  borderRadius: string;

  @Column({ default: '4px' })
  borderRadiusSmall: string;

  @Column({ default: '12px' })
  borderRadiusLarge: string;

  @Column({ default: '0 1px 3px rgba(0, 0, 0, 0.1)' })
  boxShadow: string;

  @Column({ default: '0px' })
  backdropBlur: string;

  @Column({ default: '1' })
  backgroundOpacity: string;

  @Column({ default: false })
  glassEffect: boolean;

  // Input styles
  @Column({ default: '#FFFFFF' })
  inputBackgroundColor: string;

  @Column({ default: '#E2E8F0' })
  inputBorderColor: string;

  @Column({ default: '#3B82F6' })
  inputFocusColor: string;

  @Column({ default: '12px 16px' })
  inputPadding: string;

  // Component-specific styles
  @Column({ default: '#FFFFFF' })
  gridHeaderBgColor: string;

  @Column({ default: '#FFFFFF' })
  gridBodyBgColor: string;

  @Column({ default: '#3B82F6' })
  gridIconColor: string;

  @Column({ default: '#F8FAFC' })
  tableHeaderBgColor: string;

  @Column({ default: '#FFFFFF' })
  tableRowBgColor: string;

  @Column({ default: '#FFFFFF' })
  menuBgColor: string;

  @Column({ default: '#111827' })
  menuTextColor: string;

  @Column({ default: '#FFFFFF' })
  loginBackgroundColor: string;

  @Column({ default: '#FFFFFF' })
  loginFormBgColor: string;

  @Column({ default: '#111827' })
  loginHeaderColor: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
