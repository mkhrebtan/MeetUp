import { createSelector } from '@ngrx/store';
import { settingsFeature, SettingsState } from './settings.reducer';

export const { selectSettingsState } = settingsFeature;

export const selectUpdateError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error.update,
);

export const selectLeaveError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error.leave,
);

export const selectDeleteError = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.error.delete,
);

export const selectLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading,
);

export const selectUpdateLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading.update,
);

export const selectLeaveLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading.leave,
);

export const selectDeleteLoading = createSelector(
  selectSettingsState,
  (state: SettingsState) => state.loading.delete,
);
