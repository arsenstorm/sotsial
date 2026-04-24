import type { BetterAuthOptions } from "better-auth";
import { admin } from "better-auth/plugins";
import { ac, roles } from "./permissions";
import type { AuthEnv } from "./types";

export const core = (env: AuthEnv) => {
  return {
    telemetry: { enabled: false },
    appName: "sotsial",
    baseURL: env.APP_BASE_URL,
    basePath: "/api/auth",
    secret: env.AUTH_SECRET,
    advanced: {
      cookiePrefix: "sotsial",
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        domain: env.ENVIRONMENT === "production" ? "sotsial.com" : undefined,
      },
      database: {
        generateId: "uuid",
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 24 * 60 * 60 * 28, // 28 days
    },
    trustedOrigins: [env.APP_BASE_URL],
    plugins: [
      admin({
        ac,
        roles,
        adminRoles: ["admin"],
        defaultRole: "user",
      }),
    ],
  } satisfies BetterAuthOptions;
};
