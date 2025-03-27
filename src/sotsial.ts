// Providers
import { TikTok } from "@/providers/tiktok";
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";
import { Facebook } from "@/providers/facebook";

// Sotsial Types
import type { SotsialConfig } from "@/types/sotsial";
import type { ExchangeResponse } from "@/types/connect";
import type { Response } from "@/types/response";

export class Sotsial {
	tiktok!: TikTok;
	threads!: Threads;
	instagram!: Instagram;
	facebook!: Facebook;
	providers: Array<keyof SotsialConfig> = [];

	constructor({
		threads,
		instagram,
		tiktok,
		facebook,
	}: Readonly<SotsialConfig>) {
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

		if (facebook) {
			this.facebook = new Facebook(facebook);
			this.providers.push("facebook");
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
			case "facebook":
				if (!this.facebook) {
					throw new Error("Facebook provider not initialised");
				}
				return method(this.facebook);
			default:
				throw new Error(`Provider ${provider} not found`);
		}
	}

	async grant(provider: keyof SotsialConfig) {
		return this.callProvider(provider, (p) => p.grant());
	}

	async exchange(
		provider: "facebook",
		params: Readonly<{ code: string; csrf_token: string }>,
	): Promise<Response<ExchangeResponse[]>>;
	async exchange(
		provider: Exclude<keyof SotsialConfig, "facebook">,
		params: Readonly<{ code: string; csrf_token: string }>,
	): Promise<Response<ExchangeResponse>>;
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
			facebook: undefined,
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

		if (this.facebook) {
			results.facebook = await this.facebook.publish({
				post,
			});
		}

		return results;
	}
}
