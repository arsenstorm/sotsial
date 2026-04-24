import type { SupportedPlatforms } from "@/config/platforms";

export interface ValidateConnectionResponse {
  hint: string;
  message: string;
  refresh_token: string;
  success: boolean;
}

export interface ValidateOptions {
  app_id: string;
  app_secret: string;
  platform: SupportedPlatforms;
  refresh_token: string;
}
