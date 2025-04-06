// Sotsial
import Sotsial from "sotsial";
import { env } from "sotsial/utils";

// Utils
import { constructRedirectUri } from "@/utils/url";

export const getSotsial = ({
	platform,
	credential,
}: {
	platform: string;
	credential?: Readonly<{
		client_id: string;
		client_secret: string;
	}> | null;
}) => {
	return new Sotsial({
		[platform]: {
			config: {
				clientId:
					credential?.client_id ??
					env(`${platform.toUpperCase()}_CLIENT_ID`, { throw: true }) ??
					"",
				clientSecret:
					credential?.client_secret ??
					env(`${platform.toUpperCase()}_CLIENT_SECRET`, { throw: true }) ??
					"",
				redirectUri: constructRedirectUri(platform),
			},
		},
	});
};
