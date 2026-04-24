import { PageHeading } from "@sotsial/ui/components/page-heading";
import { PageSubheading } from "@sotsial/ui/components/page-subheading";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/settings/billing")({
  component: BillingPage,
});

const PLAN_FEATURES = [
  "Up to 3 connected accounts",
  "100 posts per month",
  "Shared OAuth apps",
  "Community support",
] as const;

function BillingPage() {
  const { data: org } = authClient.useActiveOrganization();

  return (
    <div className="space-y-8">
      <PageHeading
        description="Manage billing for this organization."
        title="Billing"
      />

      <section className="space-y-4">
        <PageSubheading title="Current plan" />
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="space-y-1">
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
              Free · Beta
            </p>
            <h3 className="font-semibold text-xl tracking-tight">
              {org?.name ?? "This organization"} is on the free plan.
            </h3>
            <p className="max-w-[60ch] text-muted-foreground text-sm leading-6">
              Sotsial is free for every workspace while we're in beta. You won't
              be charged for any usage during this period. Paid tiers will be
              introduced once the public launch lands.
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {PLAN_FEATURES.map((feature) => (
              <li
                className="flex items-start gap-2 text-muted-foreground"
                key={feature}
              >
                <span
                  aria-hidden
                  className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-emerald-500"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Usage" />
        <dl className="grid @xl:grid-cols-3 grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border">
          <UsageCell
            hint="of unlimited during beta"
            label="Posts this cycle"
            value="0"
          />
          <UsageCell
            hint="across all platforms"
            label="Connected accounts"
            value="0"
          />
          <UsageCell hint="in this organization" label="API keys" value="0" />
        </dl>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Invoices" />
        <div className="rounded-xl border border-border border-dashed bg-card/30 px-5 py-10 text-center">
          <p className="font-medium text-sm">No invoices yet</p>
          <p className="mx-auto mt-1 max-w-[40ch] text-muted-foreground text-sm leading-6">
            Invoices will appear here once paid plans are available. Preview the
            upcoming tiers on the{" "}
            <Link className="underline underline-offset-4" to="/pricing">
              pricing page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function UsageCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-card px-6 py-5">
      <dt className="truncate font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-3xl tabular-nums tracking-tight">
        {value}
      </dd>
      <p className="mt-1 text-muted-foreground text-xs">{hint}</p>
    </div>
  );
}
