import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sotsial/ui/components/card";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/help")({
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeading description="Get help with Sotsial." title="Help" />
      <Card>
        <CardHeader>
          <CardTitle>We don't have a help center yet.</CardTitle>
          <CardDescription>
            You can get in touch directly at{" "}
            <a className="underline" href="mailto:help@sotsial.com">
              help@sotsial.com
            </a>{" "}
            or{" "}
            <a
              className="underline"
              href="https://github.com/arsenstorm/sotsial/issues"
              rel="noopener"
              target="_blank"
            >
              create an issue on GitHub
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          For security reports, please email{" "}
          <a className="underline" href="mailto:security@sotsial.com">
            security@sotsial.com
          </a>{" "}
          instead — see the{" "}
          <a className="underline" href="/security">
            security policy
          </a>
          .
        </CardContent>
      </Card>
    </div>
  );
}
