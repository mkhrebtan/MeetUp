import {createFeatureSelector, createSelector} from '@ngrx/store';
import {WorkspaceState} from './workspace.state';

export const selectWorkspaceState =
  createFeatureSelector<WorkspaceState>('workspace');

export const selectActiveWorkspace = createSelector(
  selectWorkspaceState,
  state => state.activeWorkspace
);

export const selectActiveWorkspaceId = createSelector(
  selectActiveWorkspace,
  state => state?.id
);

export const selectWorkspaceLoadingState = createSelector(
  selectWorkspaceState,
  state => state.loading
);

export const selectWorkspaceLoading = createSelector(selectWorkspaceLoadingState, loading => loading.workspace);

export const selectWorkspaceLoadingJoin = createSelector(selectWorkspaceLoadingState, loading => loading.join);

export const selectWorkspaceLoadingCreate = createSelector(selectWorkspaceLoadingState, loading => loading.create);

export const selectWorkspaceError = createSelector(
  selectWorkspaceState,
  state => state.error.workspace
);
