import { ErrorHandler, Injectable } from '@angular/core';
import { FrontendAuditService } from '../services/frontend-audit.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly frontendAudit: FrontendAuditService) {}

  handleError(error: unknown): void {
    const normalized = this.normalize(error);

    this.frontendAudit.logError(
      normalized.message,
      {
        stack: normalized.stack,
        name: normalized.name,
      },
      'GlobalErrorHandler',
    );

    console.error('Unhandled application error:', error);
  }

  private normalize(error: unknown): { message: string; stack?: string; name?: string } {
    if (error instanceof Error) {
      return {
        message: error.message || 'Unknown frontend error',
        stack: error.stack,
        name: error.name,
      };
    }

    return {
      message: typeof error === 'string' ? error : 'Unknown frontend error',
    };
  }
}
