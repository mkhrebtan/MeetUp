import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingsState } from './meetings.state';

export const selectMeetingsState = createFeatureSelector<MeetingsState>('meetings');

export const selectHostedMeetings = createSelector(
  selectMeetingsState,
  (state) => state.hostedMeetings,
);

export const selectInvitedMeetings = createSelector(
  selectMeetingsState,
  (state) => state.invitedMeetings,
);

export const selectMeetingsLoading = createSelector(selectMeetingsState, (state) => state.loading);

export const selectMeetingsError = createSelector(selectMeetingsState, (state) => state.error);
