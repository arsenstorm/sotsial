// Base
import { baseGrant } from "@/base/grant";

// Types
import type {
	ExchangeProps,
	ExchangeResponse,
	GrantProps,
	GrantResponse,
	ValidateProps,
	ValidateResponse,
} from "@/types/connect";
import type { Response } from "@/types/response";
import type { ProviderConfig } from "@/types/providers";

export class Provider<
	Config extends ProviderConfig,
	ProviderAccount extends {
		id: string;
		access_token: string;
	},
> {
	config: Config;
	accounts?: ProviderAccount[];

	constructor({
		config,
		accounts,
	}: Readonly<{
		config: Config;
		accounts?: ProviderAccount | ProviderAccount[];
	}>) {
		this.config = {
			...config,
			scopes: config.scopes ?? [],
		};

		this.accounts = Array.isArray(accounts)
			? accounts
			: accounts
				? [accounts]
				: [];
	}

	/**
	 * A local validation function to verify that all scopes received are
	 * within the required scopes.
	 *
	 * @param scopesReceived - The scopes received from the provider
	 *
	 * @returns Whether the scopes are valid
	 */
	local_validate({
		scopes: scopesReceived,
	}: {
		scopes: string[];
	}): Response<{ valid: boolean } | null> {
		const scopes = this.config.scopes ?? [];

		const valid =
			scopes.length === scopesReceived.length &&
			scopes.every((scope) => scopesReceived.includes(scope));

		if (!valid) {
			return {
				data: {
					valid: false,
				},
				error: {
					message: "The scopes received do not match the required scopes",
				},
			};
		}

		return {
			data: {
				valid: true,
			},
			error: null,
		};
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their account.
	 *
	 * @param base - The base OAuth URL
	 * @param scopes - The scopes to request
	 *
	 * @returns The URL to redirect to
	 */
	async grant({
		base,
		scopes,
		params = {},
		delimiter = ",",
		noChallenge = false,
	}: Omit<GrantProps, "client_id" | "redirect_uri"> & {
		readonly base: string;
		params?: Record<string, string>;
		readonly delimiter?: string;
		readonly noChallenge?: boolean;
	}): Promise<Response<GrantResponse | null>> {
		if (!this.config.redirectUri) {
			throw new Error("Redirect URI is required");
		}

		return baseGrant({
			base,
			client_id: this.config.clientId,
			redirect_uri: this.config.redirectUri,
			scopes,
			params,
			delimiter,
			noChallenge,
		});
	}

	/**
	 * Validates a provider access token against the required scopes.
	 *
	 * @param access_token - The access token to validate
	 * @param scopes - The required scopes
	 *
	 * @returns The granted scopes and the expiry date of the access token.
	 */
	async validate({
		access_token,
		scopes: requestedScopes,
	}: Omit<ValidateProps, "client_id" | "client_secret">): Promise<
		Response<ValidateResponse | null>
	> {
		const account = this.accounts?.[0];

		const scopes = requestedScopes?.length
			? requestedScopes
			: (this.config?.scopes ?? []);
		const token =
			access_token?.trim() ?? account?.access_token?.trim() ?? undefined;

		if (!token) {
			throw new Error("No token provided");
		}

		return {
			data: {
				scopes,
				expires: undefined,
			},
			error: null,
		};
	}

	/**
	 * Exchanges a provider code for useful tokens.
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
	>): Promise<Response<ExchangeResponse | ExchangeResponse[] | null>> {
		return {
			data: null,
			error: null,
		};
	}
}

export default Provider;
