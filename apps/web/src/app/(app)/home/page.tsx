// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function Dashboard() {
	return (
		<div>
			<PageHeading
				title="Dashboard"
				description="An overview of your account."
			/>
			<Card
				title="Overviews, insights, and more."
				description="We’re working hard to bring these features to you."
			/>
			<Divider className="my-6" soft />
		</div>
	);
}
