import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { KeycloakService } from './keycloak.service';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../models/user.model';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { TokenService } from '../../../core/services/token.service';
import { LoggerService } from '../../../core/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);
  private readonly apiService = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly logger = inject(LoggerService);

  login(credentials: LoginRequest) {
    return this.keycloakService.login(credentials.email, credentials.password).pipe(
      tap((response) => this.tokenService.setTokens(response.access_token, response.refresh_token)),
      switchMap(() => this.fetchUser()),
      catchError((error) => {
        this.logger.error('Login error:', error);
        return throwError(
          () => new Error('Unable to login. Please check your credentials and try again.'),
        );
      }),
    );
  }

  register(userData: RegisterRequest) {
    return this.apiService.post('auth/register', userData).pipe(
      catchError((error) => {
        this.logger.error('Registration error:', error);
        return throwError(
          () => new Error('Unable to complete registration. Please try again later.'),
        );
      }),
    );
  }

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.tokenService.clearTokens();
      return;
    }

    this.keycloakService
      .logout(refreshToken)
      .pipe(
        catchError((error) => {
          this.logger.error('Logout error:', error);
          return of(null);
        }),
      )
      .subscribe(() => {
        this.tokenService.clearTokens();
      });
  }

  fetchUser(): Observable<User> {
    return this.apiService.get<User>('auth/me').pipe(
      catchError((error) => {
        this.logger.error('Fetch user error:', error);
        return throwError(() => new Error('Unable to fetch user information. Please try again.'));
      }),
    );
  }
}
