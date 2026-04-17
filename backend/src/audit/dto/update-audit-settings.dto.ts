import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAuditSettingsDto {
  @IsOptional()
  @IsBoolean()
  debugModeEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  trackReadQueries?: boolean;
}
