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

	async publish(data: any) {
		if (this.threads) {
			await this.threads.publish({
				post: data,
			});
		}
	}
}
