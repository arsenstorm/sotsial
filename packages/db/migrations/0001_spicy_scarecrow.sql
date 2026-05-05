CREATE TYPE "public"."grant_status" AS ENUM('pending', 'success', 'failed');--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"credential" uuid,
	"platform" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expiry" timestamp with time zone,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"account" jsonb
);
--> statement-breakpoint
CREATE TABLE "credentials" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grants" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expiry" timestamp with time zone NOT NULL,
	"platform" text NOT NULL,
	"organization_id" uuid NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"csrf_token" text NOT NULL,
	"credential" uuid,
	"status" "grant_status" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_credential_credentials_id_fk" FOREIGN KEY ("credential") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants" ADD CONSTRAINT "grants_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants" ADD CONSTRAINT "grants_credential_credentials_id_fk" FOREIGN KEY ("credential") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "connections_organizationId_idx" ON "connections" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "connections_platform_idx" ON "connections" USING btree ("platform");--> statement-breakpoint
CREATE UNIQUE INDEX "connections_org_platform_account_credential_uniq" ON "connections" USING btree ("organization_id","platform","account_id","credential");--> statement-breakpoint
CREATE INDEX "credentials_organizationId_idx" ON "credentials" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "credentials_platform_idx" ON "credentials" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "credentials_clientId_idx" ON "credentials" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "grants_organizationId_idx" ON "grants" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "grants_platform_idx" ON "grants" USING btree ("platform");