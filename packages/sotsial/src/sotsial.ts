// Providers
import { TikTok } from "@/providers/tiktok";
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";
import { Facebook } from "@/providers/facebook";
import { Google } from "@/providers/google";
import { LinkedIn } from "@/providers/linkedin";
import { Twitter } from "@/providers/twitter";

// Sotsial Types
import type { SotsialConfig, Provider } from "@/types/sotsial";
import type { ExchangeResponse } from "@/types/connect";
import type { Response } from "@/types/response";

export class Sotsial {
	tiktok!: TikTok;
	threads!: Threads;
	instagram!: Instagram;
	facebook!: Facebook;
	google!: Google;
	linkedin!: LinkedIn;
	twitter!: Twitter;
	providers: Array<Provider> = [];

	constructor({
		threads,
		instagram,
		tiktok,
		facebook,
		google,
		linkedin,
		twitter,
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

		if (google) {
			this.google = new Google(google);
			this.providers.push("google");
		}

		if (linkedin) {
			this.linkedin = new LinkedIn(linkedin);
			this.providers.push("linkedin");
		}

		if (twitter) {
			this.twitter = new Twitter(twitter);
			this.providers.push("twitter");
		}
	}

	private async callProvider<T>(
		provider: Provider,
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
			case "google":
				if (!this.google) {
					throw new Error("Google provider not initialised");
				}
				return method(this.google);
			case "linkedin":
				if (!this.linkedin) {
					throw new Error("LinkedIn provider not initialised");
				}
				return method(this.linkedin);
			case "twitter":
				if (!this.twitter) {
					throw new Error("Twitter provider not initialised");
				}
				return method(this.twitter);
			default:
				throw new Error(`Provider ${provider} not found`);
		}
	}

	async grant<T extends Provider>(provider: T) {
		return this.callProvider(provider, (p) => p.grant());
	}

	async exchange<T extends Provider>(
		provider: T,
		{
			code,
			csrf_token,
		}: Readonly<{
			code: string;
			csrf_token: string;
		}>,
	) {
		return this.callProvider(provider, (p) =>
			p.exchange({ code, csrf_token }),
		) as Promise<
			Response<T extends "facebook" ? ExchangeResponse[] : ExchangeResponse>
		>;
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
			google: undefined,
			linkedin: undefined,
			twitter: undefined,
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

		if (this.google) {
			results.google = await this.google.publish({
				post,
			});
		}

		if (this.linkedin) {
			results.linkedin = await this.linkedin.publish({
				post,
			});
		}

		if (this.twitter) {
			results.twitter = await this.twitter.publish({
				post,
			});
		}

		return results;
	}
}
