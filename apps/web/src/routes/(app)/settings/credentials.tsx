import { Badge } from "@sotsial/ui/components/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sotsial/ui/components/select";
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
import { createFileRoute } from "@tanstack/react-router";
import { IconWalletCard } from "nucleo-isometric";
import {
  IconPlusOutlineDuo18,
  IconTrashOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const PLATFORMS = [
  "facebook",
  "google",
  "instagram",
  "linkedin",
  "threads",
  "tiktok",
  "twitter",
  "youtube",
] as const;

const PLATFORM_LABELS: Record<(typeof PLATFORMS)[number], string> = {
  facebook: "Facebook",
  google: "Google",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  threads: "Threads",
  tiktok: "TikTok",
  twitter: "Twitter",
  youtube: "YouTube",
};

export const Route = createFileRoute("/(app)/settings/credentials")({
  component: CredentialsPage,
});

interface Credential {
  clientId: string;
  createdAt: string;
  id: string;
  platform: string;
}

const credentialsKey = ["credentials"] as const;

function CredentialsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: credentialsKey,
    queryFn: async () => {
      const res = await api.v1.credentials.$get({ query: {} });
      if (!res.ok) {
        throw new Error("Failed to load credentials");
      }
      const json = (await res.json()) as { data: Credential[] };
      return json.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.v1.credentials.$delete({ query: { id } });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    },
    onSuccess: () => {
      toast.success("Credential deleted");
      queryClient.invalidateQueries({ queryKey: credentialsKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <PageHeading
        actions={<CreateCredentialDialog />}
        description="OAuth client credentials for your brought-your-own provider apps."
        title="Credentials"
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
              <TableHead>Client ID</TableHead>
              <TableHead>Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((cred) => (
              <TableRow key={cred.id}>
                <TableCell>
                  <Badge variant="secondary">{cred.platform}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {cred.clientId}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(cred.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => deleteMutation.mutate(cred.id)}
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
              <IconWalletCard />
            </EmptyMedia>
            <EmptyTitle>No credentials yet</EmptyTitle>
            <EmptyDescription>
              Bring your own OAuth client ID and secret for a supported platform
              to publish under your own brand.
            </EmptyDescription>
          </EmptyHeader>
          <CreateCredentialDialog />
        </Empty>
      )}
    </div>
  );
}

function CreateCredentialDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<string>("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await api.v1.credentials.$post({
        json: {
          platform: platform as (typeof PLATFORMS)[number],
          clientId,
          clientSecret,
        },
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to create credential");
      }
    },
    onSuccess: () => {
      toast.success("Credential created");
      queryClient.invalidateQueries({ queryKey: credentialsKey });
      setOpen(false);
      setPlatform("");
      setClientId("");
      setClientSecret("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button>
            <IconPlusOutlineDuo18 strokeWidth={2} />
            New credential
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New OAuth credential</DialogTitle>
          <DialogDescription>
            Bring your own client id / secret for a supported platform.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <Field>
            <FieldLabel htmlFor="platform">Platform</FieldLabel>
            <Select
              items={PLATFORM_LABELS}
              onValueChange={(value) => setPlatform(value ?? "")}
              value={platform}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Choose a platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="client-id">Client ID</FieldLabel>
            <Input
              id="client-id"
              onChange={(e) => setClientId(e.target.value)}
              required
              value={clientId}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="client-secret">Client secret</FieldLabel>
            <Input
              id="client-secret"
              onChange={(e) => setClientSecret(e.target.value)}
              required
              type="password"
              value={clientSecret}
            />
          </Field>
          <DialogFooter>
            <Button
              disabled={
                createMutation.isPending ||
                !(platform && clientId && clientSecret)
              }
              type="submit"
            >
              {createMutation.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
