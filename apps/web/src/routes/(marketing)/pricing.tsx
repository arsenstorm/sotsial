import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@sotsial/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/shell";

export const Route = createFileRoute("/(marketing)/pricing")({
  component: PricingPage,
});

const TIERS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For side projects and early experiments.",
    cta: "Start free",
    highlight: false,
    features: [
      "Up to 3 connected accounts",
      "100 posts / month",
      "Shared OAuth apps",
      "Community support",
    ],
  },
  {
    name: "Team",
    price: "$29",
    cadence: "per month",
    description: "For teams shipping content to every timeline.",
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "Unlimited connected accounts",
      "10,000 posts / month",
      "Bring-your-own OAuth credentials",
      "Org-scoped API keys",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "billed annually",
    description: "For platforms with custom scale and compliance needs.",
    cta: "Contact sales",
    highlight: false,
    features: [
      "Unlimited posts",
      "SOC 2 report & DPA",
      "Dedicated support channel",
      "SLA & custom regions",
      "SSO / SAML",
    ],
  },
] as const;

const FAQ = [
  {
    q: "Is there a free tier?",
    a: "Yes. The Free plan stays free while Sotsial is in beta and covers 3 accounts and 100 posts / month.",
  },
  {
    q: "What counts as a post?",
    a: "A single successful publish to one target counts as one post. A cross-post to three networks counts as three.",
  },
  {
    q: "Can I bring my own OAuth apps?",
    a: "Yes. On Team and Enterprise you can register per-platform client credentials so content ships under your own brand.",
  },
  {
    q: "How do I cancel?",
    a: "Downgrade or cancel at any time from Billing. You keep access through the end of the paid period.",
  },
] as const;

function PricingPage() {
  return (
    <MarketingShell>
      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <p className="mb-5 font-mono text-muted-foreground text-xs tracking-wide">
            Pricing
          </p>
          <h1 className="max-w-[24ch] text-balance font-semibold text-4xl tracking-tight">
            Simple pricing that scales with your posts.
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-muted-foreground">
            Start free while in beta. Upgrade when you need more accounts,
            volume, or your own OAuth apps.
          </p>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                className={`flex flex-col gap-5 rounded-xl border bg-card p-6 ${
                  tier.highlight
                    ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "border-border"
                }`}
                key={tier.name}
              >
                <div className="space-y-1">
                  <p className="font-mono text-muted-foreground text-xs tracking-wide">
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-2xl tracking-tight">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {tier.cadence}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-6">
                    {tier.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li
                      className="flex items-start gap-2 text-sm leading-6"
                      key={feature}
                    >
                      <HugeiconsIcon
                        className="mt-1 size-3.5 text-emerald-600 dark:text-emerald-400"
                        icon={Tick02Icon}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Button
                    className="w-full"
                    render={<Link to="/sign-up" />}
                    size="sm"
                    variant={tier.highlight ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border/60 border-b">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <p className="mb-2 font-mono text-muted-foreground text-xs tracking-wide">
            FAQ
          </p>
          <h2 className="font-semibold text-2xl tracking-tight">
            Common questions
          </h2>
          <dl className="mt-8 divide-y divide-border/70">
            {FAQ.map((item) => (
              <div
                className="grid gap-6 py-6 md:grid-cols-[12rem_1fr]"
                key={item.q}
              >
                <dt className="font-semibold text-sm tracking-tight">
                  {item.q}
                </dt>
                <dd className="text-muted-foreground text-sm leading-6">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </MarketingShell>
  );
}
