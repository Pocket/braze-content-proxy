export default {
  app: {
    environment: process.env.NODE_ENV || 'development',
    apolloClientName: 'BrazeContentProxy',
    version: `${process.env.GIT_SHA ?? 'local'}`,
    port: 4500,
  },
  aws: {
    region: process.env.REGION || 'us-east-1',
    brazeApiKey:
      process.env.BRAZE_API_KEY || 'BrazeContentProxy/Dev/BRAZE_API_KEY',
  },
  // Params we call Pocket Image Cache with to resize story thumbnails on the fly.
  images: {
    protocol: 'https',
    host: 'pocket-image-cache.com',
    width: 150,
    height: 150,
    filters: 'format(jpeg):quality(100):no_upscale():strip_exif()',
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
};
