import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import { AuthActions } from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.initSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.initFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: {
      login: error,
      register: null,
    },
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: {
      login: error,
      register: null,
    },
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: {
      login: null,
      register: error,
    },
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: {
      login: null,
      register: null,
    },
  })),
  on(AuthActions.logoutFailure, (state) => ({
    ...state,
    loading: false,
    error: {
      login: null,
      register: null,
    },
  })),
);
