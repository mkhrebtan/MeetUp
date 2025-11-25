import { createFeature, createReducer, on } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';

export interface DashboardState {
  loading: boolean;
}

export const initialState: DashboardState = {
  loading: false,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(DashboardActions.init, (state) => ({ ...state, loading: true })),
  ),
});
