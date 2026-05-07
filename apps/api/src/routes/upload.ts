import { Hono } from "hono";
import type { AuthContext } from "../db";
import { authorise } from "../lib/auth";

const MAX_BYTES = 25 * 1024 * 1024;
const TRAILING_SLASH = /\/$/;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

const TYPE_FAMILY: Record<string, "image" | "video"> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/quicktime": "video",
};

/**
 * POST /v1/upload — accepts multipart/form-data with a single `file` field,
 * writes to the R2 media bucket keyed by organization, and returns a stable
 * URL served via the public proxy. The publish flow wraps the URL with a
 * short-lived HMAC token before handing it off to the platform providers.
 */
const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .post("/", async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;

    const form = await c.req.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) {
      return c.json({ error: "Missing `file` field" }, 400);
    }

    const mime = file.type.toLowerCase();
    const extension = EXTENSIONS[mime];
    const family = TYPE_FAMILY[mime];
    if (!(extension && family)) {
      return c.json({ error: `Unsupported mime type: ${file.type}` }, 415);
    }

    if (file.size > MAX_BYTES) {
      return c.json({ error: "File exceeds 25MB" }, 413);
    }

    const envBindings = c.env as unknown as {
      R2_MEDIA?: R2Bucket;
      MEDIA_BASE_URL?: string;
    };
    const bucket = envBindings.R2_MEDIA;
    if (!bucket) {
      return c.json({ error: "Media bucket is not configured" }, 500);
    }

    const key = `${organizationId}/${crypto.randomUUID()}.${extension}`;
    const buffer = await file.arrayBuffer();

    await bucket.put(key, buffer, {
      httpMetadata: { contentType: mime },
    });

    const base = envBindings.MEDIA_BASE_URL ?? "https://media.sotsial.com";
    const url = `${base.replace(TRAILING_SLASH, "")}/${key}`;

    return c.json({ url, type: family, size: file.size });
  });

export default app;
