import { Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { WORKSPACE_PROVIDERS } from './workspace.config';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AppShellComponent } from '../../layout/app-shell/app-shell-component';
import { WorkspaceGuard } from '../../core/guards/workspace.guard';

export const workspaceRoutes: Routes = [
  {
    path: '',
    component: WorkspaceComponent,
    providers: [WORKSPACE_PROVIDERS],
    children: [
      {
        // mounted at /workspace (from app.routes) so this should only be the dynamic id segment
        path: ':workspaceId',
        component: AppShellComponent,
        canActivate: [AuthGuard, WorkspaceGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          },
          {
            // remove the duplicate 'workspace/' prefix so this becomes /workspace/:workspaceId/dashboard
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
          {
            path: 'profile',
            loadChildren: () =>
              import('../../features/profile/profile.routes').then((m) => m.profileRoutes),
          },
        ],
      },
    ],
  },
];
