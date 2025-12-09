import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakLoginResponse } from '../models/keycloak-login-response.model';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private readonly baseUrl = environment.keycloak.authority;
  private readonly realm = environment.keycloak.realm;
  private readonly clientId = environment.keycloak.client;

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  http = inject(HttpClient);

  private get realmUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}`;
  }

  login(username: string, password: string): Observable<KeycloakLoginResponse> {
    const url = '/protocol/openid-connect/token';

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password)
      .set('scope', 'openid profile email');

    return this.post<KeycloakLoginResponse>(url, body.toString(), {
      headers: this.defaultHeaders,
    });
  }

  refreshToken(refreshToken: string) {
    const url = '/protocol/openid-connect/token';

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refreshToken);

    return this.post(url, body.toString(), {
      headers: this.defaultHeaders,
    });
  }

  logout(refreshToken: string) {
    const url = '/protocol/openid-connect/logout';

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('refresh_token', refreshToken);

    return this.post(url, body.toString(), {
      headers: this.defaultHeaders,
    });
  }

  private get<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.get<T>(`${this.realmUrl}${endpoint}`, options);
  }

  private post<T>(endpoint: string, body: string, options?: object): Observable<T> {
    return this.http.post<T>(`${this.realmUrl}${endpoint}`, body, options);
  }
}
