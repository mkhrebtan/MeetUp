import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SettingsActions } from './settings.actions';
import { switchMap, map, catchError, of, tap } from 'rxjs';
import { SettingsService } from '../services/settings.service';
import { MessageService } from 'primeng/api';
import { WorkspaceActions } from '../../workspace/store/workspace.actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private settingsService = inject(SettingsService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private store = inject(Store);

  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateSettings),
      map(({ settings }) =>
        WorkspaceActions.updateSettings({
          id: settings.workspaceId,
          name: settings.name,
          invitationPolicy: settings.invitationPolicy,
          meetingsCreationPolicy: settings.meetingsCreationPolicy,
        }),
      ),
    ),
  );

  updateSettingsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WorkspaceActions.updateSettingsSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Settings updated successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  leaveWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.leaveWorkspace),
      switchMap(({ id }) =>
        this.settingsService.leaveWorkspace(id).pipe(
          map(() => SettingsActions.leaveWorkspaceSuccess()),
          catchError((error) =>
            of(
              SettingsActions.leaveWorkspaceFailure({
                error: error.error?.detail || 'Failed to leave workspace',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.deleteWorkspace),
      switchMap(({ id }) =>
        this.settingsService.deleteWorkspace(id).pipe(
          map(() => SettingsActions.deleteWorkspaceSuccess()),
          catchError((error) =>
            of(
              SettingsActions.deleteWorkspaceFailure({
                error: error.error?.detail || 'Failed to delete workspace',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  redirectFromShell$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SettingsActions.leaveWorkspaceSuccess, SettingsActions.deleteWorkspaceSuccess),
        tap(() => this.router.navigate(['/workspace'])),
      ),
    { dispatch: false },
  );
}
