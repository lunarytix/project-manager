import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface FrontendAuditEventPayload {
  eventType: 'FRONTEND_ACTION' | 'FRONTEND_ERROR';
  message: string;
  currentUrl?: string;
  component?: string;
  payload?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class FrontendAuditService {
  private apiUrl = `${environment.apiUrl}/audit/frontend-event`;

  constructor(private readonly http: HttpClient) {}

  logAction(message: string, payload?: Record<string, unknown>, component?: string): void {
    this.send({
      eventType: 'FRONTEND_ACTION',
      message,
      payload,
      component,
      currentUrl: this.getCurrentUrl(),
    });
  }

  logError(message: string, payload?: Record<string, unknown>, component?: string): void {
    this.send({
      eventType: 'FRONTEND_ERROR',
      message,
      payload,
      component,
      currentUrl: this.getCurrentUrl(),
    });
  }

  private send(event: FrontendAuditEventPayload): void {
    this.http.post(this.apiUrl, event).subscribe({
      error: () => {
        // No bloquear UX por fallas de auditoria.
      },
    });
  }

  private getCurrentUrl(): string {
    if (typeof window === 'undefined') return '/';
    return `${window.location.pathname}${window.location.search}`;
  }
}
