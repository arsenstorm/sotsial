import { getHyperdriveDatabase } from "@sotsial/db/client";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { core } from "./config";
import type { AuthEnv } from "./types";

export const initAuth = (env: AuthEnv) => {
  const hyperdrive = getHyperdriveDatabase(env.DATABASE);

  return betterAuth({
    ...core(env),
    database: drizzleAdapter(hyperdrive, {
      provider: "pg",
      usePlural: false,
      debugLogs: false,
    }),
  });
};

export type Auth = ReturnType<typeof initAuth>;
