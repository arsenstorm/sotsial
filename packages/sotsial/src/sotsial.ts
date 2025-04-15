// Providers
import { TikTok } from "@/providers/tiktok";
import { Threads } from "@/providers/threads";
import { Instagram } from "@/providers/instagram";
import { Facebook } from "@/providers/facebook";
import { Google } from "@/providers/google";
import { LinkedIn } from "@/providers/linkedin";
import { Twitter } from "@/providers/twitter";
import { YouTube } from "@/providers/youtube";

// Sotsial Types
import type { SotsialConfig, Provider } from "@/types/sotsial";
import type { ExchangeResponse } from "@/types/connect";
import type { Response } from "@/types/response";
import type {
	MediaOptions,
	PlatformContent,
	PostContent,
} from "@/types/publish/posts";

// Provider-specific additional options type
export type ProviderOptions = {
	[P in Provider]?: Partial<
		Omit<PlatformContent[P & keyof PlatformContent], keyof PostContent>
	>;
};

// Type for unified post content structure
export type UnifiedPostContent = {
	// Common content for all providers
	content: PostContent;
	// Which providers to publish to (default: all enabled providers)
	providers?: Provider[];
	// Provider-specific additional options
	options?: ProviderOptions;
};

export class Sotsial {
	tiktok!: TikTok;
	threads!: Threads;
	instagram!: Instagram;
	facebook!: Facebook;
	google!: Google;
	linkedin!: LinkedIn;
	twitter!: Twitter;
	youtube!: YouTube;
	providers: Array<Provider> = [];

	constructor({
		threads,
		instagram,
		tiktok,
		facebook,
		google,
		linkedin,
		twitter,
		youtube,
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

		if (youtube) {
			this.youtube = new YouTube(youtube);
			this.providers.push("youtube");
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
			case "youtube":
				if (!this.youtube) {
					throw new Error("YouTube provider not initialised");
				}
				return method(this.youtube);
			default:
				throw new Error(`Provider ${provider} not found`);
		}
	}

	/**
	 * Create an authorisation URL for a provider.
	 *
	 * @param provider - The provider to create an authorisation URL for.
	 * @returns The authorisation URL for the provider.
	 */
	async grant<T extends Provider>(provider: T) {
		return this.callProvider(provider, (p) => p.grant());
	}

	/**
	 * Exchange a code for an access token.
	 *
	 * @param provider - The provider to exchange the code for an access token.
	 * @param code - The code to exchange for an access token.
	 * @param csrf_token - The CSRF token to exchange for an access token.
	 * @returns The results of the exchange operation.
	 */
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

	/**
	 * Publish a post to all enabled providers.
	 *
	 * @param post - The post to publish.
	 * @returns The results of the publish operation for each provider.
	 */
	async publish({
		post,
	}: Readonly<{
		post: {
			text?: string;
			media?: MediaOptions[];
		} & {
			[P in Provider]?: Partial<PlatformContent[P]>;
		};
	}>) {
		const results: Record<Provider, any> = {
			threads: undefined,
			instagram: undefined,
			tiktok: undefined,
			facebook: undefined,
			google: undefined,
			linkedin: undefined,
			twitter: undefined,
			youtube: undefined,
		};

		for (const provider of this.providers) {
			const providerContent = {
				text: post?.text,
				media: post?.media,
				// Add provider-specific options
				...(post?.[provider] ?? {}),
			};

			results[provider] = await this[provider].publish({
				post: providerContent as unknown as any,
			});
		}

		return results;
	}
}
