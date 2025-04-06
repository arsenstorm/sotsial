// Components
import { Button } from "@/components/ui/button";
import { ConnectionsList } from "./page.client";

// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default async function Connections() {
	return (
		<div>
			<PageHeading
				title="Connections"
				description="Here’s a list of all accounts connected to your account."
			>
				<Button color="dark/white" href="/posting">
					Post to an account
				</Button>
			</PageHeading>
			<Card
				title="Looking to connect another account?"
				description="You can find the list of available integrations on the integrations page."
				cta="Go to integrations"
				href="/integrations"
			/>
			<Divider className="my-6" soft />
			<div className="flex flex-col gap-4">
				<ConnectionsList />
			</div>
		</div>
	);
}
