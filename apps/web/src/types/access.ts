import type { SupportedPlatforms } from "@/config/platforms";

export interface AccessTokenResponse {
	access_token: string;
	expires_in?: number;
	scope?: string[];
	refresh_token?: string;
}

export interface AccessTokenOptions {
	refresh_token: string;
	accountId: string;
	platform: SupportedPlatforms;
	connection_id?: string;
}
