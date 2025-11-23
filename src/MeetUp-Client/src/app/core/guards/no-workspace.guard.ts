import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AuthSelectors} from '../../features/auth/store/auth.selectors';
import {map, take} from 'rxjs/operators';

export const NoWorkspaceGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthSelectors.selectUser).pipe(
    take(1),
    map(user => {
      // If user has a workspace, they should not see the setup page.
      // Redirect them to the dashboard.
      if (user && user.workspaceId) {
        return router.parseUrl('/dashboard');
      }

      // If user is logged in and has no workspace, allow access.
      return true;
    })
  );
};
