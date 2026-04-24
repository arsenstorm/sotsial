import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "./server";

const client = createAuthClient({
  basePath: "/v1/auth",
  plugins: [inferAdditionalFields<Auth>(), adminClient()],
});

export { client };
