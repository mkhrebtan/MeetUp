import { createFeature, createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';

export interface SettingsState {
  loading: {
    update: boolean;
    leave: boolean;
    delete: boolean;
  };
  error: {
    update: string | null;
    leave: string | null;
    delete: string | null;
  };
}

export const initialState: SettingsState = {
  loading: {
    update: false,
    leave: false,
    delete: false,
  },
  error: {
    update: null,
    leave: null,
    delete: null,
  },
};

export const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(SettingsActions.updateSettings, (state) => ({
      ...state,
      loading: { ...state.loading, update: true },
    })),
    on(SettingsActions.updateSettingsSuccess, (state) => ({
      ...state,
      loading: { ...state.loading, update: false },
      error: { ...state.error, update: null },
    })),
    on(SettingsActions.updateSettingsFailure, (state, { error }) => ({
      ...state,
      loading: { ...state.loading, update: false },
      error: { ...state.error, update: error },
    })),
    on(SettingsActions.leaveWorkspace, (state) => ({
      ...state,
      loading: { ...state.loading, leave: true },
    })),
    on(SettingsActions.leaveWorkspaceSuccess, (state) => ({
      ...state,
      loading: { ...state.loading, leave: false },
      error: { ...state.error, leave: null },
    })),
    on(SettingsActions.leaveWorkspaceFailure, (state, { error }) => ({
      ...state,
      loading: { ...state.loading, leave: false },
      error: { ...state.error, leave: error },
    })),
    on(SettingsActions.deleteWorkspace, (state) => ({
      ...state,
      loading: { ...state.loading, delete: true },
    })),
    on(SettingsActions.deleteWorkspaceSuccess, (state) => ({
      ...state,
      loading: { ...state.loading, delete: false },
      error: { ...state.error, delete: null },
    })),
    on(SettingsActions.deleteWorkspaceFailure, (state, { error }) => ({
      ...state,
      loading: { ...state.loading, delete: false },
      error: { ...state.error, delete: error },
    })),
  ),
});
