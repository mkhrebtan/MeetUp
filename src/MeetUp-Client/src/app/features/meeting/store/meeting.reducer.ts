import { createReducer, on } from '@ngrx/store';
import { initialMeetingState } from './meeting.state';
import * as MeetingActions from './meeting.actions';

export const meetingReducer = createReducer(
  initialMeetingState,
  on(MeetingActions.loadMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingActions.loadMeetingSuccess, (state, { meeting }) => ({
    ...state,
    meeting,
    loading: false,
  })),
  on(MeetingActions.loadMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
