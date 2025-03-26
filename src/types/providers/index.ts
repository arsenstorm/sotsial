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
