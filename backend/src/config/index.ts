import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mlServiceType: process.env.ML_SERVICE_TYPE || 'stub', // stub or python
  sentryDsn: process.env.SENTRY_DSN || '',
};

export function initSentry() {
  if (config.sentryDsn) {
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.nodeEnv,
      tracesSampleRate: 1.0,
    });
    console.log('Sentry telemetry initialized.');
  } else {
    console.log('Sentry telemetry skipped (no DSN provided).');
  }
}

export function captureError(error: any) {
  if (config.sentryDsn) {
    Sentry.captureException(error);
  } else {
    console.error('[Error Captured]:', error);
  }
}
