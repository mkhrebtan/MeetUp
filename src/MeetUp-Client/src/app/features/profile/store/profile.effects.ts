import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProfileActions } from './profile.actions';
import { switchMap, map, catchError, of, tap } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { MessageService } from 'primeng/api';
import { AuthActions } from '../../auth/store/auth.actions';

@Injectable()
export class ProfileEffects {
  private actions$ = inject(Actions);
  private profileService = inject(ProfileService);
  private messageService = inject(MessageService);

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ user }) =>
        this.profileService.updateProfile(user).pipe(
          map((updatedUser) => ProfileActions.updateProfileSuccess({ user: updatedUser })),
          catchError((error) =>
            of(
              ProfileActions.updateProfileFailure({
                error: error.error?.detail || 'Failed to update profile',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfileSuccess),
      map(({ user }) => AuthActions.initSuccess({ user })),
    ),
  );

  showSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProfileActions.updateProfileSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  showErrorMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProfileActions.updateProfileFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );
}
