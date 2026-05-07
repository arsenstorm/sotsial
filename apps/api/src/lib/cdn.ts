import { env } from "../env";

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (const byte of bytes) {
    out += byte.toString(16).padStart(2, "0");
  }
  return out;
};

/**
 * Rewrite a media URL through the signing CDN proxy. If the CDN base URL or
 * signing key is not configured, the original URL is returned unchanged.
 */
export const createCdnUrl = async (url: string): Promise<string> => {
  let canonical: string;
  try {
    canonical = new URL(url).toString();
  } catch {
    return url;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + DEFAULT_EXPIRY_SECONDS;
  // Must match the verifier: `v1:${expiresAt ?? ''}:${canonical URL}`.
  const payload = `v1:${expiresAt}:${canonical}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(env.INTERNAL_PROXY_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );
  const token = toHex(signature);

  const proxied = new URL("https://proxy.sotsial.com");
  proxied.searchParams.set("url", canonical);
  proxied.searchParams.set("expires", String(expiresAt));
  proxied.searchParams.set("token", token);
  return proxied.toString();
};
