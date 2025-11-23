import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          this.logger.error('HTTP Error:', error);

          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else if (error.status === 500) {
            this.logger.error('Server error. Please try again later.');
          } else {
            this.logger.error(error.error?.message || 'An error occurred');
          }
        }

        return throwError(() => error);
      })
    );
  }
}