import { Button } from "@sotsial/ui/components/button";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-border/60 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
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
            to="/pricing"
          >
            Pricing
          </Link>
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

export function MarketingFooter() {
  return (
    <footer>
      <div className="mx-auto max-w-5xl px-6 py-14">
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
              The distribution layer for modern teams. Built on Cloudflare
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
