import { createWorkersLogger, initWorkersLogger } from "evlog/workers";
import { Hono } from "hono";

initWorkersLogger({
  env: { service: "sotsial-proxy" },
});

const MAX_URL_LENGTH = 2048;
const CACHE_TTL_SECONDS = 3600;
// Bump when the shape of cached responses changes (header set, canonicalization
// rules, etc.) to force existing entries to be treated as misses. Deliberately
// independent from PAYLOAD_VERSION: one guards token validity, the other guards
// response shape. Don't merge them into a single constant.
const CACHE_NAMESPACE = "v1";

const FORWARDED_RESPONSE_HEADERS = new Set([
  "content-type",
  "content-length",
  "content-encoding",
  "content-disposition",
  "accept-ranges",
  "content-range",
  "last-modified",
  "etag",
]);

const PRIVATE_HOSTNAMES = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
]);

// Signing payload format is `v1:${expiresAt}:${canonicalUrl}`, with an empty
// `expiresAt` when no expiry is supplied (i.e. `v1::${canonicalUrl}`). The
// version prefix lets us change the payload shape later without silently
// accepting old tokens. Deliberately independent from CACHE_NAMESPACE.
const PAYLOAD_VERSION = "v1";

const encoder = new TextEncoder();

const IPV6_UNIQUE_LOCAL_FC = /^fc[0-9a-f]{2}:/;
const IPV6_UNIQUE_LOCAL_FD = /^fd[0-9a-f]{2}:/;
const IPV6_LINK_LOCAL = /^fe[89ab][0-9a-f]:/;
// Matches an embedded IPv4 tail on IPv4-mapped (::ffff:a.b.c.d) and
// IPv4-compatible (::a.b.c.d) IPv6 forms, plus NAT64 (64:ff9b::a.b.c.d).
// The leading `:` prevents matching against random hostnames that happen to
// end with something that looks like an IPv4 address — only runs after the
// URL parser has produced a hostname, but still worth being explicit.
const IPV6_EMBEDDED_IPV4 = /:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;

const hexToBytes = (hex: string): Uint8Array | null => {
  if (hex.length === 0 || hex.length % 2 !== 0) {
    return null;
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    const byte = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) {
      return null;
    }
    out[i] = byte;
  }
  return out;
};

const importHmacKey = (secret: string) =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

const isPrivateIPv4 = (host: string): boolean => {
  // Load-bearing: the 4-part check rejects shorthand IPv4 forms like
  // `https://2130706433/` (decimal 127.0.0.1) and `https://0x7f000001/` before
  // they reach the per-octet private-range checks. Don't "simplify" this.
  const parts = host.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const octets = parts.map((p) => Number.parseInt(p, 10));
  if (octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return false;
  }
  const [a, b] = octets as [number, number, number, number];
  if (a === 10 || a === 127) {
    return true;
  }
  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }
  if (a === 192 && b === 168) {
    return true;
  }
  if (a === 169 && b === 254) {
    return true;
  }
  if (a === 0) {
    return true;
  }
  return false;
};

const isPrivateIPv6 = (host: string): boolean => {
  // Literal IPv6 URL hostnames come wrapped in brackets; URL parser strips them.
  const normalized = host.toLowerCase();
  if (normalized === "::1" || normalized === "::") {
    return true;
  }
  // Unique local fc00::/7 and link-local fe80::/10.
  if (
    IPV6_UNIQUE_LOCAL_FC.test(normalized) ||
    IPV6_UNIQUE_LOCAL_FD.test(normalized)
  ) {
    return true;
  }
  if (IPV6_LINK_LOCAL.test(normalized)) {
    return true;
  }
  // IPv4-mapped (::ffff:a.b.c.d), IPv4-compatible (::a.b.c.d), and NAT64
  // (64:ff9b::a.b.c.d) all embed an IPv4 tail. If that tail points into a
  // private range, treat the whole address as private.
  const embedded = normalized.match(IPV6_EMBEDDED_IPV4);
  if (embedded && isPrivateIPv4(embedded[1] as string)) {
    return true;
  }
  return false;
};

const parseSafeTargetUrl = (raw: string): URL | null => {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") {
    return null;
  }

  // URL userinfo would get forwarded to the origin as Basic auth credentials
  // by `fetch`. Not our job to pass those along.
  if (parsed.username !== "" || parsed.password !== "") {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (host.length === 0 || PRIVATE_HOSTNAMES.has(host)) {
    return null;
  }
  if (host.endsWith(".localhost") || host.endsWith(".internal")) {
    return null;
  }
  if (isPrivateIPv4(host) || isPrivateIPv6(host)) {
    return null;
  }

  return parsed;
};

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

const MAXAGE_ZERO = /(?:^|[,\s])s?-?maxage\s*=\s*0(?:\s|,|$)/;

const isUncacheable = (upstream: Headers): boolean => {
  const cc = upstream.get("cache-control")?.toLowerCase() ?? "";
  if (
    cc.includes("no-store") ||
    cc.includes("private") ||
    cc.includes("no-cache")
  ) {
    return true;
  }
  return MAXAGE_ZERO.test(cc);
};

const buildResponseHeaders = (
  upstream: Headers,
  { cacheable }: { cacheable: boolean }
): Headers => {
  const headers = new Headers();
  for (const [key, value] of upstream) {
    if (FORWARDED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set(
    "Cache-Control",
    cacheable ? `public, max-age=${CACHE_TTL_SECONDS}` : "no-store"
  );
  headers.set("X-Content-Type-Options", "nosniff");
  return headers;
};

type VerifyResult =
  | { ok: true; canonicalUrl: string }
  | { ok: false; status: 400 | 401; message: string };

type ExpiresResult = { ok: true; value: number | null } | { ok: false };

const parseExpires = (raw: string | undefined): ExpiresResult => {
  if (raw === undefined) {
    return { ok: true, value: null };
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return { ok: false };
  }
  return { ok: true, value: parsed };
};

const verifySignedRequest = async (
  query: {
    url: string | undefined;
    token: string | undefined;
    expires: string | undefined;
  },
  secret: string
): Promise<VerifyResult> => {
  if (!query.url) {
    return { ok: false, status: 400, message: "Missing URL parameter" };
  }
  if (query.url.length > MAX_URL_LENGTH) {
    return { ok: false, status: 400, message: "URL too long" };
  }
  if (!query.token) {
    return { ok: false, status: 400, message: "Missing token parameter" };
  }

  const parsed = parseSafeTargetUrl(query.url);
  if (!parsed) {
    return { ok: false, status: 400, message: "Invalid target URL" };
  }

  const expires = parseExpires(query.expires);
  if (!expires.ok) {
    return { ok: false, status: 400, message: "Invalid expires parameter" };
  }
  const expiresAt = expires.value;
  if (expiresAt !== null && Date.now() >= expiresAt * 1000) {
    return { ok: false, status: 401, message: "Signed URL expired" };
  }

  const signature = hexToBytes(query.token);
  if (!signature) {
    return { ok: false, status: 401, message: "Invalid token" };
  }

  const canonicalUrl = parsed.toString();
  const payload = `${PAYLOAD_VERSION}:${expiresAt ?? ""}:${canonicalUrl}`;
  const key = await importHmacKey(secret);
  const verified = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(payload)
  );
  if (!verified) {
    return { ok: false, status: 401, message: "Invalid token" };
  }

  return { ok: true, canonicalUrl };
};

// Loud failure mode by design: if the secret is missing, we want a log entry —
// but not on every request. Guard on a module-level flag.
let hasLoggedMissingSecret = false;

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.options("/", () => {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
  });
  return new Response(null, { status: 204, headers });
});

app.get("/", async (c) => {
  const log = createWorkersLogger(c.req.raw);
  const secret = c.env.INTERNAL_PROXY_SECRET;
  if (!secret) {
    if (!hasLoggedMissingSecret) {
      hasLoggedMissingSecret = true;
      log.error(new Error("INTERNAL_PROXY_SECRET is not set"));
    }
    return c.text("Internal server error", 500);
  }

  let result: VerifyResult;
  try {
    result = await verifySignedRequest(
      {
        url: c.req.query("url"),
        token: c.req.query("token"),
        expires: c.req.query("expires"),
      },
      secret
    );
  } catch (error) {
    log.error(toError(error));
    return c.text("We couldn’t validate your token", 401);
  }

  if (!result.ok) {
    return c.text(result.message, result.status);
  }

  const { canonicalUrl } = result;
  const cache = caches.default;
  const cacheKey = new Request(
    `https://proxy-cache.invalid/${CACHE_NAMESPACE}/${encodeURIComponent(canonicalUrl)}`,
    { method: "GET" }
  );

  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached;
  }

  let upstream: Response;
  try {
    upstream = await fetch(canonicalUrl, { redirect: "manual" });
  } catch (error) {
    log.error(toError(error));
    return c.text("Error fetching URL", 502);
  }

  if (upstream.status >= 300 && upstream.status < 400) {
    // Don't follow or forward redirects — the signed URL ties the token to a
    // specific target, and we don't want to become an open redirect.
    return c.text("Upstream redirected", 502);
  }

  if (upstream.status >= 400) {
    return c.text(`Upstream returned ${upstream.status}`, 502);
  }

  const cacheable = !isUncacheable(upstream.headers);
  const headers = buildResponseHeaders(upstream.headers, { cacheable });
  const response = new Response(upstream.body, {
    status: upstream.status,
    headers,
  });

  if (cacheable) {
    c.executionCtx.waitUntil(
      cache.put(cacheKey, response.clone()).catch((error) => {
        log.error(toError(error));
      })
    );
  }

  return response;
});

export default app;
