import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// biome-ignore lint/performance/noNamespaceImport: intentionally importing all schema files
import * as schema from "./schema";

export type DatabaseHyperdrive = Pick<Hyperdrive, "connectionString">;

export interface DatabaseBindings {
  DATABASE: DatabaseHyperdrive;
}

export type Database = NodePgDatabase<typeof schema>;

export const getHyperdriveDatabase = (
  hyperdrive: DatabaseHyperdrive
): Database =>
  drizzle(new Pool({ connectionString: hyperdrive.connectionString }), {
    schema,
  });
