import "server-only";

// Types
import type { GrantOptions } from "@/types/grant";
import type {
	ValidateOptions,
	ValidateConnectionResponse,
} from "@/types/validate";
import type { ExchangeOptions, ExchangeCodeResponse } from "@/types/exchange";
import type { AccessTokenOptions, AccessTokenResponse } from "@/types/access";

// Platform Details
import { platformDetails } from "@/config/platform-details";

export const platforms = {
	threads: {
		...platformDetails.threads,
		env: {
			app_id: "THREADS_APP_ID",
			app_secret: "THREADS_APP_SECRET",
		},
		scope: ["threads_basic", "threads_content_publish"],
	},
	facebook: {
		...platformDetails.facebook,
		env: {
			app_id: "FACEBOOK_APP_ID",
			app_secret: "FACEBOOK_APP_SECRET",
		},
		scope: [
			"pages_show_list",
			"publish_video",
			"pages_manage_posts",
			"pages_read_engagement", // required to publish to pages
			"business_management", // required so we can get the list of pages the account is connected to
		],
	},
	instagram: {
		...platformDetails.instagram,
		env: {
			app_id: "INSTAGRAM_APP_ID",
			app_secret: "INSTAGRAM_APP_SECRET",
		},
		//csrf: false, // Instagram does not use CSRF tokens
		scope: ["instagram_business_basic", "instagram_business_content_publish"],
	},
	tiktok: {
		...platformDetails.tiktok,
		env: {
			app_id: "TIKTOK_APP_ID",
			app_secret: "TIKTOK_APP_SECRET",
		},
		scope: ["video.publish", "video.upload", "user.info.basic"],
	},
	linkedin: {
		...platformDetails.linkedin,
		env: {
			app_id: "LINKEDIN_APP_ID",
			app_secret: "LINKEDIN_APP_SECRET",
		},
		scope: ["w_member_social", "openid", "profile"],
	},
	twitter: {
		...platformDetails.twitter,
		env: {
			app_id: "TWITTER_APP_ID",
			app_secret: "TWITTER_APP_SECRET",
		},
		scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
	},
} as const;

export const supportedPlatforms = Object.keys(
	platforms,
) as SupportedPlatforms[];

export type SupportedPlatforms = keyof typeof platforms;

export interface Platform {
	supported: boolean;
	env: {
		app_id: string;
		app_secret: string;
	};
	csrf?: boolean;
	grant: (options: GrantOptions) => Promise<string>;
	validate: (options: ValidateOptions) => Promise<ValidateConnectionResponse>;
	exchange?: (options: ExchangeOptions) => Promise<ExchangeCodeResponse>;
	access?: (options: AccessTokenOptions) => Promise<AccessTokenResponse>;
}
