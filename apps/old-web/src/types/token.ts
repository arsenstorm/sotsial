import type { SupportedPlatforms } from "@/config/platforms";

export interface Token {
  accountId: string;
  expires: Date;
  platform: SupportedPlatforms;
  tags: string[];
}
