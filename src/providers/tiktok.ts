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
import type { ErrorResponse } from "@/types/error";
import type { PublishProps } from "@/types/publish";
import type { TikTokConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class TikTok extends Provider<TikTokConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: TikTokConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"video.publish",
					"video.upload",
					"user.info.basic",
					"user.info.profile",
				],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their TikTok account.
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
			base: "https://www.tiktok.com/v2/auth/authorize/",
			scopes,
			params: {
				// TikTok uses client_key instead of client_id
				client_key: this.config.clientId,
			},
		});
	}

	/**
	 * Validates a TikTok access token against the required scopes.
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
	 * Exchanges a TikTok code for useful tokens.
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
		if (!csrf_token) {
			throw new Error("CSRF token is required for TikTok authorisation.");
		}

		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			const accessTokenResponse = await fetch(
				"https://open.tiktokapis.com/v2/oauth/token/",
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						client_key: this.config.clientId,
						client_secret: this.config.clientSecret,
						grant_type: "authorization_code",
						redirect_uri: this.config.redirectUri,
						code,
						code_verifier: csrf_token,
					}),
				},
			);

			if (!accessTokenResponse.ok) {
				throw new Error("Failed to exchange TikTok code for access token");
			}

			const data = await accessTokenResponse.json();

			const {
				access_token,
				refresh_token,
				open_id,
				refresh_expires_in,
				scope,
			} = data;

			let profileData = undefined;

			if (scope.split(",").includes("user.info.profile")) {
				const response = await fetch(
					"https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,avatar_url,display_name",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Failed to get TikTok user profile");
				}

				profileData = await response.json();

				console.log(profileData);
			}

			return {
				data: {
					access_token,
					refresh_token,
					account_id: open_id,
					expiry: timestamp(refresh_expires_in),
					details: {
						name: profileData.display_name ?? null,
						username: profileData.username ?? null,
						avatar_url: profileData.avatar_url ?? null,
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
							: "Failed to exchange TikTok code",
				},
			};
		}
	}

	/**
	 * Refreshes a TikTok access token or refresh token.
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
		const url = new URL("https://open.tiktokapis.com/v2/oauth/token/");
		url.searchParams.set("grant_type", "refresh_token");
		url.searchParams.set("refresh_token", token);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_key: this.config.clientId,
				client_secret: this.config.clientSecret,
				grant_type: option,
				refresh_token: token,
			}),
		});

		if (!response.ok) {
			return {
				data: null,
				error: {
					message: "Failed to refresh TikTok access token",
				},
			};
		}

		const data = await response.json();

		return {
			data: {
				token: data.access_token,
				expires_in: data.expires_in,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to TikTok.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"tiktok">, "account">): Promise<
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

		// TODO: Implement this

		return {
			data: null,
			error: {
				message: "TikTok publish not implemented",
			},
		};
	}
}

export default TikTok;
