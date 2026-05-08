import { Button } from "@sotsial/ui/components/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@sotsial/ui/components/empty";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconNet, IconPencil } from "nucleo-isometric";
import { IconArrowRightOutlineDuo18 } from "nucleo-ui-outline-duo-18";

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
              <IconArrowRightOutlineDuo18
                className="size-3.5"
                strokeWidth={2}
              />
            </Link>
          </header>
          <Empty className="p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconPencil />
              </EmptyMedia>
              <EmptyTitle>No posts yet</EmptyTitle>
            </EmptyHeader>
            <Button
              render={<Link to="/posts/create" />}
              size="sm"
              variant="outline"
            >
              Create your first post
            </Button>
          </Empty>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <header className="flex items-center justify-between border-border/70 border-b px-5 py-3">
            <h2 className="font-medium text-sm">Connections</h2>
            <Link
              className="inline-flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
              to="/connections"
            >
              Manage
              <IconArrowRightOutlineDuo18
                className="size-3.5"
                strokeWidth={2}
              />
            </Link>
          </header>
          <Empty className="p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconNet />
              </EmptyMedia>
              <EmptyTitle>No accounts connected</EmptyTitle>
            </EmptyHeader>
            <Button
              render={<Link to="/settings/integrations" />}
              size="sm"
              variant="outline"
            >
              Connect an account
            </Button>
          </Empty>
        </section>
      </div>
    </div>
  );
}
