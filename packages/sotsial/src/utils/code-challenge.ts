// Types
import type { GetCodeChallengeProps } from "@/types/security";

const PLUS_REGEX = /\+/g;
const SLASH_REGEX = /\//g;
const TRAILING_EQUALS_REGEX = /=+$/;

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
    hashArray.map((byte) => String.fromCharCode(byte)).join("")
  )
    .replace(PLUS_REGEX, "-")
    .replace(SLASH_REGEX, "_")
    .replace(TRAILING_EQUALS_REGEX, "");

  return base64Url;
}
