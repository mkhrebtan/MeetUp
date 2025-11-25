import { Routes } from '@angular/router';
import { MeetingsComponent } from './meetings.component';

export const meetingsRoutes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create-meeting/create-meeting.component').then(
        (m) => m.CreateMeetingComponent,
      ),
  },
];
