import { Routes } from '@angular/router';
import { MeetingComponent } from './features/meeting/meeting.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'workspace',
    pathMatch: 'full',
  },
  {
    path: 'workspace',
    loadChildren: () =>
      import('./features/workspace/workspace.routes').then((m) => m.workspaceRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
    canActivate: [],
  },
  {
    path: 'room/:meetingId',
    component: MeetingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
];
