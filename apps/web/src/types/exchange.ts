import type { SupportedPlatforms } from "@/config/platforms";
export interface ExchangeCodeResponseWithAccountId {
	refreshToken: string;
	accountId: string;
	accountIds?: never;
	expiry: Date | null;
	requiresRefresh?: boolean;
	details?: Record<string, unknown>;
}

export interface ExchangeCodeResponseWithAccountIds {
	refreshToken: string;
	accountId?: never;
	accountIds: string[];
	expiry: Date | null;
	requiresRefresh?: boolean;
	details?: Record<string, unknown>;
}

export type ExchangeCodeResponse =
	| ExchangeCodeResponseWithAccountId
	| ExchangeCodeResponseWithAccountIds;

export interface ExchangeOptions {
	code: string;
	app_id: string;
	app_secret: string;
	redirect_uri: string;
	platform: SupportedPlatforms;
	csrfToken?: string | null;
}
