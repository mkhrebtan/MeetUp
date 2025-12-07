import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardActions } from './dashboard.actions';
import { switchMap, map, catchError, of } from 'rxjs';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private dashboardService = inject(DashboardService);

  loadKpis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadKpis),
      switchMap(() => this.dashboardService.getKpis()),
      map((kpis) => DashboardActions.loadKpisSuccess({ kpis })),
      catchError((error) => of(DashboardActions.loadKpisFailure({ error: error.error.detail }))),
    ),
  );

  loadMeetings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadMeetings),
      switchMap(() => this.dashboardService.getMeetings(3)),
      map((meetings) => DashboardActions.loadMeetingsSuccess({ meetings })),
      catchError((error) =>
        of(DashboardActions.loadMeetingsFailure({ error: error.error.detail })),
      ),
    ),
  );

  loadRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadRecords),
      switchMap(() => this.dashboardService.getRecentRecords(3)),
      map((records) => DashboardActions.loadRecordsSuccess({ records })),
      catchError((error) => of(DashboardActions.loadRecordsFailure({ error: error.error.detail }))),
    ),
  );
}
