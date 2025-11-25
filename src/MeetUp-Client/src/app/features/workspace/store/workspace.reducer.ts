import {createReducer, on} from '@ngrx/store';
import {WorkspaceActions} from './workspace.actions';
import {initialState} from './workspace.state';

export const workspaceReducer = createReducer(
  initialState,
  on(WorkspaceActions.loadWorkspace, state => ({
    ...state,
    loading: {
      workspace: true,
      join: false,
      create: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
    },
  })),
  on(WorkspaceActions.loadWorkspaceSuccess, (state, {workspace}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.loadWorkspaceFailure, (state, {error}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    error: {
      create: null,
      workspace: error,
      join: null,
    },
  })),
  on(WorkspaceActions.createWorkspace, state => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: true,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
    },
  })),
  on(WorkspaceActions.createWorkspaceSuccess, (state, {workspace}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    activeWorkspace: workspace,
  })),
  on(WorkspaceActions.createWorkspaceFailure, (state, {error}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    error: {
      create: error,
      workspace: null,
      join: null,
    },
  })),
  on(WorkspaceActions.joinWorkspace, state => ({
    ...state,
    loading: {
      workspace: false,
      join: true,
      create: false,
    },
    error: {
      create: null,
      workspace: null,
      join: null,
    },
  })),
  on(WorkspaceActions.joinWorkspaceSuccess, (state, {workspace}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    activeWorkspace: workspace
  })),
  on(WorkspaceActions.joinWorkspaceFailure, (state, {error}) => ({
    ...state,
    loading: {
      workspace: false,
      join: false,
      create: false,
    },
    error: {
      create: null,
      workspace: null,
      join: error,
    },
  })),
);
