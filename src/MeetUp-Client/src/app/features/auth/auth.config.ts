import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';

export const AUTH_PROVIDERS = [provideState('auth', authReducer), provideEffects(AuthEffects)];
