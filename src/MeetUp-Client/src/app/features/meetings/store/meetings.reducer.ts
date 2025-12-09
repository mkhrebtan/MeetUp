import { createReducer, on } from '@ngrx/store';
import { MeetingsActions } from './meetings.actions';
import { initialState } from './meetings.state';

export const meetingsReducer = createReducer(
  initialState,
  on(MeetingsActions.loadHostedMeetings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.loadHostedMeetingsSuccess, (state, { meetings }) => ({
    ...state,
    hostedMeetings: meetings.items,
    loading: false,
  })),
  on(MeetingsActions.loadHostedMeetingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MeetingsActions.loadInvitedMeetings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.loadInvitedMeetingsSuccess, (state, { meetings }) => ({
    ...state,
    invitedMeetings: meetings.items,
    loading: false,
  })),
  on(MeetingsActions.loadInvitedMeetingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MeetingsActions.createMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.createMeetingSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(MeetingsActions.createMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MeetingsActions.deleteMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.deleteMeetingSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(MeetingsActions.deleteMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MeetingsActions.joinMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.joinMeetingSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(MeetingsActions.joinMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(MeetingsActions.leaveMeeting, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MeetingsActions.leaveMeetingSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(MeetingsActions.leaveMeetingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
