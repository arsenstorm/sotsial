// Components

// Utils
import { format } from "date-fns";
// Next
import { headers } from "next/headers";
// React
import { Suspense } from "react";
// Better Auth
import { auth } from "@/auth";
import { KeyStatusToggle } from "@/components/key-status-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";
// UI
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

export default async function KeysPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeading description="Manage your API key." title="Manage API Key">
        <Button color="dark/white" href="/keys">
          See all API keys
        </Button>
      </PageHeading>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <KeyDetails id={id} />
      </Suspense>
    </div>
  );
}

async function KeyDetails({ id }: Readonly<{ id: string }>) {
  const headersList = await headers();

  const key = await auth.api.getApiKey({
    headers: headersList,
    query: {
      id,
    },
  });

  if (!key) {
    throw new Error("Key not found");
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-100 px-6 py-6 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl">{key.name ?? "Unnamed Key"}</h2>
        <p className="text-muted-foreground text-sm">API Key Details</p>
      </div>

      <div className="mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-2">
              <h3 className="font-medium text-muted-foreground text-sm">
                Status
              </h3>
              <Badge color={key.enabled ? "green" : "red"}>
                {key.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Text>Toggle:</Text>
              <KeyStatusToggle
                enabled={key.enabled}
                id={key.id}
                refreshOnToggle
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-muted-foreground text-sm">
              Key Hint
            </h3>
            <p className="mt-1 text-sm">{key.start}...</p>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">
                Key ID
              </h3>
              <p className="mt-1 text-sm">{key.id}</p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">
                Created
              </h3>
              <p className="mt-1 text-sm">
                {format(key.createdAt, "MMM d, yyyy h:mm a")}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">
                Last Updated
              </h3>
              <p className="mt-1 text-sm">
                {format(key.updatedAt, "MMM d, yyyy h:mm a")}
              </p>
            </div>
            {key.expiresAt && (
              <div>
                <h3 className="font-medium text-muted-foreground text-sm">
                  Expires
                </h3>
                <p className="mt-1 text-sm">
                  {format(key.expiresAt, "MMM d, yyyy h:mm a")}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">
                Rate Limiting
              </h3>
              {key.rateLimitEnabled ? (
                <div className="mt-1">
                  <p className="text-sm">
                    <Badge color="blue">{key.rateLimitMax ?? 0}</Badge> requests
                    per{" "}
                    <Badge color="blue">
                      {key.rateLimitTimeWindow
                        ? `${key.rateLimitTimeWindow / 60_000} minutes`
                        : "N/A"}
                    </Badge>
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-sm">Disabled</p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-muted-foreground text-sm">
                Usage
              </h3>
              <div className="mt-1">
                <p className="text-sm">
                  <Badge color="blue">
                    <span className="font-medium">{key.requestCount ?? 0}</span>
                  </Badge>{" "}
                  total requests
                </p>
                <p className="text-sm">
                  Last request:{" "}
                  {key.lastRequest
                    ? format(key.lastRequest, "MMM d, yyyy h:mm a")
                    : "Never"}
                </p>
              </div>
            </div>
            {key.refillInterval && (
              <div>
                <h3 className="font-medium text-muted-foreground text-sm">
                  Quota Refill
                </h3>
                <p className="mt-1 text-sm">
                  {key.refillAmount ?? 0} requests every{" "}
                  {key.refillInterval
                    ? `${key.refillInterval / 60_000} minutes`
                    : "N/A"}
                </p>
                <p className="text-sm">
                  Last refill:{" "}
                  {key.lastRefillAt
                    ? format(key.lastRefillAt, "MMM d, yyyy h:mm a")
                    : "Never"}
                </p>
              </div>
            )}
          </div>
        </div>

        {(key.permissions ?? key.metadata) && (
          <>
            <Divider />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {key.permissions && (
                <div>
                  <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                    Permissions
                  </h3>
                  <pre className="overflow-auto rounded-md bg-muted p-2 text-xs">
                    {JSON.stringify(key.permissions, null, 2)}
                  </pre>
                </div>
              )}
              {key.metadata && (
                <div>
                  <h3 className="mb-2 font-medium text-muted-foreground text-sm">
                    Metadata
                  </h3>
                  <pre className="overflow-auto rounded-md bg-muted p-2 text-xs">
                    {JSON.stringify(key.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
