import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { RecordingsService } from '../services/recordings.service';
import { RecordsActions } from './records.actions';

@Injectable()
export class RecordsEffects {
  private readonly actions$ = inject(Actions);
  private readonly recordingsService = inject(RecordingsService);

  loadRecordings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.loadRecordings),
      switchMap(() =>
        this.recordingsService.getRecordings().pipe(
          map((recordings) => RecordsActions.actions.loadRecordingsSuccess({ recordings })),
          catchError((error) => of(RecordsActions.actions.loadRecordingsFailure({ error }))),
        ),
      ),
    ),
  );
}
