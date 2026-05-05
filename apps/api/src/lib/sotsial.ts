import Sotsial from "sotsial";
import { env } from "../env";

export interface PlatformAccount {
  access_token: string;
  id: string;
}

export interface PlatformInput {
  accounts?: PlatformAccount[];
  credential?: {
    client_id: string;
    client_secret: string;
  } | null;
  platform: string;
}

const platformCredentialFromEnv = (platform: string) => {
  const upper = platform.toUpperCase() as
    | "THREADS"
    | "INSTAGRAM"
    | "TIKTOK"
    | "FACEBOOK"
    | "GOOGLE"
    | "YOUTUBE"
    | "TWITTER"
    | "LINKEDIN";

  const clientId = env[`${upper}_CLIENT_ID`];
  const clientSecret = env[`${upper}_CLIENT_SECRET`];

  if (!(clientId && clientSecret)) {
    throw new Error(`Missing Sotsial default credentials for ${platform}`);
  }

  return { clientId, clientSecret };
};

const constructRedirectUri = (platform: string) =>
  new URL(`/v1/callback/${platform}`, env.APP_BASE_URL).toString();

export const getSotsial = ({ platforms }: { platforms: PlatformInput[] }) => {
  const config: Record<
    string,
    {
      config: { clientId: string; clientSecret: string; redirectUri: string };
      accounts?: PlatformAccount[];
    }
  > = {};

  for (const platform of platforms) {
    const base = platform.credential
      ? {
          clientId: platform.credential.client_id,
          clientSecret: platform.credential.client_secret,
        }
      : platformCredentialFromEnv(platform.platform);

    config[platform.platform] = {
      config: {
        ...base,
        redirectUri: constructRedirectUri(platform.platform),
      },
      accounts: platform.accounts,
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: Sotsial config is dynamic per platform mix
  return new Sotsial(config as any);
};
