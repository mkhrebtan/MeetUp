import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { User } from '../models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Init: emptyProps(),
    'Init Success': props<{ user: User }>(),
    'Init Failure': props<{ error: string }>(),

    Login: props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    Register: props<{ userData: RegisterRequest }>(),
    'Register Success': emptyProps(),
    'Register Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: string }>(),
  },
});
