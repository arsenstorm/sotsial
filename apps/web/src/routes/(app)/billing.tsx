import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sotsial/ui/components/card";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        description="Manage your billing information."
        title="Billing"
      />
      <Card>
        <CardHeader>
          <CardTitle>Sotsial is free while in beta.</CardTitle>
          <CardDescription>
            Pricing will be announced soon. See the{" "}
            <a className="underline" href="/pricing">
              pricing page
            </a>{" "}
            for preview tiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          You won't be charged for any usage during the beta period.
        </CardContent>
      </Card>
    </div>
  );
}
