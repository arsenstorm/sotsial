// Types
import type { GetCodeChallengeProps } from "@/types/security";

/**
 * Generates a code challenge for the given code.
 *
 * @param code - The code
 *
 * @returns The code challenge
 */
export async function generateCodeChallenge({ code }: GetCodeChallengeProps) {
	const encoder = new TextEncoder();
	const data = encoder.encode(code);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);

	// Convert the hash to a base64 URL-safe string
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const base64Url = btoa(
		hashArray.map((byte) => String.fromCharCode(byte)).join(""),
	)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");

	return base64Url;
}
