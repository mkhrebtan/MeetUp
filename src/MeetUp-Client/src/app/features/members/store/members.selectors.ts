import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MembersState } from './members.state';

export const selectMembersState = createFeatureSelector<MembersState>('members');

export const selectMembers = createSelector(
  selectMembersState,
  (state) => state.members?.items || [],
);

export const selectMembersPagedList = createSelector(selectMembersState, (state) => state.members);

export const selectMembersTotalCount = createSelector(
  selectMembersState,
  (state) => state.members?.totalCount || 0,
);

export const selectMembersLoading = createSelector(selectMembersState, (state) => state.loading);

export const selectMembersError = createSelector(selectMembersState, (state) => state.error);
