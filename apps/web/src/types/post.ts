import type { SupportedPlatforms } from "@/config/platforms";

export interface PostOptions {
	access_token: string;
	platform_account_id: string;
	platform: SupportedPlatforms;
	content: PostContent;
}

export interface PostResponse {
	success: boolean;
	id?: string;
	ids?: string[];
	error?: string;
}

export interface MediaOptions {
	url: string;
	type: "image" | "video";
}

/**
 * Threads-specific content types
 */
export interface ThreadsPostContent {
	text: string;
	media?: MediaOptions[];
}

/**
 * Facebook-specific content types
 */
export interface FacebookPostContent {
	text: string;
	link?: string;
	media?: MediaOptions[];
	// Publishing options
	page_ids?: string[]; // array of page ids to publish to (DANGER: defaults to none)
	// specific options override general options
	options?: {
		publishing: {
			publish_to_all_pages?: boolean; // defaults to false
			published?: boolean; // default is true (publish immediately) unless publish_at is provided
			publish_at?: number; // Unix timestamp
		};
		safety: {
			privacy?: "private" | "mutual" | "public";
		};
	};
}

/**
 * Instagram-specific content types
 */
export interface InstagramPostContent {
	type?: "reel" | "story"; // single and carousel are implied.
	text?: string;
	media: MediaOptions[]; // Instagram requires at least one media but not text
}

/**
 * TikTok-specific content types
 */
export interface TikTokPostContent {
	type: "video" | "image";
	text?: string;
	media: MediaOptions[];
	options?: {
		safety: {
			privacy: "public" | "friends" | "private";
			allow_comments?: boolean;
			allow_duet?: boolean;
			allow_stitch?: boolean;
		};
		promotion: TikTokSelfPromotion;
	};
}

interface TikTokSelfPromotionOff {
	self_promotion: false;
	is_your_brand_content?: never;
	is_branded_content?: never;
}

interface TikTokSelfPromotionOn {
	self_promotion: true;
	is_your_brand_content: boolean;
	is_branded_content: boolean;
}

export type TikTokSelfPromotion =
	| TikTokSelfPromotionOff
	| TikTokSelfPromotionOn;

/**
 * LinkedIn-specific content types
 */
export interface LinkedInPostContent {
	text: string;
	link?: string;
	media?: LinkedInMediaOptions[];
	options?: {
		privacy?: "public" | "connections"; // default is public
	};
}

export interface LinkedInMediaOptions {
	title?: string;
	description?: string;
	type: "image" | "video";
	url: string;
}

/**
 * Twitter-specific content types
 */
export interface TwitterPostContent {
	text?: string; // required if media is not provided
	media?: MediaOptions[]; // required if text is not provided
	options?: {
		super_followers_only?: boolean; // defaults to false
		who_can_reply?: "everyone" | "followers" | "mentioned"; // defaults to everyone
	};
	poll?: {
		options: string[];
		duration: number; // in minutes (defaults to 24 hours)
	};
}

/**
 * Union type for platform-specific content
 */
export type PostContent =
	| ({ platform: "tiktok" } & TikTokPostContent)
	| ({ platform: "threads" } & ThreadsPostContent)
	| ({ platform: "instagram" } & InstagramPostContent)
	| ({ platform: "facebook" } & FacebookPostContent);
