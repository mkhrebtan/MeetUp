import { EnvironmentProviders, Provider } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { recordsFeature } from './store/records.reducer';
import { RecordsEffects } from './store/records.effects';

export const RECORDS_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState(recordsFeature),
  provideEffects(RecordsEffects),
];
