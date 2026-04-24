import { ArrowRight02Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardPage,
});

const STATS = [
  {
    label: "Connections",
    value: "0",
    hint: "Social accounts linked to this organization.",
  },
  {
    label: "Recent posts",
    value: "0",
    hint: "Content you've published lately.",
  },
  {
    label: "API keys",
    value: "0",
    hint: "Programmatic access to this organization.",
  },
] as const;

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        description="Overview of your Sotsial workspace."
        title="Dashboard"
      />

      <dl className="grid @xl:grid-cols-3 grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {STATS.map((stat) => (
          <div className="bg-card px-6 py-5" key={stat.label}>
            <dt className="truncate font-medium text-muted-foreground text-xs uppercase tracking-wide">
              {stat.label}
            </dt>
            <dd className="mt-2 font-semibold text-3xl tabular-nums tracking-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid @3xl:grid-cols-[3fr_2fr] grid-cols-1 gap-4">
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-border/70 border-b px-5 py-3">
            <h2 className="font-medium text-sm">Recent posts</h2>
            <Link
              className="inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
              to="/posts"
            >
              View all
              <HugeiconsIcon className="size-3.5" icon={ArrowRight02Icon} />
            </Link>
          </header>
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
            <p className="font-medium text-sm">No posts yet</p>
            <p className="max-w-[36ch] text-muted-foreground text-sm">
              Once you publish from Sotsial, recent activity will appear here.
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-border/70 border-b px-5 py-3">
            <h2 className="font-medium text-sm">Connections</h2>
            <Link
              className="inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
              to="/connections"
            >
              Manage
              <HugeiconsIcon className="size-3.5" icon={ArrowRight02Icon} />
            </Link>
          </header>
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-12 text-center">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <HugeiconsIcon className="size-5" icon={LinkSquare02Icon} />
            </span>
            <p className="font-medium text-sm">No accounts connected</p>
            <Link
              className="text-foreground text-sm underline-offset-4 hover:underline"
              to="/settings/integrations"
            >
              Connect an account
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
