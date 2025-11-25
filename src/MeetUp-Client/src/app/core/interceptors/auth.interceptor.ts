import {
  HttpClient,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpParams,
  HttpRequest
} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../services/token.service';
import {environment} from "../../../enviroments/enviroment";
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {BehaviorSubject, throwError} from "rxjs";
import {LoggerService} from '../services/logger.service';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const tokenService = inject(TokenService);
  const http = inject(HttpClient);
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
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 0) && token) {
        return handle401Error(authReq, next, tokenService, logger, http);
      }
      return throwError(() => error);
    }),
  );
};

const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, tokenService: TokenService, logger: LoggerService, http: HttpClient) => {
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

    const url = `${environment.keycloak.authority}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

    const body = new HttpParams()
      .set('client_id', environment.keycloak.client)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return http.post<any>(url, body, {
      headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
    })
      .pipe(
        switchMap((tokenResponse) => {
          isRefreshing = false;
          tokenService.setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
          refreshTokenSubject.next(tokenResponse.refresh_token);
          logger.info('Token refreshed successfully');
          return next(addTokenHeader(req, tokenResponse.access_token));
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
