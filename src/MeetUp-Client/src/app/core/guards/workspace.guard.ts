import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const WorkspaceGuard: CanActivateFn = () => {
  const activeWorkspaceId = localStorage.getItem('activeWorkspaceId');
  const router = inject(Router);
  if (!activeWorkspaceId) {
    router.parseUrl('/workspace');
    return false;
  }

  return true;
};
