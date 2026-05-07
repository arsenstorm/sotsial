// Base
import { baseGrant } from "@/base/grant";

// Types
import type {
  ExchangeProps,
  ExchangeResponse,
  GrantProps,
  GrantResponse,
  ValidateProps,
  ValidateResponse,
} from "@/types/connect";
import type { ProviderConfig } from "@/types/providers";
import type { Response } from "@/types/response";

function toAccountArray<T>(accounts?: T | T[]): T[] {
  if (Array.isArray(accounts)) {
    return accounts;
  }
  if (accounts) {
    return [accounts];
  }
  return [];
}

export class Provider<
  Config extends ProviderConfig,
  ProviderAccount extends {
    id: string;
    access_token: string;
  },
> {
  config: Config;
  accounts?: ProviderAccount[];

  constructor({
    config,
    accounts,
  }: Readonly<{
    config: Config;
    accounts?: ProviderAccount | ProviderAccount[];
  }>) {
    this.config = {
      ...config,
      scopes: config.scopes ?? [],
    };

    this.accounts = toAccountArray(accounts);
  }

  /**
   * A local validation function to verify that all scopes received are
   * within the required scopes.
   *
   * @param scopesReceived - The scopes received from the provider
   *
   * @returns Whether the scopes are valid
   */
  local_validate({
    scopes: scopesReceived,
  }: {
    scopes: string[];
  }): Response<{ valid: boolean } | null> {
    const scopes = this.config.scopes ?? [];

    const valid =
      scopes.length === scopesReceived.length &&
      scopes.every((scope) => scopesReceived.includes(scope));

    if (!valid) {
      return {
        data: {
          valid: false,
        },
        error: {
          message: "The scopes received do not match the required scopes",
        },
      };
    }

    return {
      data: {
        valid: true,
      },
      error: null,
    };
  }

  /**
   * Returns a URL that the user can be redirected to in order to grant
   * access to their account.
   *
   * @param base - The base OAuth URL
   * @param scopes - The scopes to request
   *
   * @returns The URL to redirect to
   */
  grant({
    base,
    scopes,
    params = {},
    delimiter = ",",
    noChallenge = false,
  }: Omit<GrantProps, "client_id" | "redirect_uri"> & {
    readonly base: string;
    params?: Record<string, string>;
    readonly delimiter?: string;
    readonly noChallenge?: boolean;
  }): Promise<Response<GrantResponse | null>> {
    if (!this.config.redirectUri) {
      console.warn(this.config);
      return Promise.reject(new Error("Redirect URI is required"));
    }

    return baseGrant({
      base,
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scopes,
      params,
      delimiter,
      noChallenge,
    });
  }

  /**
   * Validates a provider access token against the required scopes.
   *
   * @param access_token - The access token to validate
   * @param scopes - The required scopes
   *
   * @returns The granted scopes and the expiry date of the access token.
   */
  validate({
    access_token,
    scopes: requestedScopes,
  }: Omit<ValidateProps, "client_id" | "client_secret">): Promise<
    Response<ValidateResponse | null>
  > {
    const account = this.accounts?.[0];

    const scopes = requestedScopes?.length
      ? requestedScopes
      : (this.config?.scopes ?? []);
    const token =
      access_token?.trim() ?? account?.access_token?.trim() ?? undefined;

    if (!token) {
      return Promise.reject(new Error("No token provided"));
    }

    return Promise.resolve({
      data: {
        scopes,
        expires: undefined,
      },
      error: null,
    });
  }

  /**
   * Exchanges a provider code for useful tokens.
   *
   * @param _props - The exchange props (unused in the base implementation)
   *
   * @returns The refresh token, long-lived access token, account ID, and expiry date
   */
  exchange(
    _props: Omit<ExchangeProps, "client_id" | "client_secret" | "redirect_uri">
  ): Promise<Response<ExchangeResponse | ExchangeResponse[] | null>> {
    return Promise.resolve({
      data: null,
      error: null,
    });
  }
}

export default Provider;
