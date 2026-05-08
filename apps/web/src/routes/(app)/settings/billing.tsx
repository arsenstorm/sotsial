import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@sotsial/ui/components/empty";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { PageSubheading } from "@sotsial/ui/components/page-subheading";
import { Skeleton } from "@sotsial/ui/components/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconReceipt } from "nucleo-isometric";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/settings/billing")({
  component: BillingPage,
});

interface Subscription {
  cancelAtPeriodEnd?: boolean | null;
  id: string;
  periodEnd?: string | Date | null;
  periodStart?: string | Date | null;
  plan: string;
  status: string;
  trialEnd?: string | Date | null;
}

function BillingPage() {
  const { data: org } = authClient.useActiveOrganization();
  const orgId = org?.id;

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ["billing", "usage", orgId],
    queryFn: async () => {
      const res = await api.v1.billing.usage.$get();
      if (!res.ok) {
        throw new Error("Failed to load usage");
      }
      return (await res.json()) as {
        posts_this_cycle: number;
        connected_accounts: number;
        api_keys: number;
      };
    },
    enabled: Boolean(orgId),
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["billing", "subscriptions", orgId],
    queryFn: async () => {
      if (!orgId) {
        return [] as Subscription[];
      }
      const res = await authClient.subscription.list({
        query: { referenceId: orgId },
      });
      if (res.error) {
        // Stripe plugin not configured — treat as free plan.
        return [] as Subscription[];
      }
      return (res.data ?? []) as unknown as Subscription[];
    },
    enabled: Boolean(orgId),
    retry: false,
  });

  const activeSubscription = subscriptions?.find(
    (s) => s.status === "active" || s.status === "trialing"
  );

  const upgrade = useMutation({
    mutationFn: async (plan: "team" | "enterprise") => {
      if (!orgId) {
        throw new Error("No active organization");
      }
      const res = await authClient.subscription.upgrade({
        plan,
        referenceId: orgId,
        successUrl: "/settings/billing",
        cancelUrl: "/settings/billing",
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to start checkout");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const portal = useMutation({
    mutationFn: async () => {
      if (!orgId) {
        throw new Error("No active organization");
      }
      const res = await authClient.subscription.billingPortal({
        referenceId: orgId,
        returnUrl: "/settings/billing",
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to open billing portal");
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <PageHeading
        description="Manage billing for this organization."
        title="Billing"
      />

      <section className="space-y-4">
        <PageSubheading title="Current plan" />
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {activeSubscription
                  ? `${activeSubscription.plan}${activeSubscription.status === "trialing" ? " · Trial" : ""}`
                  : "Free · Beta"}
              </p>
              <h3 className="font-semibold text-xl capitalize tracking-tight">
                {activeSubscription
                  ? `${org?.name ?? "This organization"} is on the ${activeSubscription.plan} plan.`
                  : `${org?.name ?? "This organization"} is on the free plan.`}
              </h3>
              {activeSubscription?.periodEnd ? (
                <p className="text-muted-foreground text-sm">
                  Renews on{" "}
                  {new Date(activeSubscription.periodEnd).toLocaleDateString()}.
                  {activeSubscription.cancelAtPeriodEnd
                    ? " Cancellation scheduled."
                    : null}
                </p>
              ) : (
                <p className="max-w-[60ch] text-muted-foreground text-sm leading-6">
                  You can find the pricing information{" "}
                  <Link className="underline" to="/pricing">
                    here
                  </Link>
                  .
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {activeSubscription ? (
                <Button
                  disabled={portal.isPending}
                  onClick={() => portal.mutate()}
                  variant="outline"
                >
                  {portal.isPending ? "Opening…" : "Manage billing"}
                </Button>
              ) : (
                <>
                  <Button
                    disabled={upgrade.isPending}
                    onClick={() => upgrade.mutate("team")}
                    variant="outline"
                  >
                    Upgrade to Team
                  </Button>
                  <Button
                    disabled={upgrade.isPending}
                    onClick={() => upgrade.mutate("enterprise")}
                  >
                    Upgrade to Enterprise
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Usage" />
        <dl className="grid @xl:grid-cols-3 grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <UsageCell
            hint="resets at the start of each month"
            label="Posts this cycle"
            loading={usageLoading}
            value={usage?.posts_this_cycle}
          />
          <UsageCell
            hint="across all platforms"
            label="Connected accounts"
            loading={usageLoading}
            value={usage?.connected_accounts}
          />
          <UsageCell
            hint="in this organization"
            label="API keys"
            loading={usageLoading}
            value={usage?.api_keys}
          />
        </dl>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Subscription history" />
        {subscriptions && subscriptions.length > 0 ? (
          <ul className="divide-y divide-border/70 overflow-hidden rounded-xl border border-border bg-card">
            {subscriptions.map((sub) => (
              <li
                className="flex items-center justify-between gap-4 px-5 py-3.5"
                key={sub.id}
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate font-medium text-sm capitalize">
                    {sub.plan}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {sub.periodStart
                      ? `Started ${new Date(sub.periodStart).toLocaleDateString()}`
                      : "—"}
                  </p>
                </div>
                <Badge variant="secondary">{sub.status}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconReceipt />
              </EmptyMedia>
              <EmptyTitle>No subscription history</EmptyTitle>
              <EmptyDescription>
                Once you subscribe to a paid plan, your history will appear
                here. You can find the pricing information{" "}
                <Link to="/pricing">here</Link>.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </div>
  );
}

function UsageCell({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: number | undefined;
  hint: string;
  loading?: boolean;
}) {
  return (
    <div className="bg-card px-6 py-5">
      <dt className="truncate font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-3xl tabular-nums tracking-tight">
        {loading ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          (value ?? 0).toLocaleString()
        )}
      </dd>
      <p className="mt-1 text-muted-foreground text-xs">{hint}</p>
    </div>
  );
}
