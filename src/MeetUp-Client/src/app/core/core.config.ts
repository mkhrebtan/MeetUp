import {provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {isDevMode} from '@angular/core';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {ROOT_STORE_PROVIDERS} from './store';


export const CORE_PROVIDERS = [
  provideStore(),
  provideEffects(),
  ...ROOT_STORE_PROVIDERS,
  ...(isDevMode() ? [provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()})] : [])
];
