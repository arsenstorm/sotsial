// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";

export default function BillingPage() {
  return (
    <div>
      <PageHeading
        description="Manage your billing information."
        title="Billing"
      />
      <Card
        description="Pricing will be announced soon."
        title="Sotsial is free while in beta."
      />
      <Divider className="my-6" soft />
    </div>
  );
}
