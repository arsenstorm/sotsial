import { apiKeyClient } from "@better-auth/api-key/client";
import {
  adminClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { orgAc, orgRoles, systemAc, systemRoles } from "./permissions";
import type { Auth } from "./server";

const client = createAuthClient({
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
