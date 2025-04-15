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

/**
 * Threads configuration
 */
export interface ThreadsConfig extends ProviderConfig {}

/**
 * Instagram configuration
 */
export interface InstagramConfig extends ProviderConfig {}

/**
 * TikTok configuration
 */
export interface TikTokConfig extends ProviderConfig {}

/**
 * Facebook configuration
 */
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

/**
 * Facebook Page
 */
export interface FacebookPage {
	data: {
		id: string;
		page_token: string;
		name: string;
		picture: {
			data: {
				height: number;
				is_silhouette: boolean;
				url: string;
				width: number;
			};
		};
		access_token: string;
	}[];
}

/**
 * LinkedIn configuration
 */
export interface LinkedInConfig extends ProviderConfig {}

/**
 * Twitter configuration
 */
export interface TwitterConfig extends ProviderConfig {}

/**
 * Google configuration
 */
export interface GoogleConfig extends ProviderConfig {}

/**
 * YouTube configuration
 *
 * @extends GoogleConfig
 */
export interface YouTubeConfig extends GoogleConfig {}
