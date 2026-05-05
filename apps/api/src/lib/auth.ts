import { initAuth } from "@sotsial/auth/server";
import type { MiddlewareHandler } from "hono";
import type { AuthContext } from "../db";
import { env } from "../env";

const BEARER_PREFIX = /^Bearer\s+/i;

export const getAuth = (cf?: CfProperties<unknown> | null) =>
  initAuth(env, cf ?? undefined);

/**
 * authorise resolves either an API-key or session credential into an
 * organization-scoped context. API keys are org-owned (referenceId = org id);
 * sessions carry activeOrganizationId set on session create.
 */
export const authorise =
  (): MiddlewareHandler<{
    Bindings: CloudflareBindings;
    Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
  }> =>
  async (c, next) => {
    const auth = getAuth(c.get("cf"));
    const apiKey =
      c.req.header("x-api-key") ??
      c.req.header("authorization")?.replace(BEARER_PREFIX, "");

    if (apiKey) {
      const result = await auth.api.verifyApiKey({
        body: { key: apiKey, configId: "organization" },
      });

      if (!(result.valid && result.key?.referenceId)) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      c.set("auth", {
        type: "api",
        organizationId: result.key.referenceId,
        userId: null,
      });

      await next();
      return;
    }

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const organizationId = session?.session?.activeOrganizationId;

    if (!(session?.user?.id && organizationId)) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("auth", {
      type: "session",
      organizationId,
      userId: session.user.id,
    });

    await next();
  };

export const sessionOnly =
  (): MiddlewareHandler<{
    Bindings: CloudflareBindings;
    Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
  }> =>
  async (c, next) => {
    const ctx = c.get("auth");

    if (ctx?.type !== "session") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
  };
