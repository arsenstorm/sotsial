export interface MediaOptions {
	/**
	 * The URL of the media to be added to the post.
	 */
	url: string;

	/**
	 * The type of media to be added to the post.
	 */
	type: "image" | "video";
}

export interface PostContent {
	/**
	 * The text of the post.
	 */
	text: string;

	/**
	 * The media to be added to the post.
	 */
	media?: MediaOptions[] | MediaOptions;

	/**
	 * The privacy of the post.
	 */
	privacy?: string;
}

// Threads
export interface ThreadsPostContent extends PostContent {}

// Instagram
export interface InstagramPostContent extends PostContent {
	/**
	 * The type of Instagram post to be published.
	 */
	ig_type?: "feed" | "reel" | "story"; // single and carousel are part of feed (default)
}

// TikTok
export interface TikTokPostContent extends PostContent {
	/**
	 * The type of TikTok post to be published.
	 */
	tk_type: "video" | "image";

	/**
	 * The media to be added to the post.
	 *
	 * @required - TikTok requires at least one media item
	 */
	media: MediaOptions[];

	/**
	 * The privacy of the post.
	 *
	 * @required - You must always set this for TikTok
	 */
	privacy: "public" | "mutual" | "private";

	/**
	 * Options for the post.
	 *
	 * @required - This is required as you need to set the promotion settings
	 */
	options: {
		/**
		 * Additional safety settings for the post.
		 */
		safety?: {
			/**
			 * Whether comments are allowed on the post.
			 */
			allow_comments?: boolean;

			/**
			 * Whether duets are allowed on the post.
			 */
			allow_duet?: boolean;

			/**
			 * Whether stitches are allowed on the post.
			 */
			allow_stitch?: boolean;
		};

		/**
		 * Promotional settings for the post.
		 *
		 * @required - TikTok requires you to set promotion settings
		 */
		promotion: TikTokPromotion;
	};
}

interface TikTokPromotionOff {
	self_promotion: false;
	is_your_brand_content?: never;
	is_branded_content?: never;
}

interface TikTokPromotionOn {
	/**
	 * Is this post promotional?
	 */
	self_promotion: true;

	/**
	 * Is this post *your* brand content?
	 */
	is_your_brand_content: boolean;

	/**
	 * Is this post branded content?
	 */
	is_branded_content: boolean;
}

export type TikTokPromotion = TikTokPromotionOff | TikTokPromotionOn;

// Facebook
export interface FacebookPostContent extends PostContent {
	/**
	 * The text of the post.
	 */
	text: string;

	/**
	 * An optional link to be added to the post.
	 */
	link?: string;

	/**
	 * The privacy of the post.
	 *
	 * @note - Facebook only allows public posts for pages
	 */
	privacy?: "public";

	/**
	 * Additional options for the post.
	 */
	options?: {
		/**
		 * An optional date and time to schedule the post to be published at.
		 *
		 * If this is not set, the post will be published immediately.
		 */
		publish_at?: Date;
	};
}

export type PlatformContent = {
	threads: ThreadsPostContent;
	instagram: InstagramPostContent;
	tiktok: TikTokPostContent;
	facebook: FacebookPostContent;
};

export type Post<P extends keyof PlatformContent = keyof PlatformContent> =
	P extends keyof PlatformContent ? PlatformContent[P] : never;

export type AllPosts = Post<keyof PlatformContent>;
