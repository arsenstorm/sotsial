import type { SupportedPlatforms } from "@/config/platforms";
export interface ExchangeCodeResponseWithAccountId {
  accountId: string;
  accountIds?: never;
  details?: Record<string, unknown>;
  expiry: Date | null;
  refreshToken: string;
  requiresRefresh?: boolean;
}

export interface ExchangeCodeResponseWithAccountIds {
  accountId?: never;
  accountIds: string[];
  details?: Record<string, unknown>;
  expiry: Date | null;
  refreshToken: string;
  requiresRefresh?: boolean;
}

export type ExchangeCodeResponse =
  | ExchangeCodeResponseWithAccountId
  | ExchangeCodeResponseWithAccountIds;

export interface ExchangeOptions {
  app_id: string;
  app_secret: string;
  code: string;
  csrfToken?: string | null;
  platform: SupportedPlatforms;
  redirect_uri: string;
}
