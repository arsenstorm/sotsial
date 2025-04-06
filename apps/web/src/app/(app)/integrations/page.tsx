// Components
import { Badge } from "@/components/ui/badge";
import ConnectAccount, {
	ConnectAccountButton,
} from "@/components/connect-account";

// UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading, PageSubheading } from "@/components/ui/page-heading";

// Config
import type { SupportedPlatforms } from "@/config/platforms";
import { platformDetails } from "@/config/platform-details";

export default async function Integrations() {
	return (
		<div>
			<PageHeading
				title="Integrations"
				description="Here's a list of all integrations available."
			>
				<Button color="dark/white" disabled>
					Manage Credentials
				</Button>
			</PageHeading>
			<ConnectAccount />
			<Card
				title="Looking to manage existing connections?"
				description="You can find the list of connected accounts on the connections page."
				cta="Take me there"
				href="/connections"
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
		([_, platform]) => platform.supported,
	);

	return (
		<div>
			<PageSubheading
				title={`Available integrations (${availablePlatforms.length})`}
				description="You can connect any of these platforms to your account."
			>
				<Badge color="lime">Available now</Badge>
			</PageSubheading>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{availablePlatforms.map(([key, platform]) => {
					return <Integration key={key} platform={platform} platformId={key} />;
				})}
			</div>
		</div>
	);
}

function UnsupportedIntegrations() {
	const unsupportedPlatforms = Object.entries(platformDetails).filter(
		([_, platform]) => !platform.supported,
	);

	return (
		<div>
			<PageSubheading
				title={`Integrations coming soon (${unsupportedPlatforms.length})`}
				description="We are working on adding support for these platforms."
			>
				<Badge color="violet">Coming soon</Badge>
			</PageSubheading>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{unsupportedPlatforms.map(([key, platform]) => {
					return <Integration key={key} platform={platform} platformId={key} />;
				})}
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
		<div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 flex flex-col h-full">
			<div className="flex items-center gap-2 mb-2">
				<platform.logo className="size-5" />
				<p className="font-medium text-sm">{platform.name}</p>
			</div>
			<div className="mt-auto">
				<ConnectAccountButton
					className="w-full mt-2 text-sm"
					disabled={!platform.supported}
					platform={platformId as SupportedPlatforms}
				/>
			</div>
		</div>
	);
}
