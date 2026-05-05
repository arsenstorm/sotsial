import { type Database, getHyperdriveDatabase } from "@sotsial/db/client";
import type { Context } from "hono";
import { env } from "./env";

export const db = (): Database => getHyperdriveDatabase(env.DATABASE);

export type AppContext = Context<{
  Bindings: CloudflareBindings;
  Variables: {
    cf?: CfProperties<unknown> | null;
    auth?: AuthContext;
  };
}>;

export interface AuthContext {
  organizationId: string;
  type: "api" | "session";
  userId: string | null;
}
