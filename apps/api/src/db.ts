import { type Database, getHyperdriveDatabase } from "@sotsial/db/client";
import type { Context } from "hono";
import { env } from "./env";

let instance: Database | null = null;

export const db = (): Database => {
  if (!instance) {
    instance = getHyperdriveDatabase(env.DATABASE);
  }

  return instance;
};

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
