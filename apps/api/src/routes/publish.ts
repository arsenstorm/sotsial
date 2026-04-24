import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthContext } from "../db";
import { getAccounts } from "../lib/accounts";
import { authorise } from "../lib/auth";
import { createCdnUrl } from "../lib/cdn";
import { getCredentials, type ResolvedCredential } from "../lib/credentials";
import { getSotsial, type PlatformAccount } from "../lib/sotsial";

const publishBodySchema = z.object({
  credentials: z.array(z.string()).optional(),
  post: z
    .object({
      media: z.array(z.object({ url: z.string() }).passthrough()).optional(),
    })
    .passthrough(),
  targets: z.array(z.string()).optional(),
});

const app = new Hono<{
  Bindings: CloudflareBindings;
  Variables: { cf?: CfProperties<unknown> | null; auth?: AuthContext };
}>()
  .use("*", authorise())
  .post("/", zValidator("json", publishBodySchema), async (c) => {
    const { organizationId } = c.get("auth") as AuthContext;
    const body = c.req.valid("json");

    const credentialIds = body.credentials ?? [];
    const targets = body.targets ?? [];

    if (targets.length === 0) {
      return c.json(
        {
          data: null,
          error: {
            message: "No targets provided",
            hint: "Who are you trying to publish to? Check out the docs at https://sotsial.com/docs/publishing#targets",
          },
        },
        400
      );
    }

    const credentialByPlatform = new Map<string, ResolvedCredential>();

    if (credentialIds.length > 0) {
      const resolved = await getCredentials(credentialIds, organizationId);

      if (resolved.length !== credentialIds.length) {
        return c.json(
          {
            data: null,
            error: {
              message: "Invalid credentials",
              hint: "Some of the credentials you provided are invalid.",
            },
          },
          400
        );
      }

      for (const cred of resolved) {
        if (credentialByPlatform.has(cred.platform)) {
          return c.json(
            {
              data: null,
              error: {
                message:
                  "You've provided multiple credentials for the same platform. You can only provide one credential per platform.",
                hint: "See the docs for more information: https://sotsial.com/docs/credentials",
              },
            },
            400
          );
        }
        credentialByPlatform.set(cred.platform, cred);
      }
    }

    const { data: accounts, error: accountsError } = await getAccounts({
      targets,
      credentialIds,
      organizationId,
    });

    if (accountsError) {
      return c.json(
        {
          data: null,
          error: {
            message: "An error occurred while fetching accounts",
            hint: "Please try again later.",
          },
        },
        500
      );
    }

    if (accounts.length === 0) {
      return c.json(
        {
          data: null,
          error: {
            message:
              "We couldn't find any accounts for the platforms you're trying to publish to.",
            hint: "Check that you have added accounts for the platforms you're trying to publish to.",
          },
        },
        404
      );
    }

    const accountsByPlatform = accounts.reduce<
      Record<string, PlatformAccount[]>
    >((acc, account) => {
      if (!account.accessToken) {
        return acc;
      }
      const list = acc[account.platform] ?? [];
      list.push({
        id: account.accountId,
        access_token: account.accessToken,
      });
      acc[account.platform] = list;
      return acc;
    }, {});

    const sotsial = getSotsial({
      platforms: Object.entries(accountsByPlatform).map(([platform, accs]) => {
        const cred = credentialByPlatform.get(platform);
        return {
          platform,
          credential: cred
            ? { client_id: cred.clientId, client_secret: cred.clientSecret }
            : null,
          accounts: accs,
        };
      }),
    });

    const mediaInput = (body.post as { media?: { url: string }[] }).media;
    const transformedMedia =
      mediaInput && mediaInput.length > 0
        ? await Promise.all(
            mediaInput.map((m) => ({ ...m, url: createCdnUrl(m.url) }))
          )
        : undefined;

    const results = await sotsial.publish({
      post: {
        ...body.post,
        ...(transformedMedia ? { media: transformedMedia } : {}),
        // biome-ignore lint/suspicious/noExplicitAny: Sotsial post type varies by platform
      } as any,
    });

    return c.json({ results });
  });

export default app;
