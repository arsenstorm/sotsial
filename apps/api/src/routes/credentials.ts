import { zValidator } from "@hono/zod-validator";
import { credentials } from "@sotsial/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { encrypt } from "sotsial/utils";
import { z } from "zod";
import type { AuthContext } from "../db";
import { db } from "../db";
import { env } from "../env";
import { authorise, sessionOnly } from "../lib/auth";

const SUPPORTED_PLATFORMS = [
  "facebook",
  "google",
  "instagram",
  "linkedin",
  "threads",
  "tiktok",
  "twitter",
  "youtube",
] as const;

const createBodySchema = z.object({
  platform: z.enum(SUPPORTED_PLATFORMS),
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
});

const listQuerySchema = z.object({
  platform: z.string().optional(),
});

const deleteQuerySchema = z.object({
  id: z.string().min(1),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise(), sessionOnly())
  .get("/", zValidator("query", listQuerySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { platform } = c.req.valid("query");

    const where = [eq(credentials.organizationId, organizationId)];
    if (platform) {
      where.push(eq(credentials.platform, platform));
    }

    const rows = await db()
      .select({
        id: credentials.id,
        platform: credentials.platform,
        clientId: credentials.clientId,
        createdAt: credentials.createdAt,
      })
      .from(credentials)
      .where(and(...where))
      .orderBy(desc(credentials.createdAt));

    return c.json({ data: rows });
  })
  .post("/", zValidator("json", createBodySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { platform, clientId, clientSecret } = c.req.valid("json");

    const encryptedSecret = await encrypt(clientSecret, {
      secret: env.ENCRYPTION_KEY,
    });

    if (!encryptedSecret) {
      return c.json({ error: "Failed to encrypt client secret" }, 500);
    }

    const [row] = await db()
      .insert(credentials)
      .values({
        organizationId,
        platform,
        clientId,
        clientSecret: encryptedSecret,
      })
      .returning({
        id: credentials.id,
        platform: credentials.platform,
        clientId: credentials.clientId,
        createdAt: credentials.createdAt,
      });

    return c.json({ data: row }, 201);
  })
  .delete("/", zValidator("query", deleteQuerySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { id } = c.req.valid("query");

    const deleted = await db()
      .delete(credentials)
      .where(
        and(
          eq(credentials.id, id),
          eq(credentials.organizationId, organizationId)
        )
      )
      .returning({ id: credentials.id });

    if (deleted.length === 0) {
      return c.json({ error: "Credential not found" }, 404);
    }

    return c.json({ data: { message: "Credential deleted" } });
  });

export default app;
