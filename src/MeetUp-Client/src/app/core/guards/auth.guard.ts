import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../features/auth/store/auth.selectors';

export const AuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.select(AuthSelectors.selectIsAuthenticated)) {
    return true;
  } else {
    return router.parseUrl('/auth/login');
  }
};
