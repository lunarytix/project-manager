import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FrontendAuditService } from '../services/frontend-audit.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private frontendAudit = inject(FrontendAuditService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    console.log('Auth interceptor - token:', token ? 'present' : 'missing', 'url:', request.url);

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        console.error('HTTP Error in interceptor:', error);

        if (!request.url.includes('/api/audit/frontend-event')) {
          this.frontendAudit.logError('HTTP error en interceptor', {
            url: request.url,
            method: request.method,
            status: error?.status,
            statusText: error?.statusText,
            requestBody: request.body || null,
            responseError: error?.error || null,
          }, 'AuthInterceptor');
        }

        if (error && error.status === 403) {
          this.snackBar.open('No tienes permisos para realizar esta acción', 'Cerrar', {
            duration: 5000,
          });
        }
        throw error;
      })
    );
  }
}
