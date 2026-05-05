import { connections } from "@sotsial/db/schema";
import { and, eq, inArray, or, type SQL, sql } from "drizzle-orm";
import { decrypt } from "sotsial/utils";
import { db } from "../db";
import { env } from "../env";

export interface ResolvedAccount {
  accessToken: string | null;
  accountId: string;
  expiry: Date | null;
  id: string;
  platform: string;
  refreshToken: string | null;
}

const UUID_REGEX =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const isUuid = (value: string) => UUID_REGEX.test(value);

/**
 * Resolve connection "targets" into account records scoped to the org.
 *
 * A target can be:
 *   - a UUID → connections.id
 *   - "<platform>:<accountId>"
 *   - "<platform>:<username>" (matches account->>'username')
 *   - a bare tag (matches connections.tags)
 */
export const getAccounts = async ({
  targets,
  organizationId,
  credentialIds,
}: {
  targets: string[];
  organizationId: string;
  credentialIds?: string[] | null;
}): Promise<{
  data: ResolvedAccount[];
  error: { message: string; hint?: string } | null;
}> => {
  if (!organizationId) {
    return { data: [], error: { message: "Organization ID is required" } };
  }

  const cleaned = targets.map((t) => t.trim()).filter((t) => t.length > 0);

  if (cleaned.length === 0) {
    return { data: [], error: { message: "Targets are required" } };
  }

  const uuidTargets = cleaned.filter(isUuid);
  const platformTargets = cleaned.filter((t) => !isUuid(t) && t.includes(":"));
  const tagTargets = cleaned.filter((t) => !(isUuid(t) || t.includes(":")));

  const predicates: SQL[] = [];

  if (uuidTargets.length > 0) {
    predicates.push(inArray(connections.id, uuidTargets));
  }

  for (const tag of tagTargets) {
    predicates.push(sql`${connections.tags} @> ARRAY[${tag}]::text[]`);
  }

  for (const target of platformTargets) {
    const [platform, identifier] = target.split(":");
    if (!(platform && identifier)) {
      continue;
    }

    predicates.push(
      and(
        eq(connections.platform, platform),
        eq(connections.accountId, identifier)
      ) as SQL
    );
    predicates.push(
      and(
        eq(connections.platform, platform),
        sql`${connections.account}->>'username' = ${identifier}`
      ) as SQL
    );
  }

  if (predicates.length === 0) {
    return { data: [], error: null };
  }

  const whereClauses: SQL[] = [
    eq(connections.organizationId, organizationId),
    or(...predicates) as SQL,
  ];

  if (credentialIds && credentialIds.length > 0) {
    whereClauses.push(inArray(connections.credential, credentialIds));
  }

  const rows = await db()
    .select({
      id: connections.id,
      accountId: connections.accountId,
      platform: connections.platform,
      accessToken: connections.accessToken,
      refreshToken: connections.refreshToken,
      expiry: connections.expiry,
    })
    .from(connections)
    .where(and(...whereClauses));

  const data = await Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      accountId: row.accountId,
      platform: row.platform,
      expiry: row.expiry,
      accessToken: row.accessToken
        ? await decrypt(row.accessToken, { secret: env.ENCRYPTION_KEY })
        : null,
      refreshToken: row.refreshToken
        ? await decrypt(row.refreshToken, { secret: env.ENCRYPTION_KEY })
        : null,
    }))
  );

  return { data, error: null };
};
