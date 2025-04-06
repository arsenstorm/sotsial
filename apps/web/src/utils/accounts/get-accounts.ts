import "server-only";

// Supabase
import { createSupaClient } from "@/utils/supabase/supa";
import { decrypt } from "sotsial/utils";

/**
 * Get accounts from the database
 *
 * @param targets - The targets to get accounts for
 *
 * Targets can look like the following:
 * [connectionId]
 * [platform]:[username]
 * [platform]:[accountId]
 *
 * @param userId - The user ID to get accounts for
 * @param credentialIds - The credential IDs to get accounts for
 *
 * @returns The accounts
 */
export async function getAccounts({
	targets,
	userId,
	credentialIds = null,
}: Readonly<{
	targets: string[];
	userId: string;
	credentialIds?: string[] | null;
}>): Promise<{
	data: {
		id: string;
		account_id: string;
		access_token: string | null;
		refresh_token: string | null;
		expiry: string;
		platform: string;
	}[];
	error: {
		message: string;
		hint?: string;
	} | null;
}> {
	const supa = createSupaClient();

	if (!userId) {
		return {
			data: [],
			error: {
				message: "User ID is required",
			},
		};
	}

	if (!targets.length) {
		return {
			data: [],
			error: {
				message: "Targets are required",
			},
		};
	}

	const filteredTargets = targets.filter((target) => target.trim() !== "");

	if (!filteredTargets.length) {
		return {
			data: [],
			error: {
				message: "Targets cannot be empty",
			},
		};
	}

	const query = supa
		.from("connections")
		.select("id, account_id, platform, access_token, refresh_token, expiry")
		.eq("user_id", userId);

	if (credentialIds && credentialIds.length > 0) {
		query.in("credential", credentialIds);
	}

	const isUuid = (value: string) => {
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
			value,
		);
	};

	const conditions = [];

	// UUID conditions
	const uuidTargets = targets.filter((target) => isUuid(target));
	if (uuidTargets.length > 0) {
		conditions.push(`id.in.(${uuidTargets.join(",")})`);
	}

	// IMPORTANT TODO: when we allow a user to generate a grant URL with tags,
	// we must prepend `uuid:` to the target
	for (const tag of targets.filter(
		(target) => !isUuid(target) && !target.includes(":"),
	)) {
		if (tag.trim() !== "") {
			conditions.push(`tags.cs.{${tag.trim()}}`);
		}
	}

	// platform targets are in the form of `<platform>:<id|username>`
	const platformTargets = targets.filter((target) => {
		return target.includes(":");
	});

	// Platform:account_id conditions
	const accountIdConditions = platformTargets.map((target) => {
		const [platform, identifier] = target.split(":");
		return `and(platform.eq."${platform}",account_id.eq."${identifier}")`;
	});

	// Platform:username conditions
	const usernameConditions = platformTargets.map((target) => {
		const [platform, identifier] = target.split(":");
		return `and(platform.eq."${platform}",account->>username.eq."${identifier}")`;
	});

	// Add all platform conditions
	conditions.push(...usernameConditions, ...accountIdConditions);

	// Apply the OR filter only if we have conditions
	if (conditions.length > 0) {
		//console.log(conditions.join(","));
		query.or(conditions.join(","));
	}

	const { data, error } = await query;

	const accounts = data
		? await Promise.all(
				data.map(async (account) => ({
					id: account.id,
					account_id: account.account_id,
					access_token: account.access_token
						? await decrypt(account.access_token, {
								secret: process.env.ENCRYPTION_SECRET,
							})
						: null,
					refresh_token: account.refresh_token
						? await decrypt(account.refresh_token, {
								secret: process.env.ENCRYPTION_SECRET,
							})
						: null,
					expiry: account.expiry,
					platform: account.platform,
				})),
			)
		: [];

	return {
		data: accounts,
		error,
	};
}
