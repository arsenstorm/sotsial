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
import type { TwitterConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class Twitter extends Provider<TwitterConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: TwitterConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"tweet.read",
					"tweet.write",
					"users.read",
					"offline.access",
				],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Twitter account.
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
			base: "https://twitter.com/i/oauth2/authorize",
			scopes,
			delimiter: " ",
		});
	}

	/**
	 * Validates a Twitter access token against the required scopes.
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
		// TODO: Implement this

		return super.validate({
			access_token,
			scopes,
		});
	}

	/**
	 * Exchanges a Twitter code for useful tokens.
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

			// Exchange code for access token
			const tokenResponse = await fetch(
				"https://api.twitter.com/2/oauth2/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${Buffer.from(
							`${this.config.clientId}:${this.config.clientSecret}`,
						).toString("base64")}`,
					},
					body: new URLSearchParams({
						code,
						grant_type: "authorization_code",
						client_id: this.config.clientId,
						client_secret: this.config.clientSecret,
						redirect_uri: this.config.redirectUri,
						code_verifier: csrf_token ?? "",
					}),
				},
			);

			if (!tokenResponse.ok) {
				const error = await tokenResponse.text();
				throw new Error(`Failed to exchange Twitter code: ${error}`);
			}

			const { access_token, refresh_token, expires_in, scope } =
				await tokenResponse.json();

			// Validate the scopes
			const scopes = scope?.split(" ") ?? [];
			const { data: scopeValidation } = this.local_validate({
				scopes,
			});

			if (!scopeValidation?.valid) {
				throw new Error(
					"Invalid scopes - the user has not granted the required scopes.",
				);
			}

			// Get user information
			const userResponse = await fetch(
				"https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url",
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				},
			);

			if (!userResponse.ok) {
				const error = await userResponse.text();
				throw new Error(`Failed to get Twitter user info: ${error}`);
			}

			const userData = await userResponse.json();
			const user = userData.data;

			return {
				data: {
					access_token,
					refresh_token,
					account_id: user.id,
					expiry: timestamp(expires_in),
					details: {
						name: user.name ?? null,
						username: user.username ?? null,
						avatar_url: user.profile_image_url ?? null,
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
							: "Failed to exchange Twitter code",
				},
			};
		}
	}

	/**
	 * Refreshes a Twitter access token.
	 *
	 * @param token - The token to refresh
	 * @param option - The token to refresh
	 *
	 * @returns The new access token, refresh token, and expiry date
	 */
	async refresh({
		token,
		option = "refresh_token",
	}: Omit<RefreshAccessTokenProps, "client_id" | "client_secret"> & {
		option?: "refresh_token";
	}): Promise<Response<RefreshAccessTokenResponse | null>> {
		// TODO: Implement this

		return {
			data: {
				token: "",
				expires_in: 0,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to Twitter.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"twitter">, "account">): Promise<
		Response<
			| {
					success: boolean;
					post_id: string;
					account_id: string;
			  }[]
			| null
		>
	> {
		return {
			data: null,
			error: {
				message: "Twitter publishing is not supported",
			},
		};
	}
}

export default Twitter;
