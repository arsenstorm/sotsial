// Types
import type { Account } from "@/types/auth";

// Provider Types
import type {
	ThreadsConfig,
	TikTokConfig,
	InstagramConfig,
	FacebookConfig,
	GoogleConfig,
	LinkedInConfig,
	TwitterConfig,
} from "@/types/providers";

export interface SotsialConfig {
	threads?: {
		config: ThreadsConfig;
		accounts?: Account | Account[];
	};
	instagram?: {
		config: InstagramConfig;
		accounts?: Account | Account[];
	};
	tiktok?: {
		config: TikTokConfig;
		accounts?: Account | Account[];
	};
	facebook?: {
		config: FacebookConfig;
		accounts?: Account | Account[];
	};
	google?: {
		config: GoogleConfig;
		accounts?: Account | Account[];
	};
	linkedin?: {
		config: LinkedInConfig;
		accounts?: Account | Account[];
	};
	twitter?: {
		config: TwitterConfig;
		accounts?: Account | Account[];
	};
}

export const PROVIDERS = [
	"threads",
	"instagram",
	"tiktok",
	"facebook",
	"google",
	"linkedin",
	"twitter",
] as const;
export type Provider = (typeof PROVIDERS)[number];
