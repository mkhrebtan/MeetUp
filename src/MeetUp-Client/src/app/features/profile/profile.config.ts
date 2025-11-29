import { EnvironmentProviders, Provider } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { profileFeature } from './store/profile.reducer';
import { ProfileEffects } from './store/profile.effects';

export const PROFILE_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState(profileFeature),
  provideEffects(ProfileEffects),
];
