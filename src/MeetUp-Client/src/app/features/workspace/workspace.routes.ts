import { Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { WORKSPACE_PROVIDERS } from './workspace.config';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AppShellComponent } from '../../layout/app-shell/app-shell-component';

export const workspaceRoutes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    providers: [WORKSPACE_PROVIDERS],
  },
  {
    path: ':workspaceId',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'meetings',
        loadChildren: () =>
          import('../../features/meetings/meetings.routes').then((m) => m.meetingsRoutes),
      },
      {
        path: 'records',
        loadChildren: () =>
          import('../../features/records/records.routes').then((m) => m.recordsRoutes),
      },
      {
        path: 'members',
        loadChildren: () =>
          import('../../features/members/members.routes').then((m) => m.membersRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
    ],
  },
];
