import { env as cloudflareEnv } from "cloudflare:workers";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_BASE_URL: z.string().url(),
    INTERNAL_PROXY_SECRET: z.string().min(1),
    API: z.custom<Fetcher>(),
  },

  runtimeEnv: {
    ...import.meta.env,
    ...(cloudflareEnv as unknown as Record<string, string>),
  },

  emptyStringAsUndefined: true,
});
