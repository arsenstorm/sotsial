import "server-only";

// Sotsial
import { decrypt } from "sotsial/utils";

// Supabase
import { createSupaClient } from "@/utils/supabase/supa";

/**
 * Get a credential from the database
 *
 * @param credentialId - The credential to get
 *
 * @returns The credential
 */
export async function getCredentials(
	credentials: string | string[],
	{
		userId,
	}: {
		userId?: string;
	},
): Promise<
	{
		user_id: string;
		platform: string;
		client_id: string;
		client_secret: string;
	}[]
> {
	const supa = createSupaClient();

	const query = supa
		.from("credentials")
		.select("user_id, platform, client_id, client_secret");

	// The provided credential ID can either be the true ID or the app's client ID
	if (Array.isArray(credentials)) {
		// Multiple credentials
		query.or(
			`id.in.(${credentials.join(",")}),client_id.in.(${credentials.join(",")})`,
		);
	} else {
		// Single credential
		query
			.or(`id.eq."${credentials}",client_id.eq."${credentials}"`)
			.maybeSingle();
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	if (!data) {
		throw new Error("Credential not found");
	}

	const credentialsData: {
		user_id: string;
		platform: string;
		client_id: string;
		client_secret: string;
	}[] = [];

	for (const credential of data) {
		if (userId && credential.user_id !== userId) {
			throw new Error("Forbidden");
		}

		const clientSecret = await decrypt(credential.client_secret, {
			secret: process.env.ENCRYPTION_KEY,
		});

		if (!clientSecret) {
			throw new Error("Invalid credential");
		}

		credentialsData.push({
			user_id: credential.user_id,
			platform: credential.platform,
			client_id: credential.client_id,
			client_secret: clientSecret,
		});
	}

	return credentialsData;
}
