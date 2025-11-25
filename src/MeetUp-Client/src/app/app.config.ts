import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {definePreset} from '@primeuix/themes';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {CORE_PROVIDERS} from './core/core.config';
import {AUTH_PROVIDERS} from './features/auth/auth.config';
import {WORKSPACE_PROVIDERS} from './features/workspace/workspace.config';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff4fe',
      100: '#dbe6fd',
      200: '#bfd4fb',
      300: '#93bbf8',
      400: '#609af3',
      500: '#2954b4',
      600: '#2446a3',
      700: '#1e3a84',
      800: '#1d316c',
      900: '#1c2d5a',
      950: '#151d3b'
    }
  }
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: 'none',
        },
      }
    }),
    ...CORE_PROVIDERS,
    ...AUTH_PROVIDERS,
    ...WORKSPACE_PROVIDERS
  ]
};
