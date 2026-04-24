import type { SupportedPlatforms } from "@/config/platforms";

export interface AccessTokenResponse {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string[];
}

export interface AccessTokenOptions {
  accountId: string;
  connection_id?: string;
  platform: SupportedPlatforms;
  refresh_token: string;
}
