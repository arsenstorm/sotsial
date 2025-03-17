// Providers
import { Threads } from "@/providers/threads";

// Sotsial Types
import type { SotsialConfig } from "@/types/sotsial";

export class Sotsial {
	threads!: Threads;
	providers: Array<keyof SotsialConfig> = [];

	constructor({ threads }: Readonly<SotsialConfig>) {
		if (threads) {
			this.threads = new Threads(threads);
			this.providers.push("threads");
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
