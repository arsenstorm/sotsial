// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function HelpPage() {
	return (
		<div>
			<PageHeading title="Help" description="Get help with Sotsial." />
			<Card
				title="We don’t have a help center yet."
				description="You can get in touch directly at help@sotsial.com or create an issue on GitHub."
			/>
			<Divider className="my-6" soft />
		</div>
	);
}
