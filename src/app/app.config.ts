import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpToastInterceptor } from './interceptors/toastService';
import { ToastService } from './components/toast/service/toast.service';
import { provideClientHydration } from '@angular/platform-browser';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([JwtInterceptor])),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideHttpClient(withInterceptors([HttpToastInterceptor])),
    ToastService,
  ],
};

export const API_CONFIG = { baseUrl: 'http://localhost:9090' };
