import { apiKeyClient } from "@better-auth/api-key/client";
import { stripeClient } from "@better-auth/stripe/client";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { orgAc, orgRoles, systemAc, systemRoles } from "./permissions";
import type { Auth } from "./server";

const baseURL =
  typeof process === "undefined" ? undefined : process.env.APP_BASE_URL;

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
    twoFactorClient({
      onTwoFactorRedirect() {
        const w = (globalThis as { location?: { href: string } }).location;
        if (w) {
          w.href = "/sign-in/two-factor";
        }
      },
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});

export { client };
