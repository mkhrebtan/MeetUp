import { EnvironmentProviders, Provider } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { settingsFeature } from './store/settings.reducer';
import { SettingsEffects } from './store/settings.effects';

export const SETTINGS_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState(settingsFeature),
  provideEffects(SettingsEffects),
];
