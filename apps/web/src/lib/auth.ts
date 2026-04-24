import { client as authClient } from "@sotsial/auth/client";
import { queryOptions } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

// biome-ignore lint/performance/noBarrelFile: tiny re-export for ergonomic importing
export { client as authClient } from "@sotsial/auth/client";

type SessionData = Awaited<ReturnType<typeof authClient.getSession>>["data"];

/**
 * Fetch the session. On the client we go through better-auth's React client
 * (cookies, refetch, etc.). On the server we bypass HTTP entirely and call
 * the API worker via the Cloudflare service binding.
 */
const fetchSession = createIsomorphicFn()
  .client(async (): Promise<SessionData | null> => {
    const result = await authClient.getSession();
    return result.data ?? null;
  })
  .server(async (): Promise<SessionData | null> => {
    const { getRequestHeaders } = await import("@tanstack/react-start/server");
    const { env } = await import("cloudflare:workers");

    const cookie = getRequestHeaders().get("cookie") ?? "";
    if (!cookie) {
      return null;
    }

    const res = await env.API.fetch("http://api/v1/auth/get-session", {
      headers: { cookie },
    });
    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    if (!text) {
      return null;
    }

    return JSON.parse(text) as SessionData;
  });

export const sessionQuery = queryOptions({
  queryKey: ["auth", "session"],
  queryFn: fetchSession,
  staleTime: 60 * 1000,
});
