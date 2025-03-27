// Base
import Provider from "@/base/provider";

// Types
import type { Account } from "@/types/auth";
import type {
	ExchangeProps,
	ExchangeResponse,
	GrantProps,
	GrantResponse,
	ValidateProps,
	ValidateResponse,
} from "@/types/connect";
import type { Response } from "@/types/response";
import type { PublishProps } from "@/types/publish";
import type { FacebookConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class Facebook extends Provider<FacebookConfig, Account> {
	private version: "v21.0" | "v22.0" = "v22.0";

	constructor({
		config,
		accounts,
	}: Readonly<{
		config: FacebookConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"pages_show_list",
					"publish_video",
					"pages_manage_posts",
					// Required to publish to pages
					"pages_read_engagement",
					// Required to retrieve the list of pages the account is connected to
					"business_management",
				],
			},
			accounts,
		});

		this.version = config.version ?? "v22.0";
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Facebook account.
	 *
	 * @param client_id - The client ID
	 * @param redirect_uri - The redirect URI
	 * @param scopes - The scopes
	 *
	 * @returns The URL to redirect to
	 */
	async grant(
		{ scopes }: Omit<GrantProps, "client_id" | "redirect_uri"> = {
			scopes: this.config.scopes ?? [],
		},
	): Promise<Response<GrantResponse | null>> {
		return super.grant({
			base: `https://www.facebook.com/${this.version}/dialog/oauth`,
			scopes,
		});
	}

	/**
	 * Validates a Facebook access token against the required scopes.
	 *
	 * @param access_token - The access token to validate
	 * @param scopes - The required scopes
	 *
	 * @returns The granted scopes and the expiry date of the access token.
	 */
	async validate({
		access_token,
		scopes,
	}: Omit<ValidateProps, "client_id" | "client_secret">): Promise<
		Response<ValidateResponse | null>
	> {
		const url = new URL("https://graph.facebook.com/debug_token");
		url.searchParams.set("input_token", access_token);
		url.searchParams.set(
			"access_token",
			`${this.config.clientId}|${this.config.clientSecret}`,
		);

		const response = await fetch(url);
		const body = await response.json();

		const granted_scopes = body?.data?.scopes;

		if (
			granted_scopes &&
			!scopes.every((required) => granted_scopes?.includes(required))
		) {
			return {
				data: null,
				error: {
					message: `Invalid scope(s). Missing: ${scopes
						.filter((required) => !granted_scopes?.includes(required))
						.join(", ")}`,
					hint: "The necessary permissions are not set for this connection.",
				},
			};
		}

		return {
			data: {
				scopes: granted_scopes,
			},
			error: null,
		};
	}

	/**
	 * Exchanges a Facebook code for useful tokens.
	 *
	 * @param code - The code to exchange
	 * @param csrf_token - The CSRF token
	 *
	 * @returns The refresh token, long-lived access token, account ID, and expiry date
	 */
	async exchange({
		code,
		csrf_token,
	}: Omit<
		ExchangeProps,
		"client_id" | "client_secret" | "redirect_uri"
	>): Promise<Response<ExchangeResponse | null>> {
		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			// Step 1: Exchange code for access token
			const accessTokenResponse = await fetch(
				`https://graph.facebook.com/${this.version}/oauth/access_token`,
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						client_id: this.config.clientId,
						client_secret: this.config.clientSecret,
						grant_type: "authorization_code",
						redirect_uri: this.config.redirectUri,
						code,
						...(csrf_token ? { code_verifier: csrf_token } : {}),
					}),
				},
			);

			if (!accessTokenResponse.ok) {
				console.error(await accessTokenResponse.text());
				throw new Error("Failed to exchange Facebook code for access token");
			}

			const { access_token } = await accessTokenResponse.json();

			// Step 2: Exchange access token for long-lived access token
			const refreshTokenResponse = await fetch(
				`https://graph.facebook.com/${this.version}/oauth/access_token`,
				{
					method: "GET",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						fb_exchange_token: access_token,
						client_id: this.config.clientId,
						client_secret: this.config.clientSecret,
						grant_type: "fb_exchange_token",
					}),
				},
			);

			if (!refreshTokenResponse.ok) {
				console.error(await refreshTokenResponse.text());
				throw new Error("Failed to exchange Facebook token to refresh token");
			}

			const refreshTokenData = await refreshTokenResponse.json();

			console.log(refreshTokenData);

			const { access_token: refresh_token } = refreshTokenData;

			// Step 3: Validate the refresh token
			const validation = await this.validate({
				access_token: refresh_token,
				scopes: this.config.scopes ?? [],
			});

			if (validation.error) {
				return { data: null, error: validation.error };
			}

			// Step 4: Get user info
			const userResponse = await fetch(
				`https://graph.facebook.com/${this.version}/me?fields=id,name,profile_pic`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			if (!userResponse.ok) {
				console.error(await userResponse.text());
				throw new Error("Failed to get Facebook user info");
			}

			const userData = await userResponse.json();
			const { id: account_id, name, profile_pic } = userData;

			// Step 5: Get user's pages
			const pagesResponse = await fetch(
				`https://graph.facebook.com/${this.version}/me/accounts?fields=id,access_token`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			if (!pagesResponse.ok) {
				console.error(await pagesResponse.text());
				throw new Error("Failed to get Facebook pages");
			}

			const pagesData = await pagesResponse.json();
			const { data: pages = [] } = pagesData;

			return {
				data: {
					access_token: refresh_token,
					refresh_token: undefined,
					account_id,
					expiry: timestamp(90 * 24 * 60 * 60), // 90 days in seconds
					details: {
						name: name ?? null,
						username: null,
						avatar_url: profile_pic ?? null,
						pages: pages.map((page: { id: string }) => page.id),
					},
				},
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Failed to exchange Facebook code",
				},
			};
		}
	}

	/**
	 * Refreshes a Facebook access token or refresh token.
	 *
	 * @param token - The token to refresh
	 * @param option - The token to refresh
	 *
	 * @returns The new access token, refresh token, and expiry date
	 */
	async refresh({
		token,
	}: Omit<RefreshAccessTokenProps, "client_id" | "client_secret">): Promise<
		Response<RefreshAccessTokenResponse | null>
	> {
		return {
			data: {
				token: "",
				expires_in: 0,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to Facebook.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"facebook">, "account">): Promise<
		Response<
			| {
					success: boolean;
					post_id: string;
					account_id: string;
			  }[]
			| null
		>
	> {
		if (!this.accounts) {
			throw new Error("No account connected");
		}

		return {
			data: null,
			error: {
				message: "Facebook is not yet supported",
			},
		};
	}
}

export default Facebook;
