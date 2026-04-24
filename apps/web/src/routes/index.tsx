import {
  ArrowRight02Icon,
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
import { Button } from "@sotsial/ui/components/button";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
  { name: "Twitter", icon: TwitterFreeIcons },
  { name: "Instagram", icon: InstagramFreeIcons },
  { name: "LinkedIn", icon: LinkedinIcon },
  { name: "Threads", icon: ThreadsFreeIcons },
  { name: "Facebook", icon: FacebookFreeIcons },
  { name: "YouTube", icon: YoutubeIcon },
  { name: "TikTok", icon: TiktokIcon },
  { name: "Google", icon: GoogleFreeIcons },
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

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API reference", href: "/docs/api" },
      { label: "Status", href: "https://status.sotsial.com" },
      { label: "GitHub", href: "https://github.com/arsenstorm/sotsial" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
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
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-5 font-mono text-muted-foreground text-xs tracking-wide">
            <span className="mr-2 rounded-sm bg-emerald-500/10 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-400">
              POST
            </span>
            /v1/publish
          </p>
          <h1 className="max-w-[24ch] text-balance font-semibold text-4xl tracking-tight">
            Publish to every social network from a single API call.
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-muted-foreground">
            Sotsial is the distribution layer for modern teams. Connect your
            accounts once, then POST to one endpoint to reach every timeline —
            Twitter, Instagram, LinkedIn, Threads, Facebook, YouTube, TikTok,
            and Google.
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
              <HugeiconsIcon
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
                icon={ArrowRight02Icon}
              />
            </Link>
          </div>
          <div className="mt-10">
            <TerminalCard />
          </div>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="mb-8 font-mono text-muted-foreground text-xs tracking-wide">
            Supported networks
          </p>
          <div className="grid grid-cols-4 gap-x-6 gap-y-6 sm:grid-cols-8">
            {PLATFORMS.map((p) => (
              <div
                className="flex flex-col items-start gap-1.5 text-muted-foreground/80"
                key={p.name}
              >
                <HugeiconsIcon className="size-4" icon={p.icon} />
                <span className="text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="mb-2 font-mono text-muted-foreground text-xs tracking-wide">
            Product
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            Everything a distribution layer needs.
          </h2>
          <dl className="mt-8 divide-y divide-border/70">
            {FEATURES.map((f) => (
              <div
                className="grid gap-6 py-6 md:grid-cols-[12rem_1fr]"
                key={f.label}
              >
                <dt className="space-y-1">
                  <p className="font-mono text-muted-foreground text-xs tracking-wide">
                    {f.label}
                  </p>
                  <p className="font-semibold text-sm tracking-tight">
                    {f.title}
                  </p>
                </dt>
                <dd className="text-muted-foreground text-sm leading-6">
                  {f.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="mb-2 font-mono text-muted-foreground text-xs tracking-wide">
            Getting started
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            Three steps, ten minutes.
          </h2>
          <ol className="mt-8 divide-y divide-border/70">
            {STEPS.map((step, idx) => (
              <li
                className="grid gap-6 py-6 md:grid-cols-[12rem_1fr]"
                key={step.title}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-muted-foreground text-xs tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="font-semibold text-sm tracking-tight">
                    {step.title}
                  </p>
                </div>
                <p className="text-muted-foreground text-sm leading-6">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
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

      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
        <Link
          aria-label="Homepage"
          className="flex items-center gap-2 font-semibold text-sm tracking-tight"
          to="/"
        >
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          sotsial
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            className="rounded-md px-3 py-1.5 text-muted-foreground text-sm hover:bg-muted hover:text-foreground"
            to="/sign-in"
          >
            Sign in
          </Link>
          <Button render={<Link to="/sign-up" />} size="sm">
            Get started
          </Button>
        </nav>
      </div>
    </header>
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

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto_auto] md:gap-16">
          <div className="space-y-3">
            <Link
              aria-label="Homepage"
              className="flex items-center gap-2 font-semibold text-sm tracking-tight"
              to="/"
            >
              <span className="inline-block size-2 rounded-full bg-emerald-500" />
              sotsial
            </Link>
            <p className="max-w-[32ch] text-muted-foreground text-sm leading-6">
              The distribution layer for modern teams. Built in Cloudflare
              Workers.
            </p>
          </div>
          {FOOTER_LINKS.map((column) => (
            <div className="space-y-3" key={column.heading}>
              <p className="font-mono text-muted-foreground text-xs tracking-wide">
                {column.heading}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      className="text-muted-foreground text-sm hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-border/60 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-xs tabular-nums">
            © {new Date().getFullYear()} Sotsial
          </p>
          <p className="font-mono text-muted-foreground text-xs tracking-wide">
            v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
