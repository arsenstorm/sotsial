// Better Auth
import { betterAuth } from "better-auth";
import { apiKey } from "better-auth/plugins";

// Postgres
import { Pool } from "pg";

// Dotenv
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
	appName: "Sotsial",
	url: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: new Pool({
		connectionString: process.env.DATABASE_URL ?? process.env.POSTGRES_URL,
	}),
	advanced: {
		cookiePrefix: "sotsial",
	},
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID ?? "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
		},
	},
	account: {
		modelName: "auth_accounts",
		fields: {
			accessToken: "access_token",
			accessTokenExpiresAt: "access_token_expires_at",
			accountId: "account_id",
			createdAt: "created_at",
			idToken: "id_token",
			providerId: "provider_id",
			refreshToken: "refresh_token",
			refreshTokenExpiresAt: "refresh_token_expires_at",
			updatedAt: "updated_at",
			userId: "user_id",
		},
	},
	session: {
		updateAge: 2 * 60 * 60, // 2 hours
		expiresIn: 2 * 60 * 60, // 2 hour
		modelName: "auth_sessions",
		fields: {
			createdAt: "created_at",
			expiresAt: "expires_at",
			ipAddress: "ip_address",
			updatedAt: "updated_at",
			userAgent: "user_agent",
			userId: "user_id",
		},
	},
	user: {
		modelName: "auth_users",
		fields: {
			createdAt: "created_at",
			email: "email",
			emailVerified: "email_verified",
			updatedAt: "updated_at",
			image: "avatar_url",
		},
	},
	verification: {
		modelName: "auth_verification",
		fields: {
			createdAt: "created_at",
			expiresAt: "expires_at",
			updatedAt: "updated_at",
		},
	},
	trustedOrigins: [
		...(process.env.NODE_ENV === "production"
			? ["https://sotsial.com", process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? ""]
			: ["https://localhost:3000", "http://localhost:3000"]),
	],
	plugins: [
		apiKey({
			defaultPrefix: "so_",
			disableSessionForAPIKeys: true, // We don't want users to use API keys to access the dashboard
			defaultKeyLength: 24,
			rateLimit: {
				enabled: true,
				maxRequests: 100,
				timeWindow: 1000 * 60 * 60, // 1 hour
			},
			apiKeyHeaders: ["authorization", "x-api-key"],
			customAPIKeyGetter(ctx) {
				const request = ctx.request;
				if (!request) return null;

				const authHeader = request.headers.get("authorization");
				const apiKey = authHeader?.startsWith("Bearer ")
					? authHeader.slice(7)
					: (request.headers.get("x-api-key") ?? null);

				return apiKey;
			},
		}),
	],
});
