import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    text: text("text"),
    media: jsonb("media"),
    targets: text("targets").array().notNull().default(sql`ARRAY[]::text[]`),
    platformSettings: jsonb("platform_settings"),
    results: jsonb("results"),
  },
  (table) => [
    index("posts_organizationId_idx").on(table.organizationId),
    index("posts_createdAt_idx").on(table.createdAt),
  ]
);
