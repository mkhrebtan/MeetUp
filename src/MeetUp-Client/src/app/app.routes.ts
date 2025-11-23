import {Routes} from '@angular/router';
import {MeetingComponent} from './features/meeting/pages/meeting.component';
import {AppShellComponent} from './layout/app-shell/app-shell-component';
import {AuthGuard} from './core/guards/auth.guard';
import {WorkspaceGuard} from './core/guards/workspace.guard';
import {NoWorkspaceGuard} from './core/guards/no-workspace.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard, WorkspaceGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
      },
      {
        path: 'meetings',
        loadChildren: () => import('./features/meetings/meetings.routes').then(m => m.meetingsRoutes),
      },
      {
        path: 'records',
        loadChildren: () => import('./features/records/records.routes').then(m => m.recordsRoutes),
      },
      {
        path: 'members',
        loadChildren: () => import('./features/members/members.routes').then(m => m.membersRoutes),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes),
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'room/:meetingId',
    component: MeetingComponent,
    canActivate: [AuthGuard, WorkspaceGuard],
  },
  {
    path: 'workspace',
    canActivate: [AuthGuard, NoWorkspaceGuard],
    loadChildren: () => import('./features/workspace/workspace.routes').then(m => m.workspaceRoutes),
  },
];

