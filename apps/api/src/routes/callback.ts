import { connections, grants } from "@sotsial/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { deleteCookie, getCookie } from "hono/cookie";
import { decrypt, encrypt } from "sotsial/utils";
import { db } from "../db";
import { env } from "../env";
import { getCredentials } from "../lib/credentials";
import { getSotsial } from "../lib/sotsial";

const SUCCESS_HTML = `<!DOCTYPE html>
<html>
  <head>
    <title>Authentication Successful</title>
    <script>
      window.onload = function() {
        window.close();
        if (!window.closed) {
          document.body.innerHTML = '<p>Authentication successful! You can close this window now.</p>';
        }
      }
    </script>
  </head>
  <body>
    <p>Authentication successful! Closing window...</p>
  </body>
</html>`;

const sqlExcluded = (column: string) => sql.raw(`excluded."${column}"`);

interface GrantRow {
  credential: string | null;
  csrfToken: string;
  expiry: Date | null;
  id: string;
  organizationId: string;
  tags: string[];
}

const loadGrant = (grantId: string, platform: string) =>
  db()
    .select({
      id: grants.id,
      csrfToken: grants.csrfToken,
      tags: grants.tags,
      organizationId: grants.organizationId,
      credential: grants.credential,
      expiry: grants.expiry,
    })
    .from(grants)
    .where(and(eq(grants.id, grantId), eq(grants.platform, platform)))
    .limit(1);

const resolveCredential = async (grant: GrantRow) => {
  if (!grant.credential) {
    return null;
  }
  const rows = await getCredentials(grant.credential, grant.organizationId);
  const first = rows.at(0);
  return first
    ? { client_id: first.clientId, client_secret: first.clientSecret }
    : null;
};

const persistConnections = async (
  grant: GrantRow,
  platform: string,
  // biome-ignore lint/suspicious/noExplicitAny: provider-specific exchange data
  data: any
): Promise<boolean> => {
  const rows = Array.isArray(data) ? data : [data];

  const values = await Promise.all(
    // biome-ignore lint/suspicious/noExplicitAny: provider-specific exchange row
    rows.map(async (d: any) => ({
      platform,
      credential: grant.credential,
      organizationId: grant.organizationId,
      accountId: d.account_id,
      accessToken: await encrypt(d.access_token, {
        secret: env.ENCRYPTION_KEY,
      }),
      refreshToken: await encrypt(d.refresh_token, {
        secret: env.ENCRYPTION_KEY,
      }),
      tags: grant.tags,
      expiry: d.expiry ? new Date(d.expiry) : null,
      account: {
        avatar: d.details?.avatar_url ?? null,
        username: d.details?.username ?? null,
        name: d.details?.name ?? null,
      },
    }))
  );

  try {
    await db()
      .insert(connections)
      .values(values)
      .onConflictDoUpdate({
        target: [
          connections.organizationId,
          connections.platform,
          connections.accountId,
          connections.credential,
        ],
        set: {
          accessToken: sqlExcluded("access_token"),
          refreshToken: sqlExcluded("refresh_token"),
          tags: sqlExcluded("tags"),
          expiry: sqlExcluded("expiry"),
          account: sqlExcluded("account"),
        },
      });
    return true;
  } catch {
    return false;
  }
};

type CallbackContext = Context<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null };
}>;

const finishResponse = (c: CallbackContext, redirect: string) => {
  deleteCookie(c, "sotsial", { path: "/" });

  if (!redirect || redirect === "close") {
    return c.html(SUCCESS_HTML);
  }

  return c.redirect(new URL(redirect, c.req.url).toString());
};

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null };
}>().get("/:platform", async (c) => {
  const platform = c.req.param("platform");
  const url = new URL(c.req.url);
  const code = url.searchParams.get("code") ?? undefined;

  if (!code) {
    return c.json({ error: "Missing code" }, 400);
  }

  const token = getCookie(c, "sotsial") ?? "";
  const [grantId, csrfToken = "", redirect = ""] = token.split("|");

  if (!grantId) {
    return c.json({ error: "Forbidden - Invalid Session" }, 403);
  }

  const [grant] = await loadGrant(grantId, platform);

  if (!grant) {
    return c.json({ error: "Forbidden - Invalid Session" }, 403);
  }

  if (grant.expiry && grant.expiry < new Date()) {
    return c.json({ error: "Forbidden - Grant expired" }, 403);
  }

  const decryptedCsrf = await decrypt(grant.csrfToken, {
    secret: env.ENCRYPTION_KEY,
  });

  if (decryptedCsrf !== csrfToken) {
    return c.json({ error: "Invalid CSRF token" }, 403);
  }

  const credential = await resolveCredential(grant);

  const sotsial = getSotsial({ platforms: [{ platform, credential }] });
  const provider = sotsial.providers.find((p: string) => p === platform);

  if (!provider) {
    return c.json({ error: "Provider not found" }, 404);
  }

  const { data, error } = await sotsial.exchange(provider, {
    code,
    csrf_token: csrfToken,
  });

  let success = !(error || !data);

  if (success && data) {
    success = await persistConnections(grant, platform, data);
  }

  await db()
    .update(grants)
    .set({ status: success ? "success" : "failed" })
    .where(eq(grants.id, grantId));

  return finishResponse(c, redirect);
});

export default app;
