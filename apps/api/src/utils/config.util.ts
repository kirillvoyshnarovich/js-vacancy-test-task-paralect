import { ZodSchema } from 'zod';

const validateConfig = <T>(schema: ZodSchema): T => {
  const parsed = schema.safeParse(process.env);
  console.log('process.env', process.env.APP_ENV);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export default {
  validateConfig,
};
