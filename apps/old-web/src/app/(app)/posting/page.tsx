// Components

// UI
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { PageHeading } from "@/components/ui/page-heading";
import { PostingForm } from "./page.client";

export default async function Posting() {
  return (
    <div>
      <PageHeading
        description="Easily publish content to multiple platforms at once."
        title="Create Post"
      />
      <Card
        cta="Go to connections"
        description="You can add more connections from the connections page."
        href="/connections"
        title="Need to connect more accounts?"
      />
      <Divider className="my-6" soft />
      <div className="mt-4 flex flex-col gap-4">
        <PostingForm />
      </div>
    </div>
  );
}
