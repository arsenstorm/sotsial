import {
  FacebookFreeIcons,
  GoogleFreeIcons,
  InstagramFreeIcons,
  LinkedinIcon,
  ThreadsFreeIcons,
  TiktokIcon,
  TwitterFreeIcons,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@sotsial/ui/components/avatar";
import { Skeleton } from "@sotsial/ui/components/skeleton";

type ProviderIcon = Parameters<typeof HugeiconsIcon>[0]["icon"];

const PLATFORM_ICONS: Record<string, ProviderIcon> = {
  facebook: FacebookFreeIcons,
  google: GoogleFreeIcons,
  instagram: InstagramFreeIcons,
  linkedin: LinkedinIcon,
  threads: ThreadsFreeIcons,
  tiktok: TiktokIcon,
  twitter: TwitterFreeIcons,
  youtube: YoutubeIcon,
};

const WHITESPACE_RE = /\s+/;

export interface ConnectionOption {
  account: {
    name?: string;
    username?: string;
    avatar?: string;
  } | null;
  account_id: string;
  id: string;
  platform: string;
}

export function AccountSelection({
  connections,
  selectedIds,
  onToggle,
  isLoading,
}: {
  connections: ConnectionOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          <Skeleton className="h-16 w-full rounded-xl" key={i} />
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No connected accounts yet. Add one from Integrations first.
      </p>
    );
  }

  const byPlatform = new Map<string, ConnectionOption[]>();
  for (const conn of connections) {
    const list = byPlatform.get(conn.platform) ?? [];
    list.push(conn);
    byPlatform.set(conn.platform, list);
  }

  return (
    <div className="space-y-4">
      {Array.from(byPlatform.entries()).map(([platform, items]) => (
        <div key={platform}>
          <p className="mb-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            {platform}
          </p>
          <div className="grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-2">
            {items.map((conn) => (
              <AccountChip
                account={conn}
                active={selectedIds.has(conn.id)}
                key={conn.id}
                onClick={() => onToggle(conn.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AccountChip({
  account,
  active,
  onClick,
}: {
  account: ConnectionOption;
  active: boolean;
  onClick: () => void;
}) {
  const icon = PLATFORM_ICONS[account.platform];
  const displayName =
    account.account?.name ?? account.account?.username ?? account.account_id;
  const handle = account.account?.username
    ? `@${account.account.username}`
    : account.platform;
  const initials = (account.account?.name || account.account?.username || "?")
    .split(WHITESPACE_RE)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      className={
        active
          ? "flex items-center gap-3 rounded-xl border border-primary bg-primary/10 px-3 py-2.5 text-left"
          : "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left hover:bg-muted/40"
      }
      onClick={onClick}
      type="button"
    >
      <Avatar className="size-8 shrink-0">
        {account.account?.avatar ? (
          <AvatarImage alt={displayName} src={account.account.avatar} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{displayName}</p>
        <p className="flex items-center gap-1 truncate text-muted-foreground text-xs">
          {icon ? <HugeiconsIcon className="size-3" icon={icon} /> : null}
          {handle}
        </p>
      </div>
    </button>
  );
}
