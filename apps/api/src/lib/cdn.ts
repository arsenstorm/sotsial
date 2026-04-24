import { env } from "../env";

/**
 * Rewrite a media URL through the configured CDN. If no CDN base URL is set,
 * the original URL is returned unchanged.
 */
export const createCdnUrl = (url: string): string => {
  if (!env.CDN_BASE_URL) {
    return url;
  }

  try {
    return new URL(`/${encodeURIComponent(url)}`, env.CDN_BASE_URL).toString();
  } catch {
    return url;
  }
};
