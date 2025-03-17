// Security
import { generate } from "@/utils/tokens";
import { generateCodeChallenge } from "@/utils/code-challenge";

// Types
import type { Response } from "@/types/response";
import type { GrantProps, GrantResponse } from "@/types/connect";

/**
 * Returns a URL that the user can be redirected to in order to grant
 * access to their Threads account.
 *
 * @param client_id - The app ID
 * @param redirect_uri - The redirect URI
 * @param scopes - The scopes
 *
 * @returns The URL to redirect to
 */
export async function baseGrant({
	base,
	client_id,
	redirect_uri,
	scopes,
}: GrantProps & { readonly base: string }): Promise<
	Response<GrantResponse | null>
> {
	const url = new URL(base);

	url.searchParams.set("client_id", client_id);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("redirect_uri", redirect_uri);
	url.searchParams.set("scope", scopes.join(","));

	const { data: tokens, error: generateError } = await generate();

	if (generateError) {
		throw new Error(generateError.message);
	}

	if (!tokens?.plain) {
		throw new Error("CSRF token generation failed.");
	}

	const challenge = await generateCodeChallenge({
		code: tokens.plain,
	});

	url.searchParams.set("state", tokens.plain);
	url.searchParams.set("code_challenge", challenge);
	url.searchParams.set("code_challenge_method", "S256");

	return {
		data: {
			url: url.toString(),
			csrf_token: tokens.plain,
		},
		error: null,
	};
}
