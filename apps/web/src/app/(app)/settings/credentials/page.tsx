// UI
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function CredentialsPage() {
	return (
		<div>
			<PageHeading
				title="Credentials"
				description="Manage your custom social media OAuth clients."
			>
				<Button color="dark/white" href="/settings">
					Return to settings
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
