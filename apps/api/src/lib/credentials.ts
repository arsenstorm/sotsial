import { credentials } from "@sotsial/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import { decrypt } from "sotsial/utils";
import { db } from "../db";
import { env } from "../env";

export interface ResolvedCredential {
  clientId: string;
  clientSecret: string;
  id: string;
  organizationId: string;
  platform: string;
}

/**
 * Resolve one or more credentials belonging to an organization. An identifier
 * may be either a credentials.id (uuid) or a credentials.client_id.
 */
export const getCredentials = async (
  identifiers: string | string[],
  organizationId: string
): Promise<ResolvedCredential[]> => {
  const ids = Array.isArray(identifiers) ? identifiers : [identifiers];

  if (ids.length === 0) {
    return [];
  }

  const rows = await db()
    .select({
      id: credentials.id,
      organizationId: credentials.organizationId,
      platform: credentials.platform,
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
    })
    .from(credentials)
    .where(
      and(
        eq(credentials.organizationId, organizationId),
        or(inArray(credentials.id, ids), inArray(credentials.clientId, ids))
      )
    );

  return await Promise.all(
    rows.map(async (row) => {
      const secret = await decrypt(row.clientSecret, {
        secret: env.ENCRYPTION_KEY,
      });

      if (!secret) {
        throw new Error(
          "Invalid credential: client_secret could not be decrypted"
        );
      }

      return {
        id: row.id,
        organizationId: row.organizationId,
        platform: row.platform,
        clientId: row.clientId,
        clientSecret: secret,
      };
    })
  );
};
