import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MeetingsService } from '../services/meetings.service';
import { MeetingsActions } from './meetings.actions';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class MeetingsEffects {
  private actions$ = inject(Actions);
  private meetingsService = inject(MeetingsService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loadHostedMeetings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.loadHostedMeetings),
      switchMap(({ workspaceId, page, pageSize, searchTerm, passed }) =>
        this.meetingsService
          .getHostedMeetings(workspaceId, page, pageSize, searchTerm, passed)
          .pipe(
            map((meetings) => MeetingsActions.loadHostedMeetingsSuccess({ meetings })),
            catchError((error) =>
              of(
                MeetingsActions.loadHostedMeetingsFailure({
                  error: error.error.detail || error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  loadInvitedMeetings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.loadInvitedMeetings),
      switchMap(({ workspaceId, page, pageSize, searchTerm, passed }) =>
        this.meetingsService
          .getInvitedMeetings(workspaceId, page, pageSize, searchTerm, passed)
          .pipe(
            map((meetings) => MeetingsActions.loadInvitedMeetingsSuccess({ meetings })),
            catchError((error) =>
              of(
                MeetingsActions.loadInvitedMeetingsFailure({
                  error: error.error.detail || error.message,
                }),
              ),
            ),
          ),
      ),
    ),
  );

  createMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.createMeeting),
      switchMap(({ request }) =>
        this.meetingsService.createMeeting(request).pipe(
          map(() => {
            this.router.navigate(['/workspace', request.workspaceId, 'meetings']);
            return MeetingsActions.createMeetingSuccess({
              message: 'Meeting created successfully',
            });
          }),
          catchError((error) =>
            of(
              MeetingsActions.createMeetingFailure({
                error: error.error.detail || error.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.createMeetingSuccess),
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

  createMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.createMeetingFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );

  deleteMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.deleteMeeting),
      switchMap(({ meetingId, passed, searchTerm }) =>
        this.meetingsService.deleteMeeting(meetingId).pipe(
          map(() => {
            return MeetingsActions.deleteMeetingSuccess({
              message: 'Meeting deleted successfully',
              passed,
              searchTerm,
            });
          }),
          catchError((error) =>
            of(
              MeetingsActions.deleteMeetingFailure({ error: error.error.detail || error.message }),
            ),
          ),
        ),
      ),
    ),
  );

  reloadMeetingsAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.deleteMeetingSuccess),
      switchMap(({ passed, searchTerm }) => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (workspaceId) {
          return [
            MeetingsActions.loadHostedMeetings({ workspaceId, passed, searchTerm }),
            MeetingsActions.loadInvitedMeetings({ workspaceId, passed, searchTerm }),
          ];
        }
        return [];
      }),
    ),
  );

  deleteMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.deleteMeetingSuccess),
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

  deleteMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.deleteMeetingFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );

  joinMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.joinMeeting),
      switchMap(({ inviteCode }) =>
        this.meetingsService.joinMeeting(inviteCode).pipe(
          map(() => {
            return MeetingsActions.joinMeetingSuccess({
              message: 'Successfully joined the meeting',
            });
          }),
          catchError((error) =>
            of(MeetingsActions.joinMeetingFailure({ error: error.error.detail || error.message })),
          ),
        ),
      ),
    ),
  );

  reloadMeetingsAfterJoin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.joinMeetingSuccess),
      switchMap(() => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (workspaceId) {
          return [
            MeetingsActions.loadHostedMeetings({ workspaceId }),
            MeetingsActions.loadInvitedMeetings({ workspaceId }),
          ];
        }
        return [];
      }),
    ),
  );

  joinMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.joinMeetingSuccess),
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

  joinMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.joinMeetingFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );

  leaveMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.leaveMeeting),
      switchMap(({ meetingId }) =>
        this.meetingsService.leaveMeeting(meetingId).pipe(
          map(() => {
            return MeetingsActions.leaveMeetingSuccess({
              message: 'Successfully left the meeting',
            });
          }),
          catchError((error) =>
            of(MeetingsActions.leaveMeetingFailure({ error: error.error.detail || error.message })),
          ),
        ),
      ),
    ),
  );

  reloadMeetingsAfterLeave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingsActions.leaveMeetingSuccess),
      switchMap(() => {
        const workspaceId = localStorage.getItem('activeWorkspaceId');
        if (workspaceId) {
          return [
            MeetingsActions.loadHostedMeetings({ workspaceId }),
            MeetingsActions.loadInvitedMeetings({ workspaceId }),
          ];
        }
        return [];
      }),
    ),
  );

  leaveMeetingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.leaveMeetingSuccess),
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

  leaveMeetingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MeetingsActions.leaveMeetingFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );
}
