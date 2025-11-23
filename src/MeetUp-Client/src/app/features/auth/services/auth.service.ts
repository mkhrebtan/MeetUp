import {computed, inject, Injectable, signal} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {KeycloakService} from './keycloak.service';
import {ApiService} from '../../../core/services/api.service';
import {User} from '../models/user.model';
import {KeycloakLoginResponse} from '../models/keycloak-login-response.model';
import {LoginRequest} from '../models/login-request.model';
import {RegisterRequest} from '../models/register-request.model';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly apiService = inject(ApiService);

  private readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly user = computed(() => this.currentUser());

  constructor() {
    this.checkAuth().subscribe();
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.keycloakService.login(credentials.email, credentials.password).pipe(
      tap(response => this.setTokens(response)),
      switchMap(() => this.fetchAndSetUser()),
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.apiService.post('/auth/register', userData);
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuthData();
      return;
    }

    this.keycloakService.logout(refreshToken).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.clearAuthData();
    });
  }

  refreshToken(): Observable<KeycloakLoginResponse | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }

    return this.keycloakService.refreshToken(refreshToken).pipe(
      tap(response => this.setTokens(response)),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  checkAuth(): Observable<User | null> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return of(null);
    }

    return this.fetchAndSetUser().pipe(
      catchError(() => {
        return this.refreshToken().pipe(
          switchMap(response => {
            if (response) {
              return this.fetchAndSetUser();
            }
            this.clearAuthData();
            return of(null);
          }),
          catchError(() => {
            this.clearAuthData();
            return of(null);
          })
        );
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private fetchAndSetUser(): Observable<User> {
    return this.apiService.get<User>('/auth/me').pipe(
      tap(user => this.currentUser.set(user)),
    );
  }

  private setTokens(response: KeycloakLoginResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private clearAuthData(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.currentUser.set(null);
  }
}
