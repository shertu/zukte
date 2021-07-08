const Sentry = require('@sentry/nextjs');

// const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: 'https://0cd989f4764147b08d7eb3c42be4766c@sentry.entail.app/6',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
