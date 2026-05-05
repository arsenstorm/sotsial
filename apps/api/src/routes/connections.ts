import { zValidator } from "@hono/zod-validator";
import { connections, grants } from "@sotsial/db/schema";
import { and, arrayOverlaps, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { encrypt, timestamp } from "sotsial/utils";
import { z } from "zod";
import type { AuthContext } from "../db";
import { db } from "../db";
import { env } from "../env";
import { getAccounts } from "../lib/accounts";
import { authorise } from "../lib/auth";
import { getCredentials } from "../lib/credentials";
import { getSotsial } from "../lib/sotsial";

const listQuerySchema = z.object({
  platform: z.string().optional(),
  query: z.string().optional(),
  tags: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

const createQuerySchema = z.object({
  platform: z.string().min(1),
  redirect: z.string().optional(),
  tags: z.string().optional(),
  credential: z.string().optional(),
});

const patchBodySchema = z.object({
  credentials: z.array(z.string()).optional(),
  targets: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

const deleteQuerySchema = z.object({
  id: z.string().min(1),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .get("/", zValidator("query", listQuerySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const {
      platform,
      query,
      tags: tagsRaw,
      page,
      limit,
    } = c.req.valid("query");
    const tags = tagsRaw ? (JSON.parse(tagsRaw) as string[]) : [];

    const where = [eq(connections.organizationId, organizationId)];

    if (platform) {
      where.push(eq(connections.platform, platform));
    }

    if (query) {
      where.push(
        or(
          ilike(sql`${connections.account}->>'name'`, `%${query}%`),
          ilike(sql`${connections.account}->>'username'`, `%${query}%`)
        ) as (typeof where)[number]
      );
    }

    if (tags.length > 0) {
      where.push(arrayOverlaps(connections.tags, tags));
    }

    const rows = await db()
      .select({
        id: connections.id,
        created_at: connections.createdAt,
        credential: connections.credential,
        platform: connections.platform,
        account_id: connections.accountId,
        expiry: connections.expiry,
        tags: connections.tags,
        account: connections.account,
      })
      .from(connections)
      .where(and(...where))
      .limit(limit)
      .offset((page - 1) * limit);

    return c.json({ data: rows });
  })
  .post("/", zValidator("query", createQuerySchema), async (c) => {
    const { organizationId, type } = c.get("auth") as AuthContext;
    const {
      platform,
      redirect = "",
      tags: tagsParam = "",
      credential: credentialParam,
    } = c.req.valid("query");

    let credential: {
      client_id: string;
      client_secret: string;
    } | null = null;

    if (credentialParam) {
      const rows = await getCredentials(credentialParam, organizationId);
      const first = rows.at(0);
      if (first) {
        credential = {
          client_id: first.clientId,
          client_secret: first.clientSecret,
        };
      }
    }

    if (!credential && type === "api") {
      return c.json(
        {
          error:
            "You cannot use the API to generate a grant URL for Sotsial's providers.",
          hint: "See the docs for more information: https://sotsial.com/docs/credentials#sotsial-providers",
        },
        400
      );
    }

    const sotsial = getSotsial({ platforms: [{ platform, credential }] });

    const provider = sotsial.providers.find((p: string) => p === platform);

    if (!provider) {
      return c.json({ error: "Provider not found" }, 404);
    }

    // biome-ignore lint/suspicious/noExplicitAny: dynamic provider key
    const { data, error } = await (sotsial as any)[provider].grant();

    if (error || !data) {
      return c.json(
        { error: error?.message ?? "Failed to get redirect URL" },
        500
      );
    }

    const tags = tagsParam ? tagsParam.split(",") : [];

    const encryptedCsrf = await encrypt(data.csrf_token, {
      secret: env.ENCRYPTION_KEY,
    });

    if (!encryptedCsrf) {
      return c.json({ error: "Failed to encode CSRF token" }, 500);
    }

    const [inserted] = await db()
      .insert(grants)
      .values({
        expiry: new Date(timestamp(60 * 60)),
        platform,
        csrfToken: encryptedCsrf,
        organizationId,
        tags,
        credential: credentialParam ?? null,
      })
      .returning({ id: grants.id });

    setCookie(c, "sotsial", `${inserted.id}|${data.csrf_token}|${redirect}`, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 60 * 60,
    });

    return c.json({
      url: data.url,
      token: `${inserted.id}|${data.csrf_token}`,
    });
  })
  .patch("/", zValidator("json", patchBodySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const {
      credentials: credentialIds = [],
      targets = [],
      tags = [],
    } = c.req.valid("json");

    const { data: accounts, error } = await getAccounts({
      targets,
      credentialIds,
      organizationId,
    });

    if (error) {
      return c.json({ error: "Failed to get accounts" }, 400);
    }

    if (accounts.length === 0) {
      return c.json({ status: "success", updated: 0 });
    }

    const updated = await db()
      .update(connections)
      .set({ tags })
      .where(
        and(
          eq(connections.organizationId, organizationId),
          inArray(
            connections.id,
            accounts.map((a) => a.id)
          )
        )
      )
      .returning({ id: connections.id });

    return c.json({ status: "success", updated: updated.length });
  })
  .delete("/", zValidator("query", deleteQuerySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { id } = c.req.valid("query");

    await db()
      .delete(connections)
      .where(
        and(
          eq(connections.id, id),
          eq(connections.organizationId, organizationId)
        )
      );

    return c.json({ data: { message: "Deleted connection" } });
  });

export default app;
