export interface ProviderConfig {
	/**
	 * OAuth Client ID
	 */
	clientId: string;

	/**
	 * OAuth Client Secret
	 */
	clientSecret: string;

	/**
	 * Redirect URI
	 *
	 * Where the user will be redirected after the authentication process (i.e., for code exchange)
	 */
	redirectUri?: string;

	/**
	 * Scopes
	 *
	 * The scopes to request from the provider
	 */
	scopes?: string[];
}

export interface ThreadsConfig extends ProviderConfig {}

export interface InstagramConfig extends ProviderConfig {}

export interface TikTokConfig extends ProviderConfig {}

export interface FacebookConfig extends ProviderConfig {
	/**
	 * The version of the Facebook API to use
	 *
	 * @default "v22.0"
	 *
	 * @note Sotsial has only been tested with v21 and v22.
	 * It may still support other versions, but this is not guaranteed.
	 *
	 * @see {@link https://developers.facebook.com/docs/graph-api/guides/versioning/}
	 */
	version?: "v21.0" | "v22.0";
}
