import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_PROVIDERS } from './dashboard.config';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    providers: [DASHBOARD_PROVIDERS],
  },
];
