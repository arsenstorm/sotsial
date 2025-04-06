import { betterAuth } from "better-auth";

export const auth = betterAuth({
	// Other config options will be here
	session: {
		expiresIn: 60 * 60 * 24 * 1, // 1 day session expiration
		updateAge: 60 * 60 * 2, // Update session every 2 hours if used
	},
});
