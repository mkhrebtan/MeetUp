import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { MeetingService } from '../services/meeting.service';
import * as MeetingActions from './meeting.actions';

@Injectable()
export class MeetingEffects {
  private actions$ = inject(Actions);
  private meetingService = inject(MeetingService);

  loadMeeting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MeetingActions.loadMeeting),
      switchMap(({ meetingId }) =>
        this.meetingService.getMeeting(meetingId).pipe(
          map((meeting) => MeetingActions.loadMeetingSuccess({ meeting })),
          catchError((error) => of(MeetingActions.loadMeetingFailure({ error: error.message }))),
        ),
      ),
    ),
  );
}
