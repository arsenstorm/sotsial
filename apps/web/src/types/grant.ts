import type { SupportedPlatforms } from "@/config/platforms";

export interface GrantOptions {
	app_id: string;
	redirect_uri: string;
	platform: SupportedPlatforms;
	csrfToken: string;
}
