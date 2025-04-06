// Types
import type { Account } from "@/types/auth";

// Provider Types
import type {
	ThreadsConfig,
	TikTokConfig,
	InstagramConfig,
	FacebookConfig,
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
}

export const PROVIDERS = [
	"threads",
	"instagram",
	"tiktok",
	"facebook",
] as const;
export type Provider = (typeof PROVIDERS)[number];
