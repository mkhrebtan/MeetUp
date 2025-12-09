import { createReducer, on } from '@ngrx/store';
import { WorkspaceActions } from './workspace.actions';
import { initialState } from './workspace.state';

export const workspaceReducer = createReducer(
  initialState,
  on(WorkspaceActions.loadWorkspace, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      workspace: true,
    },
    error: {
      ...state.error,
      workspace: null,
    },
  })),
  on(WorkspaceActions.loadWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      ...state.loading,
      workspace: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.loadWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      workspace: false,
    },
    error: {
      ...state.error,
      workspace: error,
    },
  })),
  on(WorkspaceActions.createWorkspace, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      create: true,
    },
    error: {
      ...state.error,
      create: null,
    },
  })),
  on(WorkspaceActions.createWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      ...state.loading,
      create: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.createWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      create: false,
    },
    error: {
      ...state.error,
      create: error,
    },
  })),
  on(WorkspaceActions.joinWorkspace, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      join: true,
    },
    error: {
      ...state.error,
      join: null,
    },
  })),
  on(WorkspaceActions.joinWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      ...state.loading,
      join: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.joinWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      join: false,
    },
    error: {
      ...state.error,
      join: error,
    },
  })),
  on(WorkspaceActions.updateSettings, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      settings: true,
    },
    error: {
      ...state.error,
      settings: null,
    },
  })),
  on(
    WorkspaceActions.updateSettingsSuccess,
    (state, { name, invitationPolicy, meetingsCreationPolicy }) => ({
      ...state,
      loading: {
        ...state.loading,
        settings: false,
      },
      activeWorkspace: state.activeWorkspace
        ? {
            ...state.activeWorkspace,
            name,
            invitationPolicy,
            meetingsCreationPolicy,
          }
        : null,
    }),
  ),
  on(WorkspaceActions.updateSettingsFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      settings: false,
    },
    error: {
      ...state.error,
      settings: error,
    },
  })),
  on(WorkspaceActions.leaveWorkspaceSuccess, (state) => ({
    ...state,
    activeWorkspace: null,
  })),
  on(WorkspaceActions.deleteWorkspaceSuccess, (state) => ({
    ...state,
    activeWorkspace: null,
  })),
  on(WorkspaceActions.loadInvitations, (state) => ({
    ...state,
    loading: {
      ...state.loading,
      invitations: true,
    },
    error: {
      ...state.error,
      invitations: null,
    },
  })),
  on(WorkspaceActions.loadInvitationsSuccess, (state, { invitations }) => ({
    ...state,
    loading: {
      ...state.loading,
      invitations: false,
    },
    invitations,
  })),
  on(WorkspaceActions.loadInvitationsFailure, (state, { error }) => ({
    ...state,
    loading: {
      ...state.loading,
      invitations: false,
    },
    error: {
      ...state.error,
      invitations: error,
    },
  })),
);
