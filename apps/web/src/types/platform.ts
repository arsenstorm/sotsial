export interface PlatformCredentials {
	app_id: string;
	app_secret: string;
	// Provider ID is only used for custom providers to identify them
	provider_id?: string;
	// Redirect URI is only used for custom providers to redirect to
	// if it is null, the default redirect (to Sotsial) is used
	redirect_uri?: string | null;
}
