import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFrontendAuditEventDto {
  @IsString()
  @IsIn(['FRONTEND_ACTION', 'FRONTEND_ERROR'])
  eventType: 'FRONTEND_ACTION' | 'FRONTEND_ERROR';

  @IsString()
  @MaxLength(3000)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  currentUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  component?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
