import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MeetingState } from './meeting.state';

export const selectMeetingState = createFeatureSelector<MeetingState>('meeting');

export const selectMeeting = createSelector(selectMeetingState, (state) => state.meeting);

export const selectMeetingLoading = createSelector(selectMeetingState, (state) => state.loading);

export const selectMeetingError = createSelector(selectMeetingState, (state) => state.error);
