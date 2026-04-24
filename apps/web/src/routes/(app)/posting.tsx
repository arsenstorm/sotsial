import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
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
import { Textarea } from "@sotsial/ui/components/textarea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/posting")({
  component: PostingPage,
});

interface ConnectionRow {
  account: { name?: string; username?: string } | null;
  account_id: string;
  id: string;
  platform: string;
}

interface PublishResult {
  error?: { message?: string } | null;
  platform?: string;
  success?: boolean;
  [key: string]: unknown;
}

function PostingPage() {
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<PublishResult[] | null>(null);

  const { data: connections, isLoading } = useQuery({
    queryKey: ["connections", "all"],
    queryFn: async () => {
      const res = await api.v1.connections.$get({
        query: { page: 1, limit: 100 },
      });
      if (!res.ok) {
        throw new Error("Failed to load connections");
      }
      const json = (await res.json()) as { data: ConnectionRow[] };
      return json.data;
    },
  });

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await api.v1.publish.$post({
        json: {
          targets: Array.from(selectedIds),
          post: {
            text,
            ...(mediaUrl ? { media: [{ url: mediaUrl }] } : {}),
          },
        },
      });
      const json = (await res.json()) as
        | { results: PublishResult[] }
        | { error?: { message?: string } };
      if (!res.ok) {
        const err = (json as { error?: { message?: string } }).error;
        throw new Error(err?.message ?? "Publish failed");
      }
      return (json as { results: PublishResult[] }).results;
    },
    onSuccess: (r) => {
      setResults(r);
      toast.success("Published");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeading
        description="Publish to every connected platform at once."
        title="Posting"
      />

      <section className="space-y-3">
        <h2 className="font-medium text-sm">Accounts</h2>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : // biome-ignore lint/style/noNestedTernary: loading/data/empty render pattern
        connections && connections.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {connections.map((c) => {
              const active = selectedIds.has(c.id);
              return (
                <button
                  className={
                    active
                      ? "rounded-md border border-primary bg-primary/10 px-3 py-2 text-left text-sm"
                      : "rounded-md border border-border bg-background px-3 py-2 text-left text-sm hover:bg-muted"
                  }
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{c.platform}</Badge>
                    <span>{c.account?.name ?? c.account_id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No connections yet. Add one from Integrations.
          </p>
        )}
      </section>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          publishMutation.mutate();
        }}
      >
        <Field>
          <FieldLabel htmlFor="text">Text</FieldLabel>
          <Textarea
            id="text"
            onChange={(e) => setText(e.target.value)}
            required
            rows={6}
            value={text}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="media">Media URL (optional)</FieldLabel>
          <Input
            id="media"
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://…"
            value={mediaUrl}
          />
        </Field>
        <div className="flex items-center gap-3">
          <Button
            disabled={
              publishMutation.isPending || selectedIds.size === 0 || !text
            }
            type="submit"
          >
            {publishMutation.isPending ? "Publishing…" : "Publish"}
          </Button>
          <span className="text-muted-foreground text-xs">
            {selectedIds.size} account
            {selectedIds.size === 1 ? "" : "s"} selected
          </span>
        </div>
      </form>

      {results ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: render-only static result list
              <TableRow key={idx}>
                <TableCell>
                  <Badge variant="secondary">{r.platform ?? "—"}</Badge>
                </TableCell>
                <TableCell>
                  {r.success ? (
                    <Badge>Success</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {r.error?.message ?? JSON.stringify(r)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}
    </div>
  );
}
