// Sotsial
import Sotsial from "sotsial";

// Next
import { type NextRequest, NextResponse } from "next/server";

// Auth
import { authorise } from "@/utils/auth/authorise";

// Utils
import { getCredentials } from "@/utils/credentials/get";
import { getAccounts } from "@/utils/accounts/get-accounts";
import { createCdnUrl } from "@/utils/cdn-url";

export async function POST(request: NextRequest) {
	const {
		post,
		credentials: credentialIds = [],
		targets = [],
	} = await request.json();

	// Verify the API key or Session
	// We don't need to check the type here because both are accepted.
	const { valid, userId } = await authorise(request);

	if (!valid || !userId) {
		return NextResponse.json(
			{
				data: null,
				error: { message: "Unauthorized" },
			},
			{ status: 401 },
		);
	}

	if (targets.length === 0) {
		return NextResponse.json(
			{
				data: null,
				error: {
					message: "No targets provided",
					hint: "Who are you trying to publish to? Check out the docs at https://sotsial.com/docs/publishing#targets",
				},
			},
			{ status: 400 },
		);
	}

	let credentialsData: {
		client_id: string;
		client_secret: string;
		platform: string;
		user_id: string;
	}[] = [];

	const credentials: {
		[key: string]: Omit<
			(typeof credentialsData)[number],
			"user_id" | "platform"
		>;
	} = {
		threads: {
			client_id: process.env.THREADS_CLIENT_ID ?? "",
			client_secret: process.env.THREADS_CLIENT_SECRET ?? "",
		},
		instagram: {
			client_id: process.env.INSTAGRAM_CLIENT_ID ?? "",
			client_secret: process.env.INSTAGRAM_CLIENT_SECRET ?? "",
		},
		tiktok: {
			client_id: process.env.TIKTOK_CLIENT_ID ?? "",
			client_secret: process.env.TIKTOK_CLIENT_SECRET ?? "",
		},
		facebook: {
			client_id: process.env.FACEBOOK_CLIENT_ID ?? "",
			client_secret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
		},
	};

	if (credentialIds.length > 0) {
		// Get the credentials from the database
		credentialsData = await getCredentials(credentialIds, {
			userId,
		});

		if (credentialsData.length !== credentialIds.length) {
			return NextResponse.json(
				{
					data: null,
					error: {
						message: "Invalid credentials",
						hint: "Some of the credentials you provided are invalid. Please check that you have added the correct credentials for the platforms you're trying to publish to.",
					},
				},
				{ status: 400 },
			);
		}

		// search all of the credentials to see if there are any duplicates
		const duplicatePlatforms = credentialsData.filter(
			(credential, index, self) =>
				self.findIndex((t) => t.platform === credential.platform) !== index,
		);

		if (duplicatePlatforms.length > 0) {
			return NextResponse.json(
				{
					data: null,
					error: {
						message:
							"You've provided multiple credentials for the same platform. You can only provide one credential per platform.",
						hint: "See the docs for more information: https://sotsial.com/docs/credentials",
					},
				},
				{ status: 400 },
			);
		}

		for (const credential of credentialsData) {
			credentials[credential.platform] = credential;
		}
	}

	const { data: accounts, error: accountsError } = await getAccounts({
		targets,
		credentialIds,
		userId,
	});

	if (accountsError) {
		console.error(accountsError);
		return NextResponse.json(
			{
				data: null,
				error: {
					message: "An error occurred while fetching accounts",
					hint: "Please try again later.",
				},
			},
			{ status: 500 },
		);
	}

	if (accounts.length === 0) {
		return NextResponse.json(
			{
				data: null,
				error: {
					message:
						"We couldn't find any accounts for the platforms you're trying to publish to.",
					hint: "Check that you have added accounts for the platforms you're trying to publish to.",
				},
			},
			{ status: 404 },
		);
	}

	const accountsByPlatform = accounts.reduce(
		(acc: Record<string, any[]>, account) => {
			// Group accounts by platform
			acc[account.platform] = acc[account.platform] ?? [];
			acc[account.platform].push(account);
			return acc;
		},
		{} as Record<string, any[]>,
	);

	// Here we initialise the Sotsial instance.
	// If there isn't a user-provided credential for a platform, we'll use the Sotsial-provided default credentials.
	const sotsial = new Sotsial({
		...(accountsByPlatform.threads
			? {
					threads: {
						config: {
							clientId: credentials?.threads?.client_id,
							clientSecret: credentials?.threads?.client_secret,
						},
						accounts: (accountsByPlatform.threads ?? []).map((account) => ({
							id: account.account_id,
							access_token: account.access_token,
						})),
					},
				}
			: {}),
		...(accountsByPlatform.instagram
			? {
					instagram: {
						config: {
							clientId: credentials?.instagram?.client_id,
							clientSecret: credentials?.instagram?.client_secret,
						},
						accounts: (accountsByPlatform.instagram ?? []).map((account) => ({
							id: account.account_id,
							access_token: account.access_token,
						})),
					},
				}
			: {}),
		...(accountsByPlatform.tiktok
			? {
					tiktok: {
						config: {
							clientId: credentials?.tiktok?.client_id,
							clientSecret: credentials?.tiktok?.client_secret,
						},
						accounts: (accountsByPlatform.tiktok ?? []).map((account) => ({
							id: account.account_id,
							access_token: account.access_token,
						})),
					},
				}
			: {}),
		...(accountsByPlatform.facebook
			? {
					facebook: {
						config: {
							clientId: credentials?.facebook?.client_id,
							clientSecret: credentials?.facebook?.client_secret,
						},
						accounts: (accountsByPlatform.facebook ?? []).map((account) => ({
							id: account.account_id,
							access_token: account.access_token,
						})),
					},
				}
			: {}),
	});

	// Here we let Sotsial do its thing.
	const results = await sotsial.publish({
		post: {
			...post,
			media: await Promise.all(
				post.media.map(async (media: any) => ({
					...media,
					url: await createCdnUrl(media.url),
				})),
			),
		},
	});

	return NextResponse.json({ results });
}
