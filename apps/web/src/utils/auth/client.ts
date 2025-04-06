import { createAuthClient } from "better-auth/react";
import { apiKeyClient } from "better-auth/client/plugins";

export const auth = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "https://localhost:3000",
	plugins: [apiKeyClient()],
});
