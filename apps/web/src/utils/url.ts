/**
 * Constructs a redirect URI for the given platform
 *
 * @param platform - The platform to construct the redirect URI for
 * @returns The redirect URI
 */
export function constructRedirectUri(
	platform: string,
	{
		host = process.env.NEXT_PUBLIC_DOMAIN ?? "local.sotsial.com",
	}: { host?: string } = {},
) {
	return `https://${host}/v1/callback/${platform}`;
}
