import * as z from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  JWT_EXPIRES_IN: z.string(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(envParsed.error.format(), null, 4),
  );
  process.exit(1);
}

export const env = envParsed.data;
