import { createReducer, on } from '@ngrx/store';
import * as fromAppActions from '../actions/app.actions';

export const appFeatureKey = 'app';

export interface AppState {
  title: string;
  initialized: boolean;
}

export const initialState: AppState = {
  title: 'Application name',
  initialized: false,
};

export const appReducer = createReducer(
  initialState,
  on(fromAppActions.AppInitialized, (state) => ({
    ...state,
    initialized: true,
  })),
);
