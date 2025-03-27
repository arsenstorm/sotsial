/**
 * Arguments for the `grant` function
 */
export interface GrantProps
	extends Readonly<{
		client_id: string;
		redirect_uri: string;
		scopes: string[];
	}> {}

/**
 * Arguments for the `validate` function
 */
export interface ValidateProps
	extends Readonly<{
		access_token: string;
		scopes: string[];
		client_id: string;
		client_secret: string;
	}> {}

/**
 * Arguments for the `exchange` function
 */
export interface ExchangeProps
	extends Readonly<{
		code: string;
		client_id: string;
		client_secret: string;
		redirect_uri: string;
		csrf_token?: string;
	}> {}

/**
 * Response for the `grant` function
 */
export interface GrantResponse
	extends Readonly<{
		url: string;
		csrf_token?: string;
	}> {}

/**
 * Response for the `validate` function
 */
export interface ValidateResponse
	extends Readonly<{
		/**
		 * The scopes that the access token has been granted.
		 */
		scopes: string[];

		/**
		 * The expiry date of the access token.
		 *
		 * If this is undefined, then we've not been able to determine the expiry date.
		 */
		expires?: Date;
	}> {}

/**
 * Response for the `exchange` function
 */
export interface ExchangeResponse
	extends Readonly<{
		/**
		 * The refresh token for the account.
		 *
		 * @note This is not provided for some providers.
		 * @see {@link https://sotsial.com/docs/refresh-tokens}
		 */
		refresh_token?: string;

		/**
		 * The access token for the account.
		 */
		access_token: string;

		/**
		 * The provider-specific account ID.
		 *
		 * For example, an Instagram app-scoped user ID.
		 */
		account_id: string;

		/**
		 * The expiry date of the access token.
		 */
		expiry: Date;

		/**
		 * The details of the account.
		 *
		 * @note This is not provided for some providers.
		 */
		details?: {
			name: string | null;
			username: string | null;
			avatar_url: string | null;
			pages?: string[];
		} | null;
	}> {}
