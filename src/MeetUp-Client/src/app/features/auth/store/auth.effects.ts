import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.init),
      switchMap(() =>
        this.authService.fetchUser().pipe(
          map((user) => AuthActions.initSuccess({ user })),
          catchError((error) => of(AuthActions.initFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError((error) => of(AuthActions.registerFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => this.authService.logout()),
      map(() => AuthActions.logoutSuccess()),
      catchError((error) => of(AuthActions.logoutFailure({ error: error.message }))),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['workspace/dashboard'])),
      ),
    { dispatch: false },
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/auth/login'])),
      ),
    { dispatch: false },
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/auth/login'])),
      ),
    { dispatch: false },
  );
}
