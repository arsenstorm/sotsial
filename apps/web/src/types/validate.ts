import type { SupportedPlatforms } from "@/config/platforms";

export interface ValidateConnectionResponse {
	success: boolean;
	message: string;
	hint: string;
	refresh_token: string;
}

export interface ValidateOptions {
	app_id: string;
	app_secret: string;
	refresh_token: string;
	platform: SupportedPlatforms;
}
