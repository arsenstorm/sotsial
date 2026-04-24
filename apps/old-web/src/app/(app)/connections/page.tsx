// Components
import { Button } from "@/components/ui/button";
// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";
import { ConnectionsList } from "./page.client";

export default async function Connections() {
  return (
    <div>
      <PageHeading
        description="Here’s a list of all accounts connected to your account."
        title="Connections"
      >
        <Button color="dark/white" href="/posting">
          Post to an account
        </Button>
      </PageHeading>
      <Card
        cta="Go to integrations"
        description="You can find the list of available integrations on the integrations page."
        href="/integrations"
        title="Looking to connect another account?"
      />
      <Divider className="my-6" soft />
      <div className="flex flex-col gap-4">
        <ConnectionsList />
      </div>
    </div>
  );
}
