// Types
import type { Account } from "@/types/auth";

// Provider Types
import type {
  FacebookConfig,
  GoogleConfig,
  InstagramConfig,
  LinkedInConfig,
  ThreadsConfig,
  TikTokConfig,
  TwitterConfig,
  YouTubeConfig,
} from "@/types/providers";

export interface SotsialConfig {
  facebook?: {
    config: FacebookConfig;
    accounts?: Account | Account[];
  };
  google?: {
    config: GoogleConfig;
    accounts?: Account | Account[];
  };
  instagram?: {
    config: InstagramConfig;
    accounts?: Account | Account[];
  };
  linkedin?: {
    config: LinkedInConfig;
    accounts?: Account | Account[];
  };
  threads?: {
    config: ThreadsConfig;
    accounts?: Account | Account[];
  };
  tiktok?: {
    config: TikTokConfig;
    accounts?: Account | Account[];
  };
  twitter?: {
    config: TwitterConfig;
    accounts?: Account | Account[];
  };
  youtube?: {
    config: YouTubeConfig;
    accounts?: Account | Account[];
  };
}

export const PROVIDERS = [
  "threads",
  "instagram",
  "tiktok",
  "facebook",
  "google",
  "linkedin",
  "twitter",
  "youtube",
] as const;
export type Provider = (typeof PROVIDERS)[number];
