import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../features/auth/store/auth.selectors';
import {map, take} from 'rxjs/operators';

export const WorkspaceGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthSelectors.selectUser).pipe(
    take(1),
    map(user => {
      if (user && user.workspaceId) {
        return true;
      }

      // If user is logged in but has no workspace, redirect to workspace setup
      if (user && !user.workspaceId) {
        return router.parseUrl('/workspace');
      }

      // This case should theoretically be handled by AuthGuard first,
      // but as a fallback, redirect to login.
      return router.parseUrl('/auth/login');
    })
  );
};
