import { initAuth } from "@sotsial/auth/server";
import type { DatabaseBindings } from "@sotsial/db";
import { Hono } from "hono";
import { env } from "./env";

const auth = new Hono<{
  Bindings: CloudflareBindings & DatabaseBindings;
  Variables: { cf: CfProperties<unknown> | null };
}>();

auth.on(["POST", "GET"], "/*", (c) => {
  const cf = c.get("cf");
  return initAuth(env, cf ?? undefined).handler(c.req.raw);
});

export default auth;
