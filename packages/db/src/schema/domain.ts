import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";

export const grantStatus = pgEnum("grant_status", [
  "pending",
  "success",
  "failed",
]);

export const credentials = pgTable(
  "credentials",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    clientId: text("client_id").notNull(),
    clientSecret: text("client_secret").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("credentials_organizationId_idx").on(table.organizationId),
    index("credentials_platform_idx").on(table.platform),
    index("credentials_clientId_idx").on(table.clientId),
  ]
);

export const connections = pgTable(
  "connections",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    credential: uuid("credential").references(() => credentials.id, {
      onDelete: "cascade",
    }),
    platform: text("platform").notNull(),
    accountId: text("account_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiry: timestamp("expiry", { withTimezone: true }),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    account: jsonb("account"),
  },
  (table) => [
    index("connections_organizationId_idx").on(table.organizationId),
    index("connections_platform_idx").on(table.platform),
    uniqueIndex("connections_org_platform_account_credential_uniq").on(
      table.organizationId,
      table.platform,
      table.accountId,
      table.credential
    ),
  ]
);

export const grants = pgTable(
  "grants",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiry: timestamp("expiry", { withTimezone: true }).notNull(),
    platform: text("platform").notNull(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    csrfToken: text("csrf_token").notNull(),
    credential: uuid("credential").references(() => credentials.id, {
      onDelete: "cascade",
    }),
    status: grantStatus("status").notNull().default("pending"),
  },
  (table) => [
    index("grants_organizationId_idx").on(table.organizationId),
    index("grants_platform_idx").on(table.platform),
  ]
);
