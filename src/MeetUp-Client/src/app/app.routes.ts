import {Routes} from '@angular/router';
import {MeetingsListComponent} from './components/meetings-list/meetings-list.component';
import {MeetingComponent} from './features/meeting/meeting.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
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
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'room/:meetingId',
    component: MeetingComponent,
  },
];
