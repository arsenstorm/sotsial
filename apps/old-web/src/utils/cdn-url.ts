import "server-only";

const CDN_BASE_URL = "https://proxy.sotsial.com/";
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

export async function createCdnUrl(
  url: string,
  options: { expiresInSeconds?: number } = {}
): Promise<string> {
  const secret = process.env.SOTSIAL_PROXY_KEY;

  if (!secret) {
    console.warn("Not proxying the url because SOTSIAL_PROXY_KEY is not set.");
    return url;
  }

  let canonical: string;
  try {
    canonical = new URL(url).toString();
  } catch {
    return url;
  }

  const expiresAt =
    Math.floor(Date.now() / 1000) +
    (options.expiresInSeconds ?? DEFAULT_EXPIRY_SECONDS);
  // Must match the verifier: `v1:${expiresAt ?? ''}:${canonical URL}`.
  const payload = `v1:${expiresAt}:${canonical}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
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

  const proxied = new URL(CDN_BASE_URL);
  proxied.searchParams.set("url", canonical);
  proxied.searchParams.set("expires", String(expiresAt));
  proxied.searchParams.set("token", token);
  return proxied.toString();
}
