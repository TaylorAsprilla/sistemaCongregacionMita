import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { routes } from './app.routes';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { sessionInterceptor } from './core/interceptors/session/session.interceptor';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    { provide: LOCALE_ID, useValue: 'es' },

    // ORDEN IMPORTANTE: sessionInterceptor debe ir ANTES de loadingInterceptor
    // para que los errores de sesión se manejen antes de ocultar el loading
    provideHttpClient(withFetch(), withInterceptors([sessionInterceptor, loadingInterceptor])),
    provideRouter(routes),
    provideAnimations(),
  ],
};
