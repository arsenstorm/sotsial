export interface MediaOptions {
	url: string;
	type: "image" | "video";
}

export interface PostContent {
	text: string;
	media?: MediaOptions[] | MediaOptions;
}

// Threads has no other options
export interface ThreadsPostContent extends PostContent {}

// Instagram
export interface InstagramPostContent extends PostContent {
	type?: "feed" | "reel" | "story"; // single and carousel are part of feed (default)
}

// TikTok
export interface TikTokPostContent extends PostContent {
	type: "video" | "image";
	media: MediaOptions[];
	options?: {
		safety: {
			privacy: "public" | "friends" | "private";
			allow_comments?: boolean;
			allow_duet?: boolean;
			allow_stitch?: boolean;
		};
		promotion: {
			self_promotion: boolean;
			branded_content?: {
				is_branded_content: boolean;
				brand_partner?: string;
			};
		};
	};
}

// Facebook
export interface FacebookPostContent extends PostContent {}

export type PlatformContent = {
	threads: ThreadsPostContent;
	instagram: InstagramPostContent;
	tiktok: TikTokPostContent;
	facebook: FacebookPostContent;
};

export type Post<P extends keyof PlatformContent = keyof PlatformContent> =
	P extends keyof PlatformContent ? PlatformContent[P] : never;

export type AllPosts = Post<keyof PlatformContent>;
