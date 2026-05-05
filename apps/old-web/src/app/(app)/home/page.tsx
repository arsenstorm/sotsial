// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function Dashboard() {
  return (
    <div>
      <PageHeading
        description="An overview of your account."
        title="Dashboard"
      />
      <Card
        description="We’re working hard to bring these features to you."
        title="Overviews, insights, and more."
      />
      <Divider className="my-6" soft />
    </div>
  );
}
