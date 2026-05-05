import {
  createSignedProxiedCfHeaders,
  normalizeProxyPath,
} from "@sotsial/auth/cloudflare/proxy";
import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env/server";

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

const buildProxyHeaders = async (
  request: Request,
  url: URL
): Promise<Headers> => {
  const headers = new Headers(request.headers);
  const proxiedCfHeaders = await createSignedProxiedCfHeaders({
    cf: request.cf,
    method: request.method,
    secret: env.INTERNAL_PROXY_SECRET,
    url,
  });

  if (proxiedCfHeaders) {
    for (const [key, value] of proxiedCfHeaders.entries()) {
      headers.set(key, value);
    }
  }

  return headers;
};

const rewriteLocation = (location: string, host: string): string => {
  const publicPath = location.startsWith("http://v1/")
    ? location.replace("http://v1/", "/")
    : location;

  return new URL(publicPath, host).toString();
};

const buildProxyResponse = (response: Response, host: string): Response => {
  if (!REDIRECT_STATUSES.has(response.status)) {
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  const location = response.headers.get("Location");

  if (!location) {
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  const headers = new Headers(response.headers);
  headers.set("Location", rewriteLocation(location, host));

  return new Response(null, {
    status: response.status,
    headers,
  });
};

export const Route = createFileRoute("/v1/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const host = env.PUBLIC_APP_BASE_URL;
        const url = new URL(request.url, host);
        const targetPath = normalizeProxyPath(url.pathname);

        const response = await env.API.fetch(
          `http://api${targetPath}${url.search}`,
          {
            credentials: "include",
            method: request.method,
            headers: await buildProxyHeaders(request, url),
            body: request.body ?? undefined,
            redirect: "manual",
          }
        );

        return buildProxyResponse(response, host);
      },
    },
  },
});
