// Components

import ConnectAccount, {
  ConnectAccountButton,
} from "@/components/connect-account";
import { Badge } from "@/components/ui/badge";

// UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading, PageSubheading } from "@/components/ui/page-heading";
import { platformDetails } from "@/config/platform-details";
// Config
import type { SupportedPlatforms } from "@/config/platforms";

export default async function Integrations() {
  return (
    <div>
      <PageHeading
        description="Here's a list of all integrations available."
        title="Integrations"
      >
        <Button color="dark/white" disabled>
          Manage Credentials
        </Button>
      </PageHeading>
      <ConnectAccount />
      <Card
        cta="Take me there"
        description="You can find the list of connected accounts on the connections page."
        href="/connections"
        title="Looking to manage existing connections?"
      />
      <Divider className="my-6" soft />
      <div className="flex flex-col gap-8">
        <AvailableIntegrations />
        <UnsupportedIntegrations />
      </div>
    </div>
  );
}

function AvailableIntegrations() {
  const availablePlatforms = Object.entries(platformDetails).filter(
    ([_, platform]) => platform.supported
  );

  return (
    <div>
      <PageSubheading
        description="You can connect any of these platforms to your account."
        title={`Available integrations (${availablePlatforms.length})`}
      >
        <Badge color="lime">Available now</Badge>
      </PageSubheading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {availablePlatforms.map(([key, platform]) => (
          <Integration key={key} platform={platform} platformId={key} />
        ))}
      </div>
    </div>
  );
}

function UnsupportedIntegrations() {
  const unsupportedPlatforms = Object.entries(platformDetails).filter(
    ([_, platform]) => !platform.supported
  );

  return (
    <div>
      <PageSubheading
        description="We are working on adding support for these platforms."
        title={`Integrations coming soon (${unsupportedPlatforms.length})`}
      >
        <Badge color="violet">Coming soon</Badge>
      </PageSubheading>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {unsupportedPlatforms.map(([key, platform]) => (
          <Integration key={key} platform={platform} platformId={key} />
        ))}
      </div>
    </div>
  );
}

function Integration({
  platform,
  platformId,
}: {
  readonly platform: (typeof platformDetails)[keyof typeof platformDetails];
  readonly platformId: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center gap-2">
        <platform.logo className="size-5" />
        <p className="font-medium text-sm">{platform.name}</p>
      </div>
      <div className="mt-auto">
        <ConnectAccountButton
          className="mt-2 w-full text-sm"
          disabled={!platform.supported}
          platform={platformId as SupportedPlatforms}
        />
      </div>
    </div>
  );
}
