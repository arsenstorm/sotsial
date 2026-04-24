import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@sotsial/ui/components/description-list";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { Skeleton } from "@sotsial/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/keys/$id")({
  component: KeyDetailPage,
});

function KeyDetailPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["apikey", id],
    queryFn: async () => {
      const result = await authClient.apiKey.get({ query: { id } });
      if (result.error) {
        throw new Error(result.error.message ?? "Failed to load key");
      }
      return result.data;
    },
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return <p className="text-muted-foreground text-sm">Key not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeading
        actions={
          <Button render={<Link to="/keys" />} variant="ghost">
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Back
          </Button>
        }
        description={data.name ?? "Untitled key"}
        title="API key"
      />
      <DescriptionList>
        <DescriptionTerm>ID</DescriptionTerm>
        <DescriptionDetails className="font-mono text-xs">
          {data.id}
        </DescriptionDetails>

        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>
          <Badge variant={data.enabled ? "default" : "secondary"}>
            {data.enabled ? "Enabled" : "Disabled"}
          </Badge>
        </DescriptionDetails>

        <DescriptionTerm>Prefix</DescriptionTerm>
        <DescriptionDetails className="font-mono text-xs">
          {data.start ?? data.prefix ?? "—"}
        </DescriptionDetails>

        <DescriptionTerm>Rate limit</DescriptionTerm>
        <DescriptionDetails>
          {data.rateLimitEnabled
            ? `${data.rateLimitMax ?? "—"} / ${data.rateLimitTimeWindow ?? "—"}ms`
            : "Disabled"}
        </DescriptionDetails>

        <DescriptionTerm>Remaining</DescriptionTerm>
        <DescriptionDetails>
          {data.remaining === null ? "Unlimited" : data.remaining}
        </DescriptionDetails>

        <DescriptionTerm>Last request</DescriptionTerm>
        <DescriptionDetails>
          {data.lastRequest
            ? new Date(data.lastRequest).toLocaleString()
            : "Never"}
        </DescriptionDetails>

        <DescriptionTerm>Created</DescriptionTerm>
        <DescriptionDetails>
          {new Date(data.createdAt).toLocaleString()}
        </DescriptionDetails>

        <DescriptionTerm>Expires</DescriptionTerm>
        <DescriptionDetails>
          {data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "Never"}
        </DescriptionDetails>
      </DescriptionList>
    </div>
  );
}
