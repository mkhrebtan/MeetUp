import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardActions } from './dashboard.actions';
import { tap } from 'rxjs';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.init),
        tap(() => console.log('Dashboard initialized')),
      ),
    { dispatch: false },
  );
}
