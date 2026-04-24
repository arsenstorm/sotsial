import type { SupportedPlatforms } from "@/config/platforms";

export interface GrantOptions {
  app_id: string;
  csrfToken: string;
  platform: SupportedPlatforms;
  redirect_uri: string;
}
