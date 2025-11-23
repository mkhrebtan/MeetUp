import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ROOT_STORE_PROVIDERS } from './store';
import { ErrorInterceptor } from './interceptors/error.interceptor';


export const CORE_PROVIDERS = [
  provideHttpClient(withInterceptorsFromDi()),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
  provideStore(),
  provideEffects(),
  ...ROOT_STORE_PROVIDERS,
  ...(isDevMode() ? [provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })] : [])
];
