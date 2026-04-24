import { initAuth } from "@sotsial/auth/server";
import handler from "@tanstack/react-start/server-entry";

const CUSTOM_HOST = "sotsial.com";
const MINTLIFY_HOST = "sotsial.mintlify.dev";

export default {
  // biome-ignore lint/suspicious/useAwait: intentionally async
  async fetch(
    request: Request,
    env: CloudflareBindings,
    _ctx: ExecutionContext
  ) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/auth/")) {
      return initAuth(env).handler(request);
    }

    if (url.pathname.startsWith("/docs")) {
      const proxyUrl = new URL(request.url);
      proxyUrl.hostname = MINTLIFY_HOST;

      const proxyRequest = new Request(proxyUrl, request);
      proxyRequest.headers.set("Host", MINTLIFY_HOST);
      proxyRequest.headers.set("X-Forwarded-Host", CUSTOM_HOST);
      proxyRequest.headers.set("X-Forwarded-Proto", "https");

      const connectingIp = request.headers.get("CF-Connecting-IP");
      if (connectingIp) {
        proxyRequest.headers.set("CF-Connecting-IP", connectingIp);
      }

      return fetch(proxyRequest);
    }

    return handler.fetch(request);
  },
};
