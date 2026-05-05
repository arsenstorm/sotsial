import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const organization = pgTable("organization", {
  id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
});

export const subscription = pgTable(
  "subscription",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    plan: text("plan").notNull(),
    referenceId: text("reference_id").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text("status").notNull().default("incomplete"),
    periodStart: timestamp("period_start"),
    periodEnd: timestamp("period_end"),
    cancelAtPeriodEnd: text("cancel_at_period_end"),
    seats: text("seats"),
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),
    stripeScheduleId: text("stripe_schedule_id"),
  },
  (table) => [
    index("subscription_referenceId_idx").on(table.referenceId),
    index("subscription_stripeSubscriptionId_idx").on(
      table.stripeSubscriptionId
    ),
  ]
);

export const member = pgTable(
  "member",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("member_organizationId_idx").on(table.organizationId),
    index("member_userId_idx").on(table.userId),
  ]
);

export const invitation = pgTable(
  "invitation",
  {
    id: uuid("id").default(sql`pg_catalog.gen_random_uuid()`).primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").notNull().default("pending"),
    inviterId: uuid("inviter_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("invitation_organizationId_idx").on(table.organizationId),
    index("invitation_email_idx").on(table.email),
  ]
);
