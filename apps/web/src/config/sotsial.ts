// Sotsial
import Sotsial from "sotsial";
import { env } from "sotsial/utils";

// Utils
import { constructRedirectUri } from "@/utils/url";

export interface PlatformConfig {
	platform: string;
	credential?: Readonly<{
		client_id: string;
		client_secret: string;
	}> | null;
	accounts?: Readonly<
		{
			id: string;
			access_token: string;
		}[]
	>;
}

export const getSotsial = ({
	platforms,
}: Readonly<{
	platforms: PlatformConfig[];
}>) => {
	const config: Record<
		string,
		{ config: any; accounts?: PlatformConfig["accounts"] }
	> = {};

	for (const platform of platforms) {
		config[platform.platform] = {
			config: {
				clientId:
					platform.credential?.client_id ??
					env(`${platform.platform.toUpperCase()}_CLIENT_ID`, {
						throw: true,
					}) ??
					"",
				clientSecret:
					platform.credential?.client_secret ??
					env(`${platform.platform.toUpperCase()}_CLIENT_SECRET`, {
						throw: true,
					}) ??
					"",
				redirectUri: constructRedirectUri(platform.platform),
			},
			accounts: platform?.accounts ?? undefined,
		};
	}

	return new Sotsial(config);
};
