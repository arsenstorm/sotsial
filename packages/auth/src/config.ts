import { apiKey } from "@better-auth/api-key";
import { stripe as stripePlugin } from "@better-auth/stripe";
import type { BetterAuthOptions } from "better-auth";
import { admin, organization, twoFactor } from "better-auth/plugins";
import Stripe from "stripe";
import { orgAc, orgRoles, systemAc, systemRoles } from "./permissions";
import type { AuthEnv } from "./types";

export const core = (env: AuthEnv, _cf?: CfProperties<unknown>) => {
  return {
    telemetry: { enabled: false },
    appName: "sotsial",
    baseURL: env.APP_BASE_URL,
    basePath: "/v1/auth",
    secret: env.AUTH_SECRET,
    advanced: {
      cookiePrefix: "sotsial",
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        domain: env.ENVIRONMENT === "production" ? "sotsial.com" : undefined,
      },
      database: {
        generateId: "uuid",
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 24 * 60 * 60 * 28, // 28 days
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session, ctx) => {
            // Auto-set the most recent org membership as the active organization
            // so the user lands inside an org context as soon as they sign in.
            if (!ctx) {
              return;
            }

            const memberships = await ctx.context.adapter.findMany<{
              organizationId: string;
            }>({
              model: "member",
              where: [{ field: "userId", value: session.userId }],
              sortBy: { field: "createdAt", direction: "desc" },
              limit: 1,
            });

            const membership = memberships.at(0);

            if (membership?.organizationId) {
              return {
                data: {
                  ...session,
                  activeOrganizationId: membership.organizationId,
                },
              };
            }
          },
        },
      },
    },
    trustedOrigins: [env.APP_BASE_URL],
    plugins: [
      // Organization plugin must be registered before the api-key plugin so the
      // org-owned api-key flow can resolve permissions through org roles.
      organization({
        ac: orgAc,
        roles: orgRoles,
        creatorRole: "owner",
        allowUserToCreateOrganization: true,
        sendInvitationEmail: ({ invitation, organization: org }) => {
          // Email delivery is deferred; log the invite URL so the owner can
          // copy it by hand. The Members page also exposes a Copy link button.
          const inviteUrl = `${env.APP_BASE_URL}/invite/${invitation.id}`;
          console.log(
            `[invite] ${org.name} → ${invitation.email} (${invitation.role}): ${inviteUrl}`
          );
          return Promise.resolve();
        },
      }),
      apiKey({
        configId: "organization",
        defaultPrefix: "so_",
        references: "organization",
      }),
      admin({
        ac: systemAc,
        roles: systemRoles,
        adminRoles: ["admin"],
        defaultRole: "user",
      }),
      twoFactor({
        issuer: "Sotsial",
      }),
      ...buildStripePlugins(env),
    ],
  } satisfies BetterAuthOptions;
};

function buildStripePlugins(env: AuthEnv) {
  if (!(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET)) {
    return [];
  }

  const stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const plans = [
    { name: "free", limits: { posts: 100, accounts: 3 } },
    ...(env.STRIPE_PRICE_TEAM
      ? [
          {
            name: "team",
            priceId: env.STRIPE_PRICE_TEAM,
            limits: { posts: 10_000, accounts: 999 },
          },
        ]
      : []),
    ...(env.STRIPE_PRICE_ENTERPRISE
      ? [
          {
            name: "enterprise",
            priceId: env.STRIPE_PRICE_ENTERPRISE,
            limits: { posts: 999_999, accounts: 999_999 },
          },
        ]
      : []),
  ];

  return [
    stripePlugin({
      stripeClient,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans,
      },
    }),
  ];
}
