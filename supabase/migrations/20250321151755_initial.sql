create type "public"."Grant Status" as enum ('pending', 'success', 'failed');

create table "public"."apikey" (
    "id" text not null,
    "name" text,
    "start" text,
    "prefix" text,
    "key" text not null,
    "userId" text not null,
    "refillInterval" integer,
    "refillAmount" integer,
    "lastRefillAt" timestamp without time zone,
    "enabled" boolean,
    "rateLimitEnabled" boolean,
    "rateLimitTimeWindow" integer,
    "rateLimitMax" integer,
    "requestCount" integer,
    "remaining" integer,
    "lastRequest" timestamp without time zone,
    "expiresAt" timestamp without time zone,
    "createdAt" timestamp without time zone not null,
    "updatedAt" timestamp without time zone not null,
    "permissions" text,
    "metadata" text
);


alter table "public"."apikey" enable row level security;

create table "public"."auth_accounts" (
    "id" text not null,
    "account_id" text not null,
    "provider_id" text not null,
    "user_id" text not null,
    "access_token" text,
    "refresh_token" text,
    "id_token" text,
    "access_token_expires_at" timestamp without time zone,
    "scope" text,
    "password" text,
    "created_at" timestamp without time zone not null,
    "updated_at" timestamp without time zone not null
);


alter table "public"."auth_accounts" enable row level security;

create table "public"."auth_sessions" (
    "id" text not null,
    "expires_at" timestamp without time zone not null,
    "token" text not null,
    "created_at" timestamp without time zone not null,
    "updated_at" timestamp without time zone not null,
    "ip_address" text,
    "user_agent" text,
    "user_id" text not null
);


alter table "public"."auth_sessions" enable row level security;

create table "public"."auth_users" (
    "id" text not null,
    "name" text not null,
    "email" text not null,
    "email_verified" boolean not null,
    "avatar_url" text,
    "created_at" timestamp without time zone not null,
    "updated_at" timestamp without time zone not null
);


alter table "public"."auth_users" enable row level security;

create table "public"."auth_verification" (
    "id" text not null,
    "identifier" text not null,
    "value" text not null,
    "expires_at" timestamp without time zone not null,
    "created_at" timestamp without time zone,
    "updated_at" timestamp without time zone
);


alter table "public"."auth_verification" enable row level security;

create table "public"."connections" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" text not null,
    "credential" uuid,
    "platform" text not null,
    "account_id" text not null,
    "access_token" text not null,
    "refresh_token" text,
    "expiry" timestamp with time zone default (now() AT TIME ZONE 'utc'::text),
    "tags" text[] not null default '{}'::text[],
    "account" jsonb not null default '{}'::jsonb
);


alter table "public"."connections" enable row level security;

create table "public"."credentials" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" text not null,
    "platform" text not null,
    "client_id" text not null,
    "client_secret" text not null
);


alter table "public"."credentials" enable row level security;

create table "public"."grants" (
    "id" uuid not null default gen_random_uuid(),
    "expiry" timestamp with time zone not null,
    "platform" text not null,
    "user_id" text not null,
    "tags" text[] not null default '{}'::text[],
    "csrf_token" text,
    "credential" uuid,
    "status" "Grant Status" not null default 'pending'::"Grant Status"
);


alter table "public"."grants" enable row level security;

CREATE UNIQUE INDEX apikey_pkey ON public.apikey USING btree (id);

CREATE UNIQUE INDEX auth_accounts_pkey ON public.auth_accounts USING btree (id);

CREATE UNIQUE INDEX auth_sessions_pkey ON public.auth_sessions USING btree (id);

CREATE UNIQUE INDEX auth_sessions_token_key ON public.auth_sessions USING btree (token);

CREATE UNIQUE INDEX auth_users_email_key ON public.auth_users USING btree (email);

CREATE UNIQUE INDEX auth_users_pkey ON public.auth_users USING btree (id);

CREATE UNIQUE INDEX auth_verification_pkey ON public.auth_verification USING btree (id);

CREATE UNIQUE INDEX connections_pkey ON public.connections USING btree (id);

CREATE UNIQUE INDEX connections_user_platform_account_credential_unique ON public.connections USING btree (user_id, platform, account_id, credential) NULLS NOT DISTINCT;

CREATE UNIQUE INDEX credentials_pkey ON public.credentials USING btree (id);

CREATE UNIQUE INDEX grants_pkey ON public.grants USING btree (id);

alter table "public"."apikey" add constraint "apikey_pkey" PRIMARY KEY using index "apikey_pkey";

alter table "public"."auth_accounts" add constraint "auth_accounts_pkey" PRIMARY KEY using index "auth_accounts_pkey";

alter table "public"."auth_sessions" add constraint "auth_sessions_pkey" PRIMARY KEY using index "auth_sessions_pkey";

alter table "public"."auth_users" add constraint "auth_users_pkey" PRIMARY KEY using index "auth_users_pkey";

alter table "public"."auth_verification" add constraint "auth_verification_pkey" PRIMARY KEY using index "auth_verification_pkey";

alter table "public"."connections" add constraint "connections_pkey" PRIMARY KEY using index "connections_pkey";

alter table "public"."credentials" add constraint "credentials_pkey" PRIMARY KEY using index "credentials_pkey";

alter table "public"."grants" add constraint "grants_pkey" PRIMARY KEY using index "grants_pkey";

alter table "public"."apikey" add constraint "apikey_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth_users(id) not valid;

alter table "public"."apikey" validate constraint "apikey_userId_fkey";

alter table "public"."auth_accounts" add constraint "auth_accounts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) not valid;

alter table "public"."auth_accounts" validate constraint "auth_accounts_user_id_fkey";

alter table "public"."auth_sessions" add constraint "auth_sessions_token_key" UNIQUE using index "auth_sessions_token_key";

alter table "public"."auth_sessions" add constraint "auth_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) not valid;

alter table "public"."auth_sessions" validate constraint "auth_sessions_user_id_fkey";

alter table "public"."auth_users" add constraint "auth_users_email_key" UNIQUE using index "auth_users_email_key";

alter table "public"."connections" add constraint "connections_credential_fkey" FOREIGN KEY (credential) REFERENCES credentials(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."connections" validate constraint "connections_credential_fkey";

alter table "public"."connections" add constraint "connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."connections" validate constraint "connections_user_id_fkey";

alter table "public"."connections" add constraint "connections_user_platform_account_credential_unique" UNIQUE using index "connections_user_platform_account_credential_unique";

alter table "public"."credentials" add constraint "credentials_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."credentials" validate constraint "credentials_user_id_fkey";

alter table "public"."grants" add constraint "grants_credential_fkey" FOREIGN KEY (credential) REFERENCES credentials(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."grants" validate constraint "grants_credential_fkey";

alter table "public"."grants" add constraint "grants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth_users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."grants" validate constraint "grants_user_id_fkey";

grant delete on table "public"."apikey" to "anon";

grant insert on table "public"."apikey" to "anon";

grant references on table "public"."apikey" to "anon";

grant select on table "public"."apikey" to "anon";

grant trigger on table "public"."apikey" to "anon";

grant truncate on table "public"."apikey" to "anon";

grant update on table "public"."apikey" to "anon";

grant delete on table "public"."apikey" to "authenticated";

grant insert on table "public"."apikey" to "authenticated";

grant references on table "public"."apikey" to "authenticated";

grant select on table "public"."apikey" to "authenticated";

grant trigger on table "public"."apikey" to "authenticated";

grant truncate on table "public"."apikey" to "authenticated";

grant update on table "public"."apikey" to "authenticated";

grant delete on table "public"."apikey" to "service_role";

grant insert on table "public"."apikey" to "service_role";

grant references on table "public"."apikey" to "service_role";

grant select on table "public"."apikey" to "service_role";

grant trigger on table "public"."apikey" to "service_role";

grant truncate on table "public"."apikey" to "service_role";

grant update on table "public"."apikey" to "service_role";

grant delete on table "public"."auth_accounts" to "anon";

grant insert on table "public"."auth_accounts" to "anon";

grant references on table "public"."auth_accounts" to "anon";

grant select on table "public"."auth_accounts" to "anon";

grant trigger on table "public"."auth_accounts" to "anon";

grant truncate on table "public"."auth_accounts" to "anon";

grant update on table "public"."auth_accounts" to "anon";

grant delete on table "public"."auth_accounts" to "authenticated";

grant insert on table "public"."auth_accounts" to "authenticated";

grant references on table "public"."auth_accounts" to "authenticated";

grant select on table "public"."auth_accounts" to "authenticated";

grant trigger on table "public"."auth_accounts" to "authenticated";

grant truncate on table "public"."auth_accounts" to "authenticated";

grant update on table "public"."auth_accounts" to "authenticated";

grant delete on table "public"."auth_accounts" to "service_role";

grant insert on table "public"."auth_accounts" to "service_role";

grant references on table "public"."auth_accounts" to "service_role";

grant select on table "public"."auth_accounts" to "service_role";

grant trigger on table "public"."auth_accounts" to "service_role";

grant truncate on table "public"."auth_accounts" to "service_role";

grant update on table "public"."auth_accounts" to "service_role";

grant delete on table "public"."auth_sessions" to "anon";

grant insert on table "public"."auth_sessions" to "anon";

grant references on table "public"."auth_sessions" to "anon";

grant select on table "public"."auth_sessions" to "anon";

grant trigger on table "public"."auth_sessions" to "anon";

grant truncate on table "public"."auth_sessions" to "anon";

grant update on table "public"."auth_sessions" to "anon";

grant delete on table "public"."auth_sessions" to "authenticated";

grant insert on table "public"."auth_sessions" to "authenticated";

grant references on table "public"."auth_sessions" to "authenticated";

grant select on table "public"."auth_sessions" to "authenticated";

grant trigger on table "public"."auth_sessions" to "authenticated";

grant truncate on table "public"."auth_sessions" to "authenticated";

grant update on table "public"."auth_sessions" to "authenticated";

grant delete on table "public"."auth_sessions" to "service_role";

grant insert on table "public"."auth_sessions" to "service_role";

grant references on table "public"."auth_sessions" to "service_role";

grant select on table "public"."auth_sessions" to "service_role";

grant trigger on table "public"."auth_sessions" to "service_role";

grant truncate on table "public"."auth_sessions" to "service_role";

grant update on table "public"."auth_sessions" to "service_role";

grant delete on table "public"."auth_users" to "anon";

grant insert on table "public"."auth_users" to "anon";

grant references on table "public"."auth_users" to "anon";

grant select on table "public"."auth_users" to "anon";

grant trigger on table "public"."auth_users" to "anon";

grant truncate on table "public"."auth_users" to "anon";

grant update on table "public"."auth_users" to "anon";

grant delete on table "public"."auth_users" to "authenticated";

grant insert on table "public"."auth_users" to "authenticated";

grant references on table "public"."auth_users" to "authenticated";

grant select on table "public"."auth_users" to "authenticated";

grant trigger on table "public"."auth_users" to "authenticated";

grant truncate on table "public"."auth_users" to "authenticated";

grant update on table "public"."auth_users" to "authenticated";

grant delete on table "public"."auth_users" to "service_role";

grant insert on table "public"."auth_users" to "service_role";

grant references on table "public"."auth_users" to "service_role";

grant select on table "public"."auth_users" to "service_role";

grant trigger on table "public"."auth_users" to "service_role";

grant truncate on table "public"."auth_users" to "service_role";

grant update on table "public"."auth_users" to "service_role";

grant delete on table "public"."auth_verification" to "anon";

grant insert on table "public"."auth_verification" to "anon";

grant references on table "public"."auth_verification" to "anon";

grant select on table "public"."auth_verification" to "anon";

grant trigger on table "public"."auth_verification" to "anon";

grant truncate on table "public"."auth_verification" to "anon";

grant update on table "public"."auth_verification" to "anon";

grant delete on table "public"."auth_verification" to "authenticated";

grant insert on table "public"."auth_verification" to "authenticated";

grant references on table "public"."auth_verification" to "authenticated";

grant select on table "public"."auth_verification" to "authenticated";

grant trigger on table "public"."auth_verification" to "authenticated";

grant truncate on table "public"."auth_verification" to "authenticated";

grant update on table "public"."auth_verification" to "authenticated";

grant delete on table "public"."auth_verification" to "service_role";

grant insert on table "public"."auth_verification" to "service_role";

grant references on table "public"."auth_verification" to "service_role";

grant select on table "public"."auth_verification" to "service_role";

grant trigger on table "public"."auth_verification" to "service_role";

grant truncate on table "public"."auth_verification" to "service_role";

grant update on table "public"."auth_verification" to "service_role";

grant delete on table "public"."connections" to "anon";

grant insert on table "public"."connections" to "anon";

grant references on table "public"."connections" to "anon";

grant select on table "public"."connections" to "anon";

grant trigger on table "public"."connections" to "anon";

grant truncate on table "public"."connections" to "anon";

grant update on table "public"."connections" to "anon";

grant delete on table "public"."connections" to "authenticated";

grant insert on table "public"."connections" to "authenticated";

grant references on table "public"."connections" to "authenticated";

grant select on table "public"."connections" to "authenticated";

grant trigger on table "public"."connections" to "authenticated";

grant truncate on table "public"."connections" to "authenticated";

grant update on table "public"."connections" to "authenticated";

grant delete on table "public"."connections" to "service_role";

grant insert on table "public"."connections" to "service_role";

grant references on table "public"."connections" to "service_role";

grant select on table "public"."connections" to "service_role";

grant trigger on table "public"."connections" to "service_role";

grant truncate on table "public"."connections" to "service_role";

grant update on table "public"."connections" to "service_role";

grant delete on table "public"."credentials" to "anon";

grant insert on table "public"."credentials" to "anon";

grant references on table "public"."credentials" to "anon";

grant select on table "public"."credentials" to "anon";

grant trigger on table "public"."credentials" to "anon";

grant truncate on table "public"."credentials" to "anon";

grant update on table "public"."credentials" to "anon";

grant delete on table "public"."credentials" to "authenticated";

grant insert on table "public"."credentials" to "authenticated";

grant references on table "public"."credentials" to "authenticated";

grant select on table "public"."credentials" to "authenticated";

grant trigger on table "public"."credentials" to "authenticated";

grant truncate on table "public"."credentials" to "authenticated";

grant update on table "public"."credentials" to "authenticated";

grant delete on table "public"."credentials" to "service_role";

grant insert on table "public"."credentials" to "service_role";

grant references on table "public"."credentials" to "service_role";

grant select on table "public"."credentials" to "service_role";

grant trigger on table "public"."credentials" to "service_role";

grant truncate on table "public"."credentials" to "service_role";

grant update on table "public"."credentials" to "service_role";

grant delete on table "public"."grants" to "anon";

grant insert on table "public"."grants" to "anon";

grant references on table "public"."grants" to "anon";

grant select on table "public"."grants" to "anon";

grant trigger on table "public"."grants" to "anon";

grant truncate on table "public"."grants" to "anon";

grant update on table "public"."grants" to "anon";

grant delete on table "public"."grants" to "authenticated";

grant insert on table "public"."grants" to "authenticated";

grant references on table "public"."grants" to "authenticated";

grant select on table "public"."grants" to "authenticated";

grant trigger on table "public"."grants" to "authenticated";

grant truncate on table "public"."grants" to "authenticated";

grant update on table "public"."grants" to "authenticated";

grant delete on table "public"."grants" to "service_role";

grant insert on table "public"."grants" to "service_role";

grant references on table "public"."grants" to "service_role";

grant select on table "public"."grants" to "service_role";

grant trigger on table "public"."grants" to "service_role";

grant truncate on table "public"."grants" to "service_role";

grant update on table "public"."grants" to "service_role";

create policy "no_access_policy"
on "public"."apikey"
as permissive
for all
to public
using (false);


create policy "no_access_policy"
on "public"."auth_accounts"
as permissive
for all
to public
using (false);


create policy "no_access_policy"
on "public"."auth_sessions"
as permissive
for all
to public
using (false);


create policy "no_access_policy"
on "public"."auth_users"
as permissive
for all
to public
using (false);


create policy "no_access_policy"
on "public"."auth_verification"
as permissive
for all
to public
using (false);


create policy "No access"
on "public"."connections"
as restrictive
for select
to public
using (true);


create policy "No access"
on "public"."credentials"
as restrictive
for select
to public
using (true);


create policy "No access"
on "public"."grants"
as restrictive
for select
to public
using (true);



