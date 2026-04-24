import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(legal)/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article>
      <h1 className="font-semibold text-3xl tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Last updated on the 17th of November 2024.
      </p>
      <div className="mt-8 space-y-4 text-sm leading-7">
        <p>
          Privacy is important at{" "}
          <a className="underline" href="https://sotsial.com">
            Sotsial
          </a>
          .
        </p>
      </div>
    </article>
  );
}
