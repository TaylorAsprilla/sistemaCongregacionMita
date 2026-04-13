import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from './core/interceptors/loading/loading.interceptor';
import { sessionInterceptor } from './core/interceptors/session/session.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },

    // ORDEN IMPORTANTE: sessionInterceptor debe ir ANTES de loadingInterceptor
    // para que los errores de sesión se manejen antes de ocultar el loading
    provideHttpClient(withFetch(), withInterceptors([sessionInterceptor, loadingInterceptor])),
    provideAnimations(),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
};
