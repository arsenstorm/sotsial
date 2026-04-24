// UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function CredentialsPage() {
  return (
    <div>
      <PageHeading
        description="Manage your custom social media OAuth clients."
        title="Credentials"
      >
        <Button color="dark/white" href="/settings">
          Return to settings
        </Button>
      </PageHeading>
      <Card
        description="We’re working on it—check back soon."
        title="Coming soon!"
      />
      <Divider className="my-6" soft />
    </div>
  );
}
