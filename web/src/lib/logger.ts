/**
 * Centralized logging utility
 * In production, this can be replaced with a proper logging service (e.g., Sentry, LogRocket)
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log('[LOG]', ...args);
    }
    // In production, send to logging service
  },
  
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
    // In production, send to error tracking service (e.g., Sentry)
  },
  
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
    // In production, send to logging service
  },
  
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },
  
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  },
};
