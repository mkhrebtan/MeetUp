import { Routes } from '@angular/router';
import { RecordsComponent } from './records.component';
import { RECORDS_PROVIDERS } from './records.config';

export const recordsRoutes: Routes = [
  {
    path: '',
    component: RecordsComponent,
    providers: RECORDS_PROVIDERS,
  },
  {
    path: 'watch',
    loadComponent: () =>
      import('./record-player/record-player.component').then((m) => m.RecordPlayerComponent),
  },
];
