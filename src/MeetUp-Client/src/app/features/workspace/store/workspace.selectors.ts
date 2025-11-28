import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkspaceState } from './workspace.state';

export const selectWorkspaceState = createFeatureSelector<WorkspaceState>('workspace');

export const selectActiveWorkspace = createSelector(
  selectWorkspaceState,
  (state) => state.activeWorkspace,
);

export const selectActiveWorkspaceId = createSelector(selectActiveWorkspace, (state) => state?.id);

export const selectWorkspaceLoadingState = createSelector(
  selectWorkspaceState,
  (state) => state.loading,
);

export const selectWorkspaceLoading = createSelector(
  selectWorkspaceLoadingState,
  (loading) => loading.workspace,
);

export const selectWorkspaceLoadingJoin = createSelector(
  selectWorkspaceLoadingState,
  (loading) => loading.join,
);

export const selectWorkspaceLoadingCreate = createSelector(
  selectWorkspaceLoadingState,
  (loading) => loading.create,
);

export const selectWorkspaceError = createSelector(
  selectWorkspaceState,
  (state) => state.error.workspace,
);

export const selectWorkspaceErrorJoin = createSelector(
  selectWorkspaceState,
  (state) => state.error.join,
);

export const selectWorkspaceErrorCreate = createSelector(
  selectWorkspaceState,
  (state) => state.error.create,
);

export const selectWorkspaceName = createSelector(selectActiveWorkspace, (state) => state?.name);

export const selectWorkspaceInvitationPolicy = createSelector(
  selectActiveWorkspace,
  (state) => state?.invitationPolicy,
);

export const selectWorkspaceMeetingsCreationPolicy = createSelector(
  selectActiveWorkspace,
  (state) => state?.meetingsCreationPolicy,
);

export const selectWorkspaceLoadingSettings = createSelector(
  selectWorkspaceLoadingState,
  (loading) => loading.settings,
);

export const selectWorkspaceErrorSettings = createSelector(
  selectWorkspaceState,
  (state) => state.error.settings,
);

export const selectActiveWorkspaceInviteCode = createSelector(
  selectActiveWorkspace,
  (state) => state?.inviteCode,
);

export const selectInvitations = createSelector(
  selectWorkspaceState,
  (state) => state.invitations,
);

export const selectInvitationsLoading = createSelector(
  selectWorkspaceLoadingState,
  (loading) => loading.invitations,
);

export const selectInvitationsError = createSelector(
  selectWorkspaceState,
  (state) => state.error.invitations,
);
