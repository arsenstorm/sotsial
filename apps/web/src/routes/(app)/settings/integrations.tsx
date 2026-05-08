import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sotsial/ui/components/avatar";
import { Button } from "@sotsial/ui/components/button";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { Skeleton } from "@sotsial/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconFacebook,
  IconGoogle,
  IconInstagram,
  IconLinkedin,
  IconThreads,
  IconTikTok,
  IconXTwitter,
  IconYoutube,
} from "nucleo-social-media";
import {
  IconChevronDownOutlineDuo18,
  IconPlusOutlineDuo18,
  IconTrashOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/settings/integrations")({
  component: IntegrationsPage,
});

type ProviderIcon = React.ComponentType<{ className?: string }>;

interface Provider {
  icon: ProviderIcon;
  id: string;
  name: string;
}

interface AccountRow {
  account: { name?: string; username?: string; avatar?: string } | null;
  account_id: string;
  id: string;
  platform: string;
}

const POPULAR: readonly Provider[] = [
  { id: "instagram", name: "Instagram", icon: IconInstagram },
  { id: "twitter", name: "Twitter", icon: IconXTwitter },
  { id: "tiktok", name: "TikTok", icon: IconTikTok },
  { id: "threads", name: "Threads", icon: IconThreads },
] as const;

const MORE: readonly Provider[] = [
  { id: "facebook", name: "Facebook", icon: IconFacebook },
  { id: "linkedin", name: "LinkedIn", icon: IconLinkedin },
  { id: "youtube", name: "YouTube", icon: IconYoutube },
  { id: "google", name: "Google", icon: IconGoogle },
] as const;

const connectionsKey = ["connections"] as const;
const WHITESPACE_RE = /\s+/;

function IntegrationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: [...connectionsKey, { limit: 100 }],
    queryFn: async () => {
      const res = await api.v1.connections.$get({
        query: { page: 1, limit: 100 },
      });
      if (!res.ok) {
        throw new Error("Failed to load connections");
      }
      const json = (await res.json()) as { data: AccountRow[] };
      return json.data;
    },
  });

  const accountsByPlatform = groupByPlatform(data ?? []);

  return (
    <div className="space-y-6">
      <PageHeading
        description="Connect social accounts to publish through Sotsial."
        title="Integrations"
      />
      {isLoading ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <ul className="divide-y divide-border/70">
            {POPULAR.map((p) => (
              <ProviderSection
                accounts={accountsByPlatform.get(p.id) ?? []}
                key={p.id}
                provider={p}
              />
            ))}
            <MoreProvidersSection accountsByPlatform={accountsByPlatform} />
          </ul>
        </div>
      )}
    </div>
  );
}

function groupByPlatform(rows: AccountRow[]): Map<string, AccountRow[]> {
  const map = new Map<string, AccountRow[]>();
  for (const row of rows) {
    const list = map.get(row.platform) ?? [];
    list.push(row);
    map.set(row.platform, list);
  }
  return map;
}

function MoreProvidersSection({
  accountsByPlatform,
}: {
  accountsByPlatform: Map<string, AccountRow[]>;
}) {
  const connectedCount = MORE.reduce(
    (sum, p) => sum + (accountsByPlatform.get(p.id)?.length ?? 0),
    0
  );
  const [expanded, setExpanded] = useState(connectedCount > 0);

  return (
    <li>
      <button
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 px-5 py-3.5 text-left hover:bg-muted/40"
        onClick={() => setExpanded((v) => !v)}
        type="button"
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border border-dashed bg-background font-mono text-muted-foreground text-xs tabular-nums">
          +{MORE.length}
        </span>
        <span className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm">More platforms</p>
          <p className="truncate text-muted-foreground text-xs">
            {MORE.map((p) => p.name).join(", ")}
          </p>
        </span>
        <IconChevronDownOutlineDuo18
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>
      {expanded ? (
        <ul className="divide-y divide-border/70 border-border/70 border-t">
          {MORE.map((p) => (
            <ProviderSection
              accounts={accountsByPlatform.get(p.id) ?? []}
              key={p.id}
              provider={p}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ProviderSection({
  provider,
  accounts,
}: {
  provider: Provider;
  accounts: AccountRow[];
}) {
  const [expanded, setExpanded] = useState(accounts.length > 0);
  const { connect, isPending } = useConnectProvider(provider);

  const hasAccounts = accounts.length > 0;
  const Icon = provider.icon;

  return (
    <li>
      <div className="flex items-center gap-4 px-5 py-3.5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-sm">{provider.name}</p>
          <p className="truncate text-muted-foreground text-xs">
            {hasAccounts
              ? `${accounts.length} ${accounts.length === 1 ? "account" : "accounts"} connected`
              : "Not connected"}
          </p>
        </div>
        {hasAccounts ? (
          <>
            <Button
              disabled={isPending}
              onClick={connect}
              size="sm"
              variant="outline"
            >
              {isPending ? "Connecting…" : "Connect another"}
            </Button>
            <Button
              aria-label={expanded ? "Hide accounts" : "Show accounts"}
              className="size-8"
              onClick={() => setExpanded((v) => !v)}
              size="icon-sm"
              variant="ghost"
            >
              <IconChevronDownOutlineDuo18
                className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </Button>
          </>
        ) : (
          <Button
            disabled={isPending}
            onClick={connect}
            size="sm"
            variant="outline"
          >
            {isPending ? "Connecting…" : "Connect"}
          </Button>
        )}
      </div>
      {hasAccounts && expanded ? (
        <ul className="divide-y divide-border/70 border-border/70 border-t bg-muted/30">
          {accounts.map((account) => (
            <AccountRowItem account={account} key={account.id} />
          ))}
          <li>
            <button
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-muted-foreground text-sm hover:text-foreground"
              disabled={isPending}
              onClick={connect}
              type="button"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border border-dashed bg-background">
                <IconPlusOutlineDuo18 className="size-3.5" strokeWidth={2} />
              </span>
              {isPending
                ? "Connecting…"
                : `Connect another ${provider.name} account`}
            </button>
          </li>
        </ul>
      ) : null}
    </li>
  );
}

function AccountRowItem({ account }: { account: AccountRow }) {
  const queryClient = useQueryClient();
  const disconnect = useMutation({
    mutationFn: async () => {
      const res = await api.v1.connections.$delete({
        query: { id: account.id },
      });
      if (!res.ok) {
        throw new Error("Failed to disconnect");
      }
    },
    onSuccess: () => {
      toast.success("Account disconnected");
      queryClient.invalidateQueries({ queryKey: connectionsKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const displayName =
    account.account?.name || account.account?.username || account.account_id;
  const handle = account.account?.username
    ? `@${account.account.username}`
    : account.account_id;
  const initials = (account.account?.name || account.account?.username || "?")
    .split(WHITESPACE_RE)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <li className="flex items-center gap-3 px-5 py-3">
      <Avatar className="size-7">
        {account.account?.avatar ? (
          <AvatarImage alt={displayName} src={account.account.avatar} />
        ) : null}
        <AvatarFallback className="text-[0.625rem]">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{displayName}</p>
        {displayName === handle ? null : (
          <p className="truncate text-muted-foreground text-xs">{handle}</p>
        )}
      </div>
      <Button
        aria-label={`Disconnect ${displayName}`}
        className="text-muted-foreground hover:text-destructive"
        disabled={disconnect.isPending}
        onClick={() => disconnect.mutate()}
        size="icon-sm"
        variant="ghost"
      >
        <IconTrashOutlineDuo18 className="size-4" strokeWidth={2} />
      </Button>
    </li>
  );
}

function useConnectProvider(provider: Provider) {
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);

  useEffect(() => () => popupRef.current?.close(), []);

  const pollVerify = async (grantId: string) => {
    const started = Date.now();
    const timeout = 5 * 60 * 1000;

    while (Date.now() - started < timeout) {
      await new Promise((r) => setTimeout(r, 2000));

      const res = await api.v1.connections.verify.$get({
        query: { id: grantId },
      });

      if (!res.ok) {
        continue;
      }

      const json = (await res.json()) as {
        status?: "pending" | "success" | "failed";
      };

      if (json.status === "success") {
        return "success" as const;
      }
      if (json.status === "failed") {
        return "failed" as const;
      }
    }

    return "timeout" as const;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.v1.connections.$post({
        query: { platform: provider.id, redirect: "close" },
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to start grant");
      }
      return (await res.json()) as { url: string; token: string };
    },
    onSuccess: async ({ url, token }) => {
      popupRef.current = window.open(
        url,
        `connect-${provider.id}`,
        "width=540,height=720"
      );
      const [grantId] = token.split("|");
      const outcome = await pollVerify(grantId);
      popupRef.current?.close();
      if (outcome === "success") {
        toast.success(`${provider.name} connected`);
        queryClient.invalidateQueries({ queryKey: connectionsKey });
      } else if (outcome === "failed") {
        toast.error(`${provider.name} authorization failed`);
      } else {
        toast.error(`${provider.name} authorization timed out`);
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return {
    connect: () => mutation.mutate(),
    isPending: mutation.isPending,
  };
}
