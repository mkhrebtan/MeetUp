import { User } from '../models/user.model';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: {
    login: string | null;
    register: string | null;
    init: string | null;
  };
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: {
    login: null,
    register: null,
    init: null,
  },
};
