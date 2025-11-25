import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const AuthSelectors = {
  selectUser: createSelector(selectAuthState, (state) => state.user),
  selectIsAuthenticated: createSelector(selectAuthState, (state) => state.isAuthenticated),
  selectLoading: createSelector(selectAuthState, (state) => state.loading),
  selectLoginError: createSelector(selectAuthState, (state) => state.error.login),
  selectRegisterError: createSelector(selectAuthState, (state) => state.error.register),
};
