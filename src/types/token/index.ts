/**
 * Arguments for the `token.refresh` function
 */
export interface RefreshAccessTokenProps
	extends Readonly<{
		token: string;
		client_id: string;
		client_secret: string;
		option?: "access_token" | "refresh_token";
	}> {}

/**
 * Response for the `token.refresh` function
 */
export interface RefreshAccessTokenResponse
	extends Readonly<{
		token: string;
		expires_in: number;
	}> {}
