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
import { recordsFeature } from './records.reducer';

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

  loadSharedRecordings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.loadSharedRecordings),
      switchMap(() =>
        this.recordingsService.getSharedRecordings().pipe(
          map((recordings) => RecordsActions.actions.loadSharedRecordingsSuccess({ recordings })),
          catchError((error) => of(RecordsActions.actions.loadSharedRecordingsFailure({ error }))),
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
        tap(([, workspaceId]) => {
          if (workspaceId) {
            this.router.navigate(['/workspace', workspaceId, 'records', 'watch']);
          }
        }),
      ),
    { dispatch: false },
  );

  loadShareCandidates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.loadShareCandidates),
      withLatestFrom(
        this.store.select(selectActiveWorkspaceId),
        this.store.select(recordsFeature.selectShareRecordingKey),
      ),
      switchMap(([, workspaceId, recordingKey]) => {
        if (!workspaceId || !recordingKey) {
          return of(
            RecordsActions.actions.loadShareCandidatesFailure({
              error: 'Missing workspaceId or recordingKey',
            }),
          );
        }
        return this.recordingsService.getMembersToShare(workspaceId, recordingKey).pipe(
          map((candidates) => RecordsActions.actions.loadShareCandidatesSuccess({ candidates })),
          catchError((error) => of(RecordsActions.actions.loadShareCandidatesFailure({ error }))),
        );
      }),
    ),
  );

  shareRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.shareRecording),
      withLatestFrom(this.store.select(recordsFeature.selectShareRecordingKey)),
      switchMap(([{ recipientIds }, recordingKey]) => {
        if (!recordingKey) {
          return of(
            RecordsActions.actions.shareRecordingFailure({ error: 'Missing recordingKey' }),
          );
        }
        return this.recordingsService.shareRecording(recordingKey, recipientIds).pipe(
          map(() => RecordsActions.actions.shareRecordingSuccess()),
          catchError((error) => of(RecordsActions.actions.shareRecordingFailure({ error }))),
        );
      }),
    ),
  );

  shareRecordingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecordsActions.actions.shareRecordingSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Recording shared successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  openShareModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.openShareModal),
      map(() => RecordsActions.actions.loadShareCandidates()),
    ),
  );

  deleteRecording$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.deleteRecording),
      switchMap(({ recordingKey }) =>
        this.recordingsService.deleteRecording(recordingKey).pipe(
          map(() =>
            RecordsActions.actions.deleteRecordingSuccess({
              message: 'Recording deleted successfully',
            }),
          ),
          catchError((error) =>
            of(
              RecordsActions.actions.deleteRecordingFailure({
                error: error.error?.detail || error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  reloadRecordingsAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecordsActions.actions.deleteRecordingSuccess),
      switchMap(() => [
        RecordsActions.actions.loadRecordings(),
        RecordsActions.actions.loadSharedRecordings(),
      ]),
    ),
  );

  deleteRecordingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecordsActions.actions.deleteRecordingSuccess),
        tap(({ message }) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
          });
        }),
      ),
    { dispatch: false },
  );

  deleteRecordingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecordsActions.actions.deleteRecordingFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: typeof error === 'string' ? error : 'Failed to delete recording',
          });
        }),
      ),
    { dispatch: false },
  );
}
