// UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function SettingsPage() {
	return (
		<div>
			<PageHeading title="Settings" description="Manage account settings.">
				<Button color="dark/white" href="/settings/credentials">
					Manage Credentials
				</Button>
			</PageHeading>
			<Card
				title="Coming soon!"
				description="We’re working on it—check back soon."
			/>
			<Divider className="my-6" soft />
		</div>
	);
}
