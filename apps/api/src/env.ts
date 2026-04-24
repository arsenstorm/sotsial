import { env as cloudflareEnv } from "cloudflare:workers";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

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
  },

  runtimeEnv: {
    ...process.env,
    ...(cloudflareEnv as unknown as Record<string, string>),
  },

  emptyStringAsUndefined: true,
});
