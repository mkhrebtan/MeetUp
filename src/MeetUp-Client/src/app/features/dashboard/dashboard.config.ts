import { EnvironmentProviders, Provider } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dashboardFeature } from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';

export const DASHBOARD_PROVIDERS: (Provider | EnvironmentProviders)[] = [
  provideState(dashboardFeature),
  provideEffects(DashboardEffects),
];
