import { zValidator } from "@hono/zod-validator";
import { grants } from "@sotsial/db/schema";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthContext } from "../db";
import { db } from "../db";
import { authorise } from "../lib/auth";

const querySchema = z.object({
  id: z.string().min(1),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .get("/", zValidator("query", querySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const { id: grantId } = c.req.valid("query");

    const [row] = await db()
      .select({ status: grants.status })
      .from(grants)
      .where(
        and(eq(grants.id, grantId), eq(grants.organizationId, organizationId))
      )
      .limit(1);

    if (!row) {
      return c.json({ error: "Invalid grant ID" }, 404);
    }

    return c.json({ status: row.status });
  });

export default app;
