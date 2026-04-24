import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingShell } from "@/components/marketing/shell";

export const Route = createFileRoute("/(legal)")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <MarketingShell>
      <section className="border-border/60 border-b">
        <div className="prose prose-sm dark:prose-invert mx-auto max-w-3xl px-6 py-20">
          <Outlet />
        </div>
      </section>
    </MarketingShell>
  );
}
