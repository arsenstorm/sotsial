import { Delete02Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";
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
import { Input } from "@sotsial/ui/components/input";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/connections")({
  component: ConnectionsPage,
});

interface ConnectionRow {
  account: { name?: string; username?: string; avatar?: string } | null;
  account_id: string;
  created_at: string;
  credential: string | null;
  expiry: string | null;
  id: string;
  platform: string;
  tags: string[];
}

const connectionsKey = ["connections"] as const;

function ConnectionsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [...connectionsKey, { query }],
    queryFn: async () => {
      const res = await api.v1.connections.$get({
        query: { query: query || undefined, page: 1, limit: 50 },
      });
      if (!res.ok) {
        throw new Error("Failed to load connections");
      }
      const json = (await res.json()) as { data: ConnectionRow[] };
      return json.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.v1.connections.$delete({ query: { id } });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    },
    onSuccess: () => {
      toast.success("Connection removed");
      queryClient.invalidateQueries({ queryKey: connectionsKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeading
        description="Social accounts linked to this organization."
        title="Connections"
      />
      <Input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by name or username"
        value={query}
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
              <TableHead>Platform</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Connected</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Badge variant="secondary">{row.platform}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{row.account?.name ?? "—"}</span>
                    {row.account?.username ? (
                      <span className="text-muted-foreground text-xs">
                        @{row.account.username}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.tags.length > 0
                      ? row.tags.map((t) => (
                          <Badge key={t} variant="secondary">
                            {t}
                          </Badge>
                        ))
                      : "—"}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(row.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => deleteMutation.mutate(row.id)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <HugeiconsIcon icon={Delete02Icon} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={LinkSquare02Icon} />
            </EmptyMedia>
            <EmptyTitle>No connections yet</EmptyTitle>
            <EmptyDescription>
              Link a social account to start publishing through Sotsial.
            </EmptyDescription>
          </EmptyHeader>
          <Button render={<Link to="/settings/integrations" />} size="sm">
            Connect an account
          </Button>
        </Empty>
      )}
    </div>
  );
}
