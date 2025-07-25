import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import customAuraPreset from './custom-aura-preset';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: customAuraPreset
      }
    })
  ]
};
