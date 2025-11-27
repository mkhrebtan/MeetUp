import { createReducer, on } from '@ngrx/store';
import { WorkspaceActions } from './workspace.actions';
import { initialState } from './workspace.state';

export const workspaceReducer = createReducer(
  initialState,
  on(WorkspaceActions.loadWorkspace, (state) => ({
    ...state,
    loading: {
      workspace: true,
      join: false,
      create: false,
      settings: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
      settings: null,
    },
  })),
  on(WorkspaceActions.loadWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.loadWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    error: {
      create: null,
      workspace: error,
      join: null,
      settings: null,
    },
  })),
  on(WorkspaceActions.createWorkspace, (state) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: true,
      settings: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
      settings: null,
    },
  })),
  on(WorkspaceActions.createWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.createWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    error: {
      create: error,
      workspace: null,
      join: null,
      settings: null,
    },
  })),
  on(WorkspaceActions.joinWorkspace, (state) => ({
    ...state,
    loading: {
      workspace: false,
      join: true,
      create: false,
      settings: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
      settings: null,
    },
  })),
  on(WorkspaceActions.joinWorkspaceSuccess, (state, { workspace }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.joinWorkspaceFailure, (state, { error }) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    error: {
      create: null,
      workspace: null,
      join: error,
      settings: null,
    },
  })),
  on(WorkspaceActions.updateSettings, (state) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
      settings: true,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
      settings: null,
    },
  })),
  on(
    WorkspaceActions.updateSettingsSuccess,
    (state, { name, invitationPolicy, meetingsCreationPolicy }) => ({
      ...state,
      loading: {
        workspace: false,
        join: false,
        create: false,
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
      workspace: false,
      join: false,
      create: false,
      settings: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
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
);
