import { Routes } from '@angular/router';
import { MeetingsComponent } from './meetings.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { meetingsReducer } from './store/meetings.reducer';
import { MeetingsEffects } from './store/meetings.effects';

export const meetingsRoutes: Routes = [
  {
    path: '',
    providers: [provideState('meetings', meetingsReducer), provideEffects(MeetingsEffects)],
    children: [
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
    ],
  },
];
