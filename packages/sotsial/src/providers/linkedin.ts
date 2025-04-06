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
import type { LinkedInConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";
import jwt from "jsonwebtoken";

export class LinkedIn extends Provider<LinkedInConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: LinkedInConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"openid",
					"profile",
					"email",
					"w_member_social",
				],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their LinkedIn account.
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
			base: "https://www.linkedin.com/oauth/v2/authorization",
			scopes,
			noChallenge: true,
		});
	}

	/**
	 * Validates a LinkedIn access token against the required scopes.
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
	 * Exchanges a LinkedIn code for useful tokens.
	 *
	 * @param code - The code to exchange
	 *
	 * @note it appears that LinkedIn does not support the CSRF token.
	 *
	 * @returns The refresh token, long-lived access token, account ID, and expiry date
	 */
	async exchange({
		code,
	}: Omit<
		ExchangeProps,
		"client_id" | "client_secret" | "redirect_uri"
	>): Promise<Response<ExchangeResponse | null>> {
		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			const tokenResponse = await fetch(
				"https://www.linkedin.com/oauth/v2/accessToken",
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						code,
						grant_type: "authorization_code",
						client_id: this.config.clientId,
						client_secret: this.config.clientSecret,
						redirect_uri: this.config.redirectUri,
					}),
				},
			);

			if (!tokenResponse.ok) {
				const error = await tokenResponse.text();
				throw new Error(`Failed to exchange LinkedIn code: ${error}`);
			}

			const {
				access_token,
				refresh_token,
				expires_in,
				id_token,
				scope,
			} = await tokenResponse.json();

			const { data: scopeValidation } = this.local_validate({
				scopes: scope.split(","),
			});

			if (!scopeValidation?.valid) {
				throw new Error(
					"Invalid scopes - the user has not granted the required scopes.",
				);
			}

			const decoded = jwt.decode(id_token) as unknown as {
				iss: string;
				aud: string;
				iat: number;
				exp: number;
				sub: string;
				name: string;
				given_name: string;
				family_name: string;
				picture: string;
				email: string;
				email_verified: string;
				locale: string;
			};

			let name = null;
			let avatarUrl = null;

			if (decoded) {
				name = decoded.name;
				avatarUrl = decoded.picture;
			}

			return {
				data: {
					access_token,
					refresh_token,
					account_id: decoded.sub,
					expiry: timestamp(expires_in),
					details: {
						name,
						username: null, // LinkedIn doesn't have usernames in the same way as other platforms
						avatar_url: avatarUrl,
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
							: "Failed to exchange LinkedIn code",
				},
			};
		}
	}

	/**
	 * Refreshes a LinkedIn access token.
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
	 * Publishes a post to LinkedIn.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"linkedin">, "account">): Promise<
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
				message: "LinkedIn publishing is not supported",
			},
		};
	}
}

export default LinkedIn;
