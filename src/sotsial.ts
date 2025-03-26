// Providers
import { TikTok } from "@/providers/tiktok";
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";

// Sotsial Types
import type { SotsialConfig } from "@/types/sotsial";

export class Sotsial {
	tiktok!: TikTok;
	threads!: Threads;
	instagram!: Instagram;
	providers: Array<keyof SotsialConfig> = [];

	constructor({ threads, instagram, tiktok }: Readonly<SotsialConfig>) {
		if (threads) {
			this.threads = new Threads(threads);
			this.providers.push("threads");
		}

		if (instagram) {
			this.instagram = new Instagram(instagram);
			this.providers.push("instagram");
		}

		if (tiktok) {
			this.tiktok = new TikTok(tiktok);
			this.providers.push("tiktok");
		}
	}

	private async callProvider<T>(
		provider: keyof SotsialConfig,
		method: (provider: any) => Promise<T>,
	) {
		switch (provider) {
			case "threads":
				if (!this.threads) {
					throw new Error("Threads provider not initialised");
				}
				return method(this.threads);
			case "instagram":
				if (!this.instagram) {
					throw new Error("Instagram provider not initialised");
				}
				return method(this.instagram);
			case "tiktok":
				if (!this.tiktok) {
					throw new Error("TikTok provider not initialised");
				}
				return method(this.tiktok);
			default:
				throw new Error(`Provider ${provider} not found`);
		}
	}

	async grant(provider: keyof SotsialConfig) {
		return this.callProvider(provider, (p) => p.grant());
	}

	async exchange(
		provider: keyof SotsialConfig,
		{
			code,
			csrf_token,
		}: Readonly<{
			code: string;
			csrf_token: string;
		}>,
	) {
		return this.callProvider(provider, (p) => p.exchange({ code, csrf_token }));
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
			tiktok: undefined,
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

		if (this.tiktok) {
			results.tiktok = await this.tiktok.publish({
				post,
			});
		}

		return results;
	}
}
