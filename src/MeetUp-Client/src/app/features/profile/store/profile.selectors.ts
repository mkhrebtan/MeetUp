import { createSelector } from '@ngrx/store';
import { profileFeature, ProfileState } from './profile.reducer';

export const { selectProfileState } = profileFeature;

export const selectLoading = createSelector(
  selectProfileState,
  (state: ProfileState) => state.loading,
);

export const selectError = createSelector(selectProfileState, (state: ProfileState) => state.error);
