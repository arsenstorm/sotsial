import { zValidator } from "@hono/zod-validator";
import { posts } from "@sotsial/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthContext } from "../db";
import { db } from "../db";
import { authorise } from "../lib/auth";

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .get("/", zValidator("query", listQuerySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { page, limit } = c.req.valid("query");

    const rows = await db()
      .select({
        id: posts.id,
        createdAt: posts.createdAt,
        text: posts.text,
        media: posts.media,
        targets: posts.targets,
        platformSettings: posts.platformSettings,
        results: posts.results,
      })
      .from(posts)
      .where(eq(posts.organizationId, organizationId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return c.json({ data: rows });
  })
  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { id } = c.req.valid("param");

    const [row] = await db()
      .select({
        id: posts.id,
        createdAt: posts.createdAt,
        text: posts.text,
        media: posts.media,
        targets: posts.targets,
        platformSettings: posts.platformSettings,
        results: posts.results,
      })
      .from(posts)
      .where(and(eq(posts.id, id), eq(posts.organizationId, organizationId)))
      .limit(1);

    if (!row) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json({ data: row });
  });

export default app;
