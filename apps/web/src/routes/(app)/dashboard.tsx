import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sotsial/ui/components/card";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        description="Overview of your Sotsial workspace."
        title="Dashboard"
      />
      <div className="grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
            <CardDescription>
              Social accounts linked to this organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            No data yet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent posts</CardTitle>
            <CardDescription>Content you've published lately.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            No data yet.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API keys</CardTitle>
            <CardDescription>
              Programmatic access to this organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            No data yet.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
