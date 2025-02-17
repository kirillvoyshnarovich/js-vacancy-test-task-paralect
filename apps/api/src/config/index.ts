import { z } from 'zod';

import { configUtil } from 'utils';

/**
 * Specify your environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const schema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  IS_DEV: z.preprocess(() => process.env.APP_ENV === 'development', z.boolean()),
  PORT: z.coerce.number().optional().default(3001),
  MONGO_URI: z.string(),
  MONGO_DB_NAME: z.string(),
  REDIS_URI: z.string(),
  API_URL: z.string(),
  WEB_URL: z.string(),
  SENDGRID_API_KEY: z.string().optional(),
  ADMIN_KEY: z.string().optional(),
  MIXPANEL_API_KEY: z.string().optional(),
  CLOUD_STORAGE_ENDPOINT: z.string().optional(),
  CLOUD_STORAGE_BUCKET: z.string().optional(),
  CLOUD_STORAGE_ACCESS_KEY_ID: z.string().optional(),
  CLOUD_STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // FIREBASE
  FIREBASE_API_KEY: z.string().optional(),
  FIREBASE_AUTH_DOMAIN: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  FIREBASE_APP_ID: z.string().optional(),
  // STRIPE
  STRIPE_PUBLISH_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_ENDPOINT_KEY: z.string().optional(),
});

type Config = z.infer<typeof schema>;

const config = configUtil.validateConfig<Config>(schema);

export default config;
