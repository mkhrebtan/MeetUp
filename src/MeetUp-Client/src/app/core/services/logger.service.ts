import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(...args: unknown[]): void {
    if (isDevMode()) {
      console.log('[LOG]:', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (isDevMode()) {
      console.info('[INFO]:', ...args);
    }
  }

  warn(...args: unknown[]): void {
    console.warn('[WARN]:', ...args);
  }

  error(...args: unknown[]): void {
    console.error('[ERROR]:', ...args);
  }
}