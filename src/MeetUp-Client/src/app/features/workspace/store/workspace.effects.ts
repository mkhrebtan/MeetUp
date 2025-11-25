import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WorkspaceService } from '../services/workspace.service';
import { WorkspaceActions } from './workspace.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoggerService } from '../../../core/services/logger.service';
import { Router } from '@angular/router';

@Injectable()
export class WorkspaceEffects {
  private actions$ = inject(Actions);
  private workspaceService = inject(WorkspaceService);
  private logger = inject(LoggerService);
  private router = inject(Router);

  loadWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.loadWorkspace),
      switchMap(({ id }) =>
        this.workspaceService.loadWorkspace(id).pipe(
          map((workspace) => WorkspaceActions.loadWorkspaceSuccess({ workspace })),
          catchError((error) => {
            this.logger.error('Load workspace error:', error);
            return of(
              WorkspaceActions.loadWorkspaceFailure({
                error: error.error.detail || 'Unable to load workspace. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  createWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.createWorkspace),
      switchMap(({ name }) =>
        this.workspaceService.createWorkspace(name).pipe(
          map((workspace) => WorkspaceActions.createWorkspaceSuccess({ workspace })),
          catchError((error) => {
            this.logger.error('Create workspace error:', error);
            return of(
              WorkspaceActions.createWorkspaceFailure({
                error: error.error.detail || 'Unable to create workspace. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  joinWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.joinWorkspace),
      switchMap(({ inviteCode }) =>
        this.workspaceService.joinWorkspace(inviteCode).pipe(
          map((workspace) => WorkspaceActions.joinWorkspaceSuccess({ workspace })),
          catchError((error) => {
            this.logger.error('Join workspace error:', error);
            return of(
              WorkspaceActions.joinWorkspaceFailure({
                error:
                  error.error.detail ||
                  'Unable to join workspace. Please check the invite code and try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  redirectToWorkspace$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WorkspaceActions.createWorkspaceSuccess,
          WorkspaceActions.joinWorkspaceSuccess,
          WorkspaceActions.loadWorkspaceSuccess,
        ),
        tap((action) => {
          const workspaceId = action?.workspace?.id;
          if (workspaceId) {
            this.router.navigate([`/workspace/${workspaceId}/dashboard`], { replaceUrl: true });
          } else {
            this.router.navigate(['/workspace'], { replaceUrl: true });
          }
        }),
      ),
    { dispatch: false },
  );

  redirectOnFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorkspaceActions.loadWorkspaceFailure),
        tap(() => this.router.navigate(['/workspace'])),
      ),
    { dispatch: false },
  );
}
