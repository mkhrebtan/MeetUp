import { Routes } from '@angular/router';
import { RecordsComponent } from './records.component';
import { RECORDS_PROVIDERS } from './records.config';

export const recordsRoutes: Routes = [
  {
    path: '',
    component: RecordsComponent,
    providers: RECORDS_PROVIDERS,
  },
];
