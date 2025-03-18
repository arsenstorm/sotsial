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

export interface ThreadsConfig {
	/**
	 * OAuth Client ID for Threads API
	 */
	clientId: string;

	/**
	 * OAuth Client Secret for Threads API
	 */
	clientSecret: string;

	/**
	 * Redirect URI for OAuth flow
	 * Where the user will be redirected after the authentication process
	 */
	redirectUri?: string;

	/**
	 * OAuth scopes to request from Threads
	 * Default: ["threads_basic", "threads_content_publish"]
	 */
	scopes?: string[];
}
