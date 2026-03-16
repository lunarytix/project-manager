import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppearanceService } from './core/services/appearance.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    ,
    // Ensure AppearanceService is instantiated during app init so the persisted theme is applied early
    {
      provide: APP_INITIALIZER,
      useFactory: (appearance: AppearanceService) => {
        return () => Promise.resolve();
      },
      deps: [AppearanceService],
      multi: true
    }
  ]
};
