const HMAC_ALGORITHM = {
  name: "HMAC",
  hash: "SHA-256",
} as const;

const PROXIED_CF_SIGNATURE_MAX_AGE_MS = 5 * 60 * 1000;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type CryptoKeyUsages = Parameters<SubtleCrypto["importKey"]>[4];

export const PROXIED_CF_HEADER = "x-worldclass-proxied-cf";
export const PROXIED_CF_SIGNATURE_HEADER = "x-worldclass-proxied-cf-signature";
export const PROXIED_CF_TIMESTAMP_HEADER = "x-worldclass-proxied-cf-timestamp";

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const importHmacKey = (
  secret: string,
  usages: CryptoKeyUsages
): Promise<CryptoKey> =>
  crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    HMAC_ALGORITHM,
    false,
    usages
  );

const signMessage = async (
  secret: string,
  message: string
): Promise<string> => {
  const key = await importHmacKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign(
    HMAC_ALGORITHM,
    key,
    textEncoder.encode(message)
  );

  return bytesToBase64(new Uint8Array(signature));
};

const verifyMessage = async (
  secret: string,
  signature: string,
  message: string
): Promise<boolean> => {
  const key = await importHmacKey(secret, ["verify"]);

  return crypto.subtle.verify(
    HMAC_ALGORITHM,
    key,
    Uint8Array.from(base64ToBytes(signature)),
    textEncoder.encode(message)
  );
};

const encodeCfPayload = (cf: CfProperties<unknown>): string =>
  bytesToBase64(textEncoder.encode(JSON.stringify(cf)));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const decodeCfPayload = (payload: string): CfProperties<unknown> | null => {
  try {
    const parsed = JSON.parse(textDecoder.decode(base64ToBytes(payload)));

    if (!isRecord(parsed)) {
      return null;
    }

    return parsed as CfProperties<unknown>;
  } catch {
    return null;
  }
};

const isFreshTimestamp = (timestamp: string): boolean => {
  const value = Number(timestamp);

  if (!Number.isFinite(value)) {
    return false;
  }

  return Math.abs(Date.now() - value) <= PROXIED_CF_SIGNATURE_MAX_AGE_MS;
};

const buildSignatureMessage = ({
  method,
  pathAndSearch,
  payload,
  timestamp,
}: {
  method: string;
  pathAndSearch: string;
  payload: string;
  timestamp: string;
}): string =>
  `${timestamp}:${method.toUpperCase()}:${pathAndSearch}:${payload}`;

export const normalizeProxyPath = (pathname: string): string => {
  const normalizedPath = pathname.replace(/\/\/+/g, "/").replace(/\/+$/g, "");

  return normalizedPath.length > 0 ? normalizedPath : "/";
};

const getPathAndSearch = (url: URL): string =>
  `${normalizeProxyPath(url.pathname)}${url.search}`;

export const createSignedProxiedCfHeaders = async ({
  cf,
  method,
  secret,
  url,
}: {
  cf?: CfProperties<unknown> | null;
  method: string;
  secret: string;
  url: URL;
}): Promise<Headers | null> => {
  if (!cf) {
    return null;
  }

  const payload = encodeCfPayload(cf);
  const timestamp = `${Date.now()}`;
  const signature = await signMessage(
    secret,
    buildSignatureMessage({
      method,
      pathAndSearch: getPathAndSearch(url),
      payload,
      timestamp,
    })
  );
  const headers = new Headers();

  headers.set(PROXIED_CF_HEADER, payload);
  headers.set(PROXIED_CF_TIMESTAMP_HEADER, timestamp);
  headers.set(PROXIED_CF_SIGNATURE_HEADER, signature);

  return headers;
};

export const getVerifiedProxiedCf = async ({
  headers,
  method,
  secret,
  url,
}: {
  headers: Headers;
  method: string;
  secret: string;
  url: URL;
}): Promise<CfProperties<unknown> | null> => {
  const payload = headers.get(PROXIED_CF_HEADER);
  const timestamp = headers.get(PROXIED_CF_TIMESTAMP_HEADER);
  const signature = headers.get(PROXIED_CF_SIGNATURE_HEADER);

  if (!(payload && timestamp && signature)) {
    return null;
  }

  if (!isFreshTimestamp(timestamp)) {
    return null;
  }

  try {
    const isValid = await verifyMessage(
      secret,
      signature,
      buildSignatureMessage({
        method,
        pathAndSearch: getPathAndSearch(url),
        payload,
        timestamp,
      })
    );

    if (!isValid) {
      return null;
    }

    return decodeCfPayload(payload);
  } catch {
    return null;
  }
};
