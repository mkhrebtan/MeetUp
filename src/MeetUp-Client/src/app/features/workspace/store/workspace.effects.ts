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
          tap(({ workspace }) => {
            if (workspace) {
              localStorage.setItem('activeWorkspaceId', workspace.id);
            }
          }),
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
          map((workspace) => WorkspaceActions.joinWorkspaceSuccess({ workspace: workspace })),
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

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.updateSettings),
      switchMap(({ id, name, invitationPolicy, meetingsCreationPolicy }) =>
        this.workspaceService
          .updateSettings(id, name, invitationPolicy, meetingsCreationPolicy)
          .pipe(
            map(() => {
              this.logger.info('Workspace settings updated successfully');
              return WorkspaceActions.updateSettingsSuccess({
                name,
                invitationPolicy,
                meetingsCreationPolicy,
              });
            }),
            catchError((error) => {
              this.logger.error('Update settings error:', error);
              return of(
                WorkspaceActions.updateSettingsFailure({
                  error:
                    error.error.detail || 'Unable to update workspace settings. Please try again.',
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
        tap(({ workspace }) => {
          if (workspace?.id) {
            this.logger.info('Redirecting to workspace dashboard:', workspace.id);
            localStorage.setItem('activeWorkspaceId', workspace.id);
            this.router.navigate([`/workspace/${workspace.id}/dashboard`], { replaceUrl: true });
          } else {
            this.logger.warn('No workspace ID found, redirecting to workspace selection');
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

  leaveWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.leaveWorkspace),
      switchMap(({ id }) =>
        this.workspaceService.leaveWorkspace(id).pipe(
          map(() => {
            this.logger.info('Left workspace successfully');
            return WorkspaceActions.leaveWorkspaceSuccess({ id });
          }),
          catchError((error) => {
            this.logger.error('Leave workspace error:', error);
            return of(
              WorkspaceActions.leaveWorkspaceFailure({
                error: error.error.detail || 'Unable to leave workspace. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  deleteWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.deleteWorkspace),
      switchMap(({ id }) =>
        this.workspaceService.deleteWorkspace(id).pipe(
          map(() => {
            this.logger.info('Deleted workspace successfully');
            return WorkspaceActions.deleteWorkspaceSuccess({ id });
          }),
          catchError((error) => {
            this.logger.error('Delete workspace error:', error);
            return of(
              WorkspaceActions.deleteWorkspaceFailure({
                error: error.error.detail || 'Unable to delete workspace. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );

  redirectToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorkspaceActions.leaveWorkspaceSuccess, WorkspaceActions.deleteWorkspaceSuccess),
        tap(() => {
          this.logger.info('Redirecting to workspace selection');
          this.router.navigate(['/workspace'], { replaceUrl: true });
        }),
      ),
    { dispatch: false },
  );

  loadInvitations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.loadInvitations),
      switchMap(() =>
        this.workspaceService.getInvitations().pipe(
          map((invitations) => WorkspaceActions.loadInvitationsSuccess({ invitations })),
          catchError((error) => {
            this.logger.error('Load invitations error:', error);
            return of(
              WorkspaceActions.loadInvitationsFailure({
                error: error.error.detail || 'Unable to load invitations. Please try again.',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
