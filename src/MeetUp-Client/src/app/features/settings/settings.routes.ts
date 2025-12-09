import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SETTINGS_PROVIDERS } from './settings.config';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    providers: SETTINGS_PROVIDERS,
  },
];
