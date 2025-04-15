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
import type { GoogleConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class Google extends Provider<GoogleConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: GoogleConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Google account.
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
			base: "https://accounts.google.com/o/oauth2/v2/auth",
			scopes,
			delimiter: " ",
		});
	}

	/**
	 * Validates a Google access token against the required scopes.
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
	 * Exchanges a Google code for useful tokens.
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

			// Step 1: Exchange code for access and refresh tokens
			const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					client_id: this.config.clientId,
					client_secret: this.config.clientSecret,
					code,
					grant_type: "authorization_code",
					redirect_uri: this.config.redirectUri,
					...(csrf_token ? { code_verifier: csrf_token } : {}),
				}),
			});

			if (!tokenResponse.ok) {
				const error = await tokenResponse.text();
				throw new Error(`Failed to exchange Google code: ${error}`);
			}

			const { access_token, refresh_token, expires_in, scope } =
				await tokenResponse.json();

			const { data: scopeValidation } = this.local_validate({
				scopes: scope.split(" "),
			});

			if (!scopeValidation?.valid) {
				throw new Error(
					"Invalid scopes - the user has not granted the required scopes.",
				);
			}

			// Step 2: Get user information to get the YouTube channel information
			const userInfoResponse = await fetch(
				"https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
				{
					headers: { Authorization: `Bearer ${access_token}` },
				},
			);

			if (!userInfoResponse.ok) {
				const error = await userInfoResponse.text();
				throw new Error(`Failed to get YouTube channel data: ${error}`);
			}

			const userData = await userInfoResponse.json();

			const channel = userData.items?.[0] ?? {};
			const channelId = channel.id;
			const snippet = channel.snippet ?? {};

			if (!channelId) {
				throw new Error("Could not retrieve YouTube channel ID");
			}

			return {
				data: {
					access_token,
					refresh_token,
					account_id: channelId,
					expiry: timestamp(expires_in),
					details: {
						name: snippet.title ?? null,
						username:
							snippet?.customUrl?.replace("@", "") ?? snippet?.title ?? null,
						avatar_url: snippet.thumbnails?.default?.url ?? null,
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
							: "Failed to exchange Google code",
				},
			};
		}
	}

	/**
	 * Refreshes a Google access token.
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
	 * Publishes a post to Google.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"google">, "account">): Promise<
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
				message: "You cannot publish to Google.",
			},
		};
	}
}

export default Google;
