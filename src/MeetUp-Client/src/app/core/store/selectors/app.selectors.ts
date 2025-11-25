import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as AppReducer from '../reducers/app.reducer';

export const selectAppState = createFeatureSelector<AppReducer.AppState>(AppReducer.appFeatureKey);

export const selectTitle = createSelector(selectAppState, (state) => state.title);
export const selectInitialized = createSelector(selectAppState, (state) => state.initialized);
