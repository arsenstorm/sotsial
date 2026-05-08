import { Button } from "@sotsial/ui/components/button";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
import { IconArrowRightOutlineDuo18 } from "nucleo-ui-outline-duo-18";
import { MarketingShell } from "@/components/marketing/shell";
import { sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(sessionQuery);
    if (session?.user && session.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LandingPage,
});

const PLATFORMS = [
  { name: "Twitter", icon: IconXTwitter },
  { name: "Instagram", icon: IconInstagram },
  { name: "LinkedIn", icon: IconLinkedin },
  { name: "Threads", icon: IconThreads },
  { name: "Facebook", icon: IconFacebook },
  { name: "YouTube", icon: IconYoutube },
  { name: "TikTok", icon: IconTikTok },
  { name: "Google", icon: IconGoogle },
] as const;

const STEPS = [
  {
    title: "Create your workspace",
    description:
      "Sign up with email, create an organization, and invite your team.",
  },
  {
    title: "Connect your accounts",
    description:
      "Link every social account in one flow. Use our OAuth apps or bring your own for brand-owned auth.",
  },
  {
    title: "Publish from one call",
    description:
      "POST once to /v1/publish. Sotsial fans it out, handles per-platform quirks, and reports per-target results.",
  },
] as const;

const FEATURES = [
  {
    label: "One endpoint",
    title: "Publish everywhere at once",
    description:
      "A single POST publishes to every connected account. Media, threading, scheduling — handled.",
  },
  {
    label: "Your OAuth or ours",
    title: "Brand-owned authentication",
    description:
      "Bring your own client credentials per platform, or fall back to Sotsial's shared apps for fast setup.",
  },
  {
    label: "Built for teams",
    title: "Organization-scoped access",
    description:
      "Org-owned API keys, member roles, and isolated credentials per environment. Ready for real deploys.",
  },
] as const;

const CODE_SAMPLE = `curl -X POST https://api.sotsial.com/v1/publish \\
  -H "Authorization: Bearer so_live_…" \\
  -d '{
    "targets": ["twitter:acme", "linkedin:acme"],
    "post": { "text": "Shipping today." }
  }'`;

function LandingPage() {
  return (
    <MarketingShell>
      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <p className="mb-5 font-mono text-muted-foreground text-xs tracking-wide">
                <span className="mr-2 rounded-sm bg-emerald-500/10 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400">
                  POST
                </span>
                /v1/publish
              </p>
              <h1 className="max-w-[20ch] text-balance font-semibold text-4xl tracking-tight">
                Publish to every social network from a single API call.
              </h1>
              <p className="mt-5 max-w-[44ch] text-pretty text-muted-foreground">
                Sotsial is the distribution layer for modern teams. Connect
                once, POST to one endpoint, reach every timeline.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <Button render={<Link to="/sign-up" />} size="sm">
                  Get started
                </Button>
                <Link
                  className="group inline-flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground"
                  to="/sign-in"
                >
                  Read the docs
                  <IconArrowRightOutlineDuo18
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </div>
            <div>
              <TerminalCard />
            </div>
          </div>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/70 sm:grid-cols-4">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              return (
                <li
                  className="flex items-center gap-3 bg-background px-5 py-4 text-foreground/85"
                  key={p.name}
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="text-sm">{p.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="mb-2 font-mono text-muted-foreground text-xs tracking-wide">
            Product
          </p>
          <h2 className="max-w-[35ch] text-balance font-semibold text-2xl tracking-tight">
            Everything a distribution layer needs.
          </h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div className="border-border/70 border-t pt-5" key={f.label}>
                <dt className="space-y-1">
                  <p className="font-mono text-muted-foreground text-xs tracking-wide">
                    {f.label}
                  </p>
                  <p className="font-semibold text-sm tracking-tight">
                    {f.title}
                  </p>
                </dt>
                <dd className="mt-2 text-muted-foreground text-sm leading-6">
                  {f.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <p className="mb-2 font-mono text-muted-foreground text-xs tracking-wide">
            Getting started
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            Three steps, ten minutes.
          </h2>
          <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {STEPS.map((step, idx) => (
              <li className="border-border/70 border-t pt-5" key={step.title}>
                <p className="font-mono text-muted-foreground text-xs tabular-nums tracking-wide">
                  {String(idx + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-semibold text-sm tracking-tight">
                  {step.title}
                </p>
                <p className="mt-2 text-muted-foreground text-sm leading-6">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-balance font-semibold text-2xl tracking-tight">
              Ship to every timeline at once.
            </h2>
            <div className="flex items-center gap-4">
              <Button render={<Link to="/sign-up" />} size="sm">
                Get started
              </Button>
              <Link
                className="text-muted-foreground text-sm hover:text-foreground"
                to="/sign-in"
              >
                Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function TerminalCard() {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/5">
      <figcaption className="flex items-center justify-between border-border/80 border-b bg-muted/40 px-4 py-2.5 font-mono text-[0.75rem] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </span>
          <span>POST /v1/publish</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700 tabular-nums dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          200 OK
        </span>
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-[0.75rem] leading-6">
        <code>{CODE_SAMPLE}</code>
      </pre>
    </figure>
  );
}
