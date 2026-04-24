import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthContext } from "../db";
import { authorise, getAuth, sessionOnly } from "../lib/auth";

const createBodySchema = z.object({
  name: z.string().optional(),
});

const deleteQuerySchema = z.object({
  id: z.string().min(1),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise(), sessionOnly())
  .get("/", async (c) => {
    const auth = getAuth(c.get("cf"));
    const keys = await auth.api.listApiKeys({ headers: c.req.raw.headers });
    return c.json(keys);
  })
  .post("/", zValidator("json", createBodySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const auth = getAuth(c.get("cf"));
    const { name } = c.req.valid("json");

    const key = await auth.api.createApiKey({
      body: {
        configId: "organization",
        organizationId,
        name,
      },
      headers: c.req.raw.headers,
    });

    return c.json(key);
  })
  .delete("/", zValidator("query", deleteQuerySchema), async (c) => {
    const auth = getAuth(c.get("cf"));
    const { id } = c.req.valid("query");

    const result = await auth.api.deleteApiKey({
      body: { configId: "organization", keyId: id },
      headers: c.req.raw.headers,
    });

    if (!result.success) {
      return c.json({ error: "Failed to delete key" }, 400);
    }

    return c.json({ data: { message: "Key deleted" } });
  });

export default app;
