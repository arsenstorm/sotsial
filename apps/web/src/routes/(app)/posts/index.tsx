import { Edit02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@sotsial/ui/components/empty";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { Skeleton } from "@sotsial/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@sotsial/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/posts/")({
  component: PostsListPage,
});

interface PostResult {
  error?: { message?: string } | null;
  platform?: string;
  success?: boolean;
}

interface PostRow {
  createdAt: string | Date;
  id: string;
  media: unknown;
  platformSettings: unknown;
  results: PostResult[] | null;
  targets: string[];
  text: string | null;
}

const postsKey = ["posts"] as const;

function PostsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: postsKey,
    queryFn: async () => {
      const res = await api.v1.posts.$get({ query: { page: 1, limit: 50 } });
      if (!res.ok) {
        throw new Error("Failed to load posts");
      }
      const json = (await res.json()) as { data: PostRow[] };
      return json.data;
    },
  });

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

      {isLoading ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-72 max-w-full" />
          </EmptyHeader>
          <Skeleton className="h-8 w-36 rounded-full" />
        </Empty>
      ) : // biome-ignore lint/style/noNestedTernary: loading/data/empty render pattern
      data && data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Published</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((post) => (
              <PostRowItem key={post.id} post={post} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Edit02Icon} />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>
              Publish your first post to every connected platform at once.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/posts/create" />} size="sm">
            Create your first post
          </Button>
        </Empty>
      )}
    </div>
  );
}

function PostRowItem({ post }: { post: PostRow }) {
  const platforms = Array.from(
    new Set(post.targets.map((t) => t.split(":")[0]).filter(Boolean))
  );
  const results = post.results ?? [];
  const successes = results.filter((r) => r.success).length;
  const failures = results.filter((r) => r.success === false).length;

  let status: "Success" | "Failed" | "Partial" | "—" = "—";
  if (results.length > 0) {
    if (failures === 0) {
      status = "Success";
    } else if (successes === 0) {
      status = "Failed";
    } else {
      status = "Partial";
    }
  }

  let statusVariant: "default" | "destructive" | "secondary" = "secondary";
  if (status === "Success") {
    statusVariant = "default";
  } else if (status === "Failed") {
    statusVariant = "destructive";
  }

  let preview = "—";
  if (post.text) {
    preview = post.text.length > 80 ? `${post.text.slice(0, 80)}…` : post.text;
  }

  return (
    <TableRow>
      <TableCell className="text-muted-foreground text-xs">
        {new Date(post.createdAt).toLocaleString()}
      </TableCell>
      <TableCell className="max-w-[32ch] truncate">{preview}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {platforms.length > 0
            ? platforms.map((p) => (
                <Badge key={p} variant="secondary">
                  {p}
                </Badge>
              ))
            : "—"}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant}>{status}</Badge>
      </TableCell>
    </TableRow>
  );
}
