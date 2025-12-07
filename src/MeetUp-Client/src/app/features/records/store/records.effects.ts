import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { RecordingsService } from '../services/recordings.service';
import { RecordsActions } from './records.actions';

import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { selectActiveWorkspaceId } from '../../workspace/store/workspace.selectors';
import { withLatestFrom } from 'rxjs';

@Injectable()
export class RecordsEffects {
  private readonly actions$ = inject(Actions);
  private readonly recordingsService = inject(RecordingsService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

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

  getRecordingUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.getRecordingUrl),
      switchMap(({ recordingKey }) =>
        this.recordingsService.getRecordingUrl(recordingKey).pipe(
          map((url) => RecordsActions.actions.getRecordingUrlSuccess({ url })),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to fetch recording URL',
            });
            return of(RecordsActions.actions.getRecordingUrlFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getRecordingUrlSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecordsActions.actions.getRecordingUrlSuccess),
        withLatestFrom(this.store.select(selectActiveWorkspaceId)),
        tap(([_, workspaceId]) => {
          if (workspaceId) {
            this.router.navigate(['/workspace', workspaceId, 'records', 'watch']);
          }
        }),
      ),
    { dispatch: false },
  );
}
