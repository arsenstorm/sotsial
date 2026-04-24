CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT pg_catalog.gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" uuid NOT NULL,
	"text" text,
	"media" jsonb,
	"targets" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"platform_settings" jsonb,
	"results" jsonb
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_organizationId_idx" ON "posts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "posts_createdAt_idx" ON "posts" USING btree ("created_at");