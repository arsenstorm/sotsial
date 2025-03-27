// Providers
import { TikTok } from "@/providers/tiktok";
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";
import { Facebook } from "@/providers/facebook";

// Sotsial Types
import type { SotsialConfig, Provider } from "@/types/sotsial";
import type { ExchangeResponse } from "@/types/connect";
import type { Response } from "@/types/response";

export class Sotsial {
	tiktok!: TikTok;
	threads!: Threads;
	instagram!: Instagram;
	facebook!: Facebook;
	providers: Array<Provider> = [];

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

	private async callProvider<T, P extends Provider>(
		provider: P,
		method: (provider: any) => Promise<T>,
	): Promise<T> {
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

	async grant(provider: Provider) {
		return this.callProvider(provider, (p) => p.grant());
	}

	async exchange(
		provider: "facebook",
		params: Readonly<{ code: string; csrf_token: string }>,
	): Promise<Response<ExchangeResponse[]>>;
	async exchange(
		provider: Exclude<Provider, "facebook">,
		params: Readonly<{ code: string; csrf_token: string }>,
	): Promise<Response<ExchangeResponse>>;
	async exchange(
		provider: Provider,
		{
			code,
			csrf_token,
		}: Readonly<{
			code: string;
			csrf_token: string;
		}>,
	) {
		return this.callProvider<
			Response<ExchangeResponse> | Response<ExchangeResponse[]>,
			Provider
		>(provider, (p) => p.exchange({ code, csrf_token }));
	}

	async publish({
		post,
	}: Readonly<{
		post: any; // TODO: Eventually we need to type this with AllPosts but
		// it needs to work with ALL providers and not just a subset of them.
	}>) {
		const results: Record<Provider, any> = {
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
