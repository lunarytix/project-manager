import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLogFilters, AuditLogsResponse, AuditSettings } from '../models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = `${environment.apiUrl}/audit`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<AuditSettings> {
    return this.http.get<AuditSettings>(`${this.apiUrl}/settings`);
  }

  updateSettings(payload: Partial<Pick<AuditSettings, 'debugModeEnabled' | 'trackReadQueries'>>): Observable<AuditSettings> {
    return this.http.put<AuditSettings>(`${this.apiUrl}/settings`, payload);
  }

  getLogs(filters: AuditLogFilters = {}): Observable<AuditLogsResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<AuditLogsResponse>(`${this.apiUrl}/logs`, { params });
  }

  createFrontendEvent(payload: {
    eventType: 'FRONTEND_ACTION' | 'FRONTEND_ERROR';
    message: string;
    currentUrl?: string;
    component?: string;
    payload?: Record<string, unknown>;
  }): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${this.apiUrl}/frontend-event`, payload);
  }
}
