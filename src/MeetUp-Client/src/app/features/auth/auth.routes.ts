import {AuthComponent} from './auth.component';
import {AUTH_PROVIDERS} from './auth.config';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {Routes} from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    providers: [...AUTH_PROVIDERS],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  }
];
