import {Routes} from '@angular/router';
import {MeetingsListComponent} from './components/meetings-list/meetings-list.component';
import {MeetingComponent} from './features/meeting/meeting.component';

export const routes: Routes = [
  {
    path: '',
    component: MeetingsListComponent
    component: AppShellComponent,
    children: [
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
