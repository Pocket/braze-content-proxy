export default {
  app: {
    environment: process.env.NODE_ENV || 'development',
    apolloClientName: 'BrazeContentProxy',
    version: `${process.env.GIT_SHA ?? 'local'}`,
    port: 4500,
  },
  aws: {
    region: process.env.REGION || 'us-east-1',
    apiKey: process.env.API_KEY || 'BrazeContentProxy/Dev/ApiKey',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
};
