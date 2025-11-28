import { createReducer, on } from '@ngrx/store';
import { MembersActions } from './members.actions';
import { initialState } from './members.state';

export const membersReducer = createReducer(
  initialState,
  on(MembersActions.loadMembers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MembersActions.loadMembersSuccess, (state, { pagedList }) => ({
    ...state,
    loading: false,
    members: pagedList,
  })),
  on(MembersActions.loadMembersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
