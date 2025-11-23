import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromAppActions from '../actions/app.actions';
import { delay, exhaustMap, of } from 'rxjs';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  initApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromAppActions.AppInit),
      exhaustMap(() => of(fromAppActions.AppInitialized()).pipe(delay(3000)))
    )
  );
}