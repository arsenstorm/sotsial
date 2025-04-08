export interface BasicMediaOptions {
	url?: string;
	file?: File;
	type: "image" | "video";
}

export interface FileMediaOptions extends BasicMediaOptions {
	url?: never;
	/**
	 * The file of the media to be added to the post.
	 */
	file: File;
}

export interface UrlMediaOptions extends BasicMediaOptions {
	/**
	 * The URL of the media to be added to the post.
	 */
	url: string;
	file?: never;
}

export type MediaOptions = (FileMediaOptions | UrlMediaOptions) & {
	/**
	 * The type of media to be added to the post.
	 */
	type: "image" | "video";
};

/**
 * LinkedIn supports both URL and File media options
 */
export type LinkedInMediaOptions = MediaOptions;

/**
 * All platforms except LinkedIn only support URL media options
 */
export type StandardMediaOptions = UrlMediaOptions & {
	type: "image" | "video";
};

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
export interface ThreadsPostContent extends PostContent {
	/**
	 * The media to be added to the post.
	 */
	media?: StandardMediaOptions[] | StandardMediaOptions;
}

// Instagram
export interface InstagramPostContent extends PostContent {
	/**
	 * The media to be added to the post.
	 */
	media?: StandardMediaOptions[] | StandardMediaOptions;

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
	media: StandardMediaOptions[];

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
	 * The media to be added to the post.
	 */
	media?: StandardMediaOptions[] | StandardMediaOptions;

	/**
	 * The type of Facebook post to be published.
	 *
	 * @note - If not specified, the type will be automatically determined.
	 */
	fb_type?: "feed" | "reel";

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

		/**
		 * Video-specific options.
		 */
		video?: {
			/**
			 * Title for the video.
			 */
			title?: string;

			/**
			 * Description for the video.
			 */
			description?: string;
		};

		/**
		 * Reel-specific options.
		 */
		reel?: {
			/**
			 * Whether to tag a location in the reel.
			 */
			place_id?: string;

			/**
			 * Collaborators to invite for the reel.
			 */
			collaborators?: string[];
		};
	};
}

// LinkedIn
export interface LinkedInPostContent extends PostContent {
	/**
	 * The text of the post.
	 *
	 * @required - LinkedIn requires text for the post
	 */
	text: string;

	/**
	 * The media to be added to the post.
	 */
	media?: LinkedInMediaOptions[] | LinkedInMediaOptions;
}

// Twitter
// TODO: Implement this
export interface TwitterPostContent extends PostContent {
	/**
	 * The text of the post.
	 */
	text: string;

	/**
	 * The media to be added to the post.
	 */
	media?: StandardMediaOptions[] | StandardMediaOptions;
}

// Google
// TODO: Implement this
export interface GooglePostContent extends PostContent {
	/**
	 * The text of the post.
	 */
	text: string;

	/**
	 * The media to be added to the post.
	 */
	media?: StandardMediaOptions[] | StandardMediaOptions;
}

export type PlatformContent = {
	threads: ThreadsPostContent;
	instagram: InstagramPostContent;
	tiktok: TikTokPostContent;
	facebook: FacebookPostContent;
	linkedin: LinkedInPostContent;
	twitter: TwitterPostContent;
	google: GooglePostContent;
};

export type Post<P extends keyof PlatformContent = keyof PlatformContent> =
	P extends keyof PlatformContent ? PlatformContent[P] : never;

export type AllPosts = Post<keyof PlatformContent>;
