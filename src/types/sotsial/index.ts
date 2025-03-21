// Types
import type { Account } from "@/types/auth";

// Provider Types
import type { ThreadsConfig } from "@/types/providers";
import type { InstagramConfig } from "@/types/providers";

export interface SotsialConfig {
	threads?: {
		config: ThreadsConfig;
		accounts?: Account | Account[];
	};
	instagram?: {
		config: InstagramConfig;
		accounts?: Account | Account[];
	};
}
