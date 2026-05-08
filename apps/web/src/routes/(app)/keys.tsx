import { Button } from "@sotsial/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@sotsial/ui/components/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@sotsial/ui/components/empty";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IconShield } from "nucleo-isometric";
import {
  IconChevronRightOutlineDuo18,
  IconPlusOutlineDuo18,
  IconTrashOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/keys")({
  component: KeysPage,
});

const keysQueryKey = ["apikeys"] as const;

interface KeyRow {
  createdAt: string | Date;
  enabled: boolean;
  expiresAt: string | Date | null;
  id: string;
  name: string | null;
  prefix: string | null;
  start: string | null;
}

function KeysPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: keysQueryKey,
    queryFn: async () => {
      const result = await authClient.apiKey.list();
      if (result.error) {
        throw new Error(result.error.message ?? "Failed to load keys");
      }
      const payload = (result.data ?? { apiKeys: [] }) as {
        apiKeys: KeyRow[];
      };
      return payload.apiKeys ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await authClient.apiKey.delete({ keyId });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to delete");
      }
    },
    onSuccess: () => {
      toast.success("Key deleted");
      queryClient.invalidateQueries({ queryKey: keysQueryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeading
        actions={<CreateKeyDialog />}
        description="Programmatic access for your organization."
        title="API keys"
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
              <TableHead>Name</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((k) => (
              <TableRow key={k.id}>
                <TableCell>{k.name ?? "Untitled"}</TableCell>
                <TableCell className="font-mono text-xs">
                  {k.start ?? k.prefix ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(k.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {k.expiresAt
                    ? new Date(k.expiresAt).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell className="flex items-center justify-end gap-1">
                  <Button
                    render={<Link params={{ id: k.id }} to="/keys/$id" />}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <IconChevronRightOutlineDuo18 strokeWidth={2} />
                  </Button>
                  <Button
                    onClick={() => deleteMutation.mutate(k.id)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <IconTrashOutlineDuo18 strokeWidth={2} />
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
              <IconShield strokeWidth={2} />
            </EmptyMedia>
            <EmptyTitle>No API keys yet</EmptyTitle>
            <EmptyDescription>
              Create a key to call the Sotsial API from your own code or
              integrations. Keys inherit access from this organization.
            </EmptyDescription>
          </EmptyHeader>
          <CreateKeyDialog />
        </Empty>
      )}
    </div>
  );
}

function CreateKeyDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.apiKey.create({ name });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to create key");
      }
      return res.data;
    },
    onSuccess: (key) => {
      toast.success("Key created");
      queryClient.invalidateQueries({ queryKey: keysQueryKey });
      setCreatedKey(key?.key ?? null);
      setName("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setCreatedKey(null);
        }
      }}
      open={open}
    >
      <DialogTrigger
        render={
          <Button>
            <IconPlusOutlineDuo18 strokeWidth={2} />
            New key
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {createdKey ? "Save your API key" : "New API key"}
          </DialogTitle>
          <DialogDescription>
            {createdKey
              ? "This is the only time the secret will be shown. Copy it now."
              : "Keys inherit access from your current organization."}
          </DialogDescription>
        </DialogHeader>
        {createdKey ? (
          <div className="space-y-3">
            <code className="block break-all rounded-md bg-muted p-3 font-mono text-xs">
              {createdKey}
            </code>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
          >
            <Field>
              <FieldLabel htmlFor="key-name">Name</FieldLabel>
              <Input
                id="key-name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Production"
                required
                value={name}
              />
            </Field>
            <DialogFooter>
              <Button
                disabled={createMutation.isPending || !name}
                type="submit"
              >
                {createMutation.isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
