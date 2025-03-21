// Providers
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";

// Sotsial Types
import type { SotsialConfig } from "@/types/sotsial";

export class Sotsial {
	threads!: Threads;
	instagram!: Instagram;
	providers: Array<keyof SotsialConfig> = [];

	constructor({ threads, instagram }: Readonly<SotsialConfig>) {
		if (threads) {
			this.threads = new Threads(threads);
			this.providers.push("threads");
		}

		if (instagram) {
			this.instagram = new Instagram(instagram);
			this.providers.push("instagram");
		}
	}

	async publish({
		post,
	}: Readonly<{
		post: any; // TODO: Eventually we need to type this with AllPosts but
		// it needs to work with ALL providers and not just a subset of them.
	}>) {
		const results: Record<keyof SotsialConfig, any> = {
			threads: undefined,
			instagram: undefined,
		};

		if (this.threads) {
			results.threads = await this.threads.publish({
				post,
			});
		}

		if (this.instagram) {
			results.instagram = await this.instagram.publish({
				post,
			});
		}

		return results;
	}
}
