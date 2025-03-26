// Types
import type { Account } from "@/types/auth";

// Provider Types
import type {
	ThreadsConfig,
	TikTokConfig,
	InstagramConfig,
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
}
