import { apiKeyClient } from "@better-auth/api-key/client";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { orgAc, orgRoles, systemAc, systemRoles } from "./permissions";
import type { Auth } from "./server";

// On SSR, better-auth has no `window.location` to derive an absolute URL from,
// so it falls back to a relative string and the first fetch throws "Invalid URL".
// AUTH_URL (set in wrangler vars; surfaced via process.env with nodejs_compat)
// gives us a valid origin server-side; the browser uses window.location.origin.
const baseURL =
  typeof process === "undefined" ? undefined : process.env.AUTH_URL;

const client = createAuthClient({
  baseURL,
  basePath: "/v1/auth",
  plugins: [
    inferAdditionalFields<Auth>(),
    organizationClient({
      ac: orgAc,
      roles: orgRoles,
    }),
    apiKeyClient(),
    adminClient({
      ac: systemAc,
      roles: systemRoles,
    }),
  ],
});

export { client };
