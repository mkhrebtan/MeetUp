import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../services/token.service';
import {environment} from "../../../enviroments/enviroment";
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {BehaviorSubject, throwError} from "rxjs";
import {KeycloakService} from '../../features/auth/services/keycloak.service';
import {LoggerService} from '../services/logger.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const tokenService = inject(TokenService);
  const logger = inject(LoggerService);
  const token = tokenService.getAccessToken();
  const isApiUrl = req.url.startsWith(environment.apiUrl);
  const isKeycloakUrl = req.url.startsWith(environment.keycloak.authority);
  const isLoginEndpoint = req.url.includes('/protocol/openid-connect/token');

  let authReq = req;
  if (token && (isApiUrl || isKeycloakUrl) && !isLoginEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && token) {
        return handle401Error(authReq, next, tokenService, logger);
      }
      return throwError(() => error);
    }),
  );
};

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, logger: LoggerService) => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      tokenService.clearTokens();
      logger.error('Token refresh failed: No refresh token available');
      return throwError(() => new Error('Authentication expired. Please log in again.'));
    }

    const keycloakService = inject(KeycloakService);

    return keycloakService.refreshToken(refreshToken)
      .pipe(
        switchMap((tokenResponse) => {
          isRefreshing = false;
          tokenService.setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
          refreshTokenSubject.next(tokenResponse.refreshToken);
          return next(addTokenHeader(req, tokenResponse.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          tokenService.clearTokens();
          logger.error('Token refresh failed:', err);
          return throwError(() => new Error('Authentication expired. Please log in again.'));
        }),
      );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => next(addTokenHeader(req, jwt))),
    );
  }
};

const addTokenHeader = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
