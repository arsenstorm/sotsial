import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(legal)/security")({
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <article>
      <h1 className="font-semibold text-3xl tracking-tight">Security Policy</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Last updated on the 17th of November 2024.
      </p>
      <div className="mt-8 space-y-6 text-sm leading-7">
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Introduction</h2>
          <p>
            Security at Sotsial is critical for us to provide a safe and secure
            platform and experience to developers and their users.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">
            Reporting a Security Issue
          </h2>
          <p>
            To report a security issue, please email us at{" "}
            <a className="underline" href="mailto:security@sotsial.com">
              security@sotsial.com
            </a>
            .
          </p>
          <p className="font-semibold">
            Do not disclose the issue publicly until we have had a chance to
            investigate and resolve it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Scope</h2>
          <p>This policy applies to all Sotsial products and services.</p>

          <h3 className="font-semibold text-base tracking-tight">In Scope</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Any Sotsial service not listed in the Out of Scope section below.
            </li>
          </ul>

          <h3 className="font-semibold text-base tracking-tight">
            Out of Scope
          </h3>
          <p>You must not or attempt to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Phish Sotsial users, partners, or staff</li>
            <li>Social engineer Sotsial employees or contractors</li>
            <li>Perform a denial of service attack on any Sotsial services</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
