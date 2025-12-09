import { createFeature, createReducer, on } from '@ngrx/store';
import { ProfileActions } from './profile.actions';

export interface ProfileState {
  loading: boolean;
  error: string | null;
}

export const initialState: ProfileState = {
  loading: false,
  error: null,
};

export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialState,
    on(ProfileActions.updateProfile, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ProfileActions.updateProfileSuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
    on(ProfileActions.updateProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
  ),
});
