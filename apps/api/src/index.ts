import { Hono } from "hono";
import auth from "./auth";
import callback from "./routes/callback";
import connections from "./routes/connections";
import connectionsVerify from "./routes/connections-verify";
import credentials from "./routes/credentials";
import keys from "./routes/keys";
import posts from "./routes/posts";
import publish from "./routes/publish";
import upload from "./routes/upload";

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null };
}>()
  // Capture Cloudflare request properties once so downstream handlers can use them.
  .use("*", async (c, next) => {
    c.set("cf", c.req.raw.cf ?? null);
    await next();
  })
  .get("/", (c) => c.text("Sotsial API"))
  .route("/v1/auth", auth)
  .route("/v1/connections/verify", connectionsVerify)
  .route("/v1/connections", connections)
  .route("/v1/publish", publish)
  .route("/v1/posts", posts)
  .route("/v1/credentials", credentials)
  .route("/v1/keys", keys)
  .route("/v1/upload", upload)
  .route("/v1/callback", callback);

export type AppType = typeof app;
export default app;
