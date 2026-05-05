import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(legal)/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <article>
      <h1 className="font-semibold text-3xl tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Last updated on the 17th of November 2024.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-7">
        <p>
          To use Sotsial, you must agree to these terms — they are{" "}
          <span className="font-semibold">non-negotiable</span> and{" "}
          <span className="font-semibold">binding</span>.
        </p>
        <p>I will write these terms soon.</p>
      </div>
    </article>
  );
}
