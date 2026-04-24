import { env as cloudflareEnv } from "cloudflare:workers";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const platformCredentials = {
  THREADS_CLIENT_ID: z.string().optional(),
  THREADS_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
  TIKTOK_CLIENT_ID: z.string().optional(),
  TIKTOK_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
};

export const env = createEnv({
  server: {
    // Config
    APP_BASE_URL: z.string().url(),
    INTERNAL_PROXY_SECRET: z.string().min(1),
    ENVIRONMENT: z.enum(["production", "development"]).default("development"),

    // Auth
    AUTH_SECRET: z.string().min(1),

    // Database
    DATABASE: z.custom<Hyperdrive>(),

    // Encryption (OAuth tokens, CSRF tokens, client secrets at rest)
    ENCRYPTION_KEY: z.string().min(1),

    // Optional CDN base URL for media transforms
    CDN_BASE_URL: z.string().url().optional(),

    // Platform credentials (Sotsial-provided fallbacks)
    ...platformCredentials,
  },

  runtimeEnv: {
    ...process.env,
    ...(cloudflareEnv as unknown as Record<string, string>),
  },

  emptyStringAsUndefined: true,
});
