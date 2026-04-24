import type { BetterAuthPlugin } from "better-auth";

interface CloudflareSessionFields {
  city?: string | null;
  country?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  region?: string | null;
  regionCode?: string | null;
  timezone?: string | null;
}

const toOptionalString = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return null;
};

export const cloudflare = (options: { cf?: CfProperties<unknown> | null }) => {
  const opts = options ?? {};

  return {
    id: "cloudflare",

    schema: {
      session: {
        fields: {
          timezone: { type: "string", required: false },
          city: { type: "string", required: false },
          country: { type: "string", required: false },
          region: { type: "string", required: false },
          regionCode: { type: "string", required: false },
          latitude: { type: "string", required: false },
          longitude: { type: "string", required: false },
        },
      },
    },

    init() {
      return {
        options: {
          databaseHooks: {
            session: {
              create: {
                before: async (session) => {
                  const cf = await Promise.resolve(opts.cf);

                  if (!cf) {
                    return;
                  }

                  const data: typeof session & CloudflareSessionFields = {
                    ...session,
                    timezone: toOptionalString(cf.timezone),
                    city: toOptionalString(cf.city),
                    country: toOptionalString(cf.country),
                    region: toOptionalString(cf.region),
                    regionCode: toOptionalString(cf.regionCode),
                    latitude: toOptionalString(cf.latitude),
                    longitude: toOptionalString(cf.longitude),
                  };

                  return { data };
                },
              },
            },
          },
        },
      };
    },
  } satisfies BetterAuthPlugin;
};
