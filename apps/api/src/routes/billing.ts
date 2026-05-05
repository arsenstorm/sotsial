import { apikey, connections, posts } from "@sotsial/db/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { Hono } from "hono";
import type { AuthContext } from "../db";
import { db } from "../db";
import { authorise } from "../lib/auth";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .get("/usage", async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [postsRow, connectionsRow, keysRow] = await Promise.all([
      db()
        .select({ count: count() })
        .from(posts)
        .where(
          and(
            eq(posts.organizationId, organizationId),
            gte(posts.createdAt, startOfMonth)
          )
        ),
      db()
        .select({ count: count() })
        .from(connections)
        .where(eq(connections.organizationId, organizationId)),
      db()
        .select({ count: count() })
        .from(apikey)
        .where(eq(apikey.referenceId, organizationId)),
    ]);

    return c.json({
      posts_this_cycle: Number(postsRow[0]?.count ?? 0),
      connected_accounts: Number(connectionsRow[0]?.count ?? 0),
      api_keys: Number(keysRow[0]?.count ?? 0),
    });
  });

export default app;
