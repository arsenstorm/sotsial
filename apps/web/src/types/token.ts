import type { SupportedPlatforms } from "@/config/platforms";

export interface Token {
	accountId: string;
	platform: SupportedPlatforms;
	expires: Date;
	tags: string[];
}
