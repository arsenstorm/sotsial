import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {},

  shared: {
    PUBLIC_APP_BASE_URL: z.string().url(),
  },

  clientPrefix: "PUBLIC_",

  runtimeEnv: {
    ...import.meta.env,
    PUBLIC_APP_BASE_URL: import.meta.env.APP_BASE_URL,
  },

  emptyStringAsUndefined: true,
});
