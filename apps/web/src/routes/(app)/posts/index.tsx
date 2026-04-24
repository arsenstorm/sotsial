import { Edit02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@sotsial/ui/components/button";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/posts/")({
  component: PostsListPage,
});

function PostsListPage() {
  const posts: unknown[] = [];

  return (
    <div className="space-y-6">
      <PageHeading
        actions={
          <Button render={<Link to="/posts/create" />}>
            <HugeiconsIcon icon={PlusSignIcon} />
            New post
          </Button>
        }
        description="Content you've published through Sotsial."
        title="Posts"
      />

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <HugeiconsIcon className="size-5" icon={Edit02Icon} />
          </span>
          <p className="font-medium text-sm">No posts yet</p>
          <p className="max-w-[44ch] text-muted-foreground text-sm">
            Publish your first post to every connected platform at once.
          </p>
          <Button render={<Link to="/posts/create" />} size="sm">
            Create your first post
          </Button>
        </div>
      ) : null}
    </div>
  );
}
