import type { SupportedPlatforms } from "@/config/platforms";

export interface PostOptions {
  access_token: string;
  content: PostContent;
  platform: SupportedPlatforms;
  platform_account_id: string;
}

export interface PostResponse {
  error?: string;
  id?: string;
  ids?: string[];
  success: boolean;
}

export interface MediaOptions {
  type: "image" | "video";
  url: string;
}

/**
 * Threads-specific content types
 */
export interface ThreadsPostContent {
  media?: MediaOptions[];
  text: string;
}

/**
 * Facebook-specific content types
 */
export interface FacebookPostContent {
  link?: string;
  media?: MediaOptions[];
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
  // Publishing options
  page_ids?: string[]; // array of page ids to publish to (DANGER: defaults to none)
  text: string;
}

/**
 * Instagram-specific content types
 */
export interface InstagramPostContent {
  media: MediaOptions[]; // Instagram requires at least one media but not text
  text?: string;
  type?: "reel" | "story"; // single and carousel are implied.
}

/**
 * TikTok-specific content types
 */
export interface TikTokPostContent {
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
  text?: string;
  type: "video" | "image";
}

interface TikTokSelfPromotionOff {
  is_branded_content?: never;
  is_your_brand_content?: never;
  self_promotion: false;
}

interface TikTokSelfPromotionOn {
  is_branded_content: boolean;
  is_your_brand_content: boolean;
  self_promotion: true;
}

export type TikTokSelfPromotion =
  | TikTokSelfPromotionOff
  | TikTokSelfPromotionOn;

/**
 * LinkedIn-specific content types
 */
export interface LinkedInPostContent {
  link?: string;
  media?: LinkedInMediaOptions[];
  options?: {
    privacy?: "public" | "connections"; // default is public
  };
  text: string;
}

export interface LinkedInMediaOptions {
  description?: string;
  title?: string;
  type: "image" | "video";
  url: string;
}

/**
 * Twitter-specific content types
 */
export interface TwitterPostContent {
  media?: MediaOptions[]; // required if text is not provided
  options?: {
    super_followers_only?: boolean; // defaults to false
    who_can_reply?: "everyone" | "followers" | "mentioned"; // defaults to everyone
  };
  poll?: {
    options: string[];
    duration: number; // in minutes (defaults to 24 hours)
  };
  text?: string; // required if media is not provided
}

/**
 * Union type for platform-specific content
 */
export type PostContent =
  | ({ platform: "tiktok" } & TikTokPostContent)
  | ({ platform: "threads" } & ThreadsPostContent)
  | ({ platform: "instagram" } & InstagramPostContent)
  | ({ platform: "facebook" } & FacebookPostContent);
