import { createAction, props } from '@ngrx/store';
import { Meeting } from '../models/meeting.model';

export const loadMeeting = createAction('[Meeting] Load Meeting', props<{ meetingId: string }>());

export const loadMeetingSuccess = createAction(
  '[Meeting] Load Meeting Success',
  props<{ meeting: Meeting }>(),
);

export const loadMeetingFailure = createAction(
  '[Meeting] Load Meeting Failure',
  props<{ error: string }>(),
);
