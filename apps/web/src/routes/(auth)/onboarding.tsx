import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sotsial/ui/components/tabs";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient, sessionQuery } from "@/lib/auth";

const searchSchema = z.object({
  invite: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/onboarding")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(sessionQuery);

    if (!session?.user) {
      throw redirect({ to: "/sign-in" });
    }

    if (session.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: OnboardingPage,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function OnboardingPage() {
  const router = useRouter();
  const { invite } = Route.useSearch();

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Set up your organization
        </h1>
        <p className="text-muted-foreground text-sm">
          Create one or join an existing team.
        </p>
      </div>
      <Tabs defaultValue={invite ? "accept" : "create"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="accept">Accept invite</TabsTrigger>
        </TabsList>
        <TabsContent className="pt-4" value="create">
          <CreateOrgForm
            onDone={async () => {
              await router.invalidate();
              router.navigate({ to: "/dashboard" });
            }}
          />
        </TabsContent>
        <TabsContent className="pt-4" value="accept">
          <AcceptInviteForm
            defaultInviteId={invite}
            onDone={async () => {
              await router.invalidate();
              router.navigate({ to: "/dashboard" });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CreateOrgForm({ onDone }: { onDone: () => Promise<void> }) {
  const [pending, setPending] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPending(true);

    const finalSlug = slug || slugify(name);
    const result = await authClient.organization.create({
      name,
      slug: finalSlug,
    });

    if (result.error) {
      setPending(false);
      toast.error(result.error.message ?? "Failed to create organization");
      return;
    }

    const orgId = result.data?.id;

    if (orgId) {
      await authClient.organization.setActive({ organizationId: orgId });
    }

    setPending(false);
    await onDone();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field>
        <FieldLabel htmlFor="org-name">Organization name</FieldLabel>
        <Input
          id="org-name"
          onChange={(e) => setName(e.target.value)}
          required
          value={name}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="org-slug">URL slug</FieldLabel>
        <Input
          id="org-slug"
          onChange={(e) => setSlug(e.target.value)}
          placeholder={slugify(name) || "my-org"}
          value={slug}
        />
      </Field>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Creating…" : "Create organization"}
      </Button>
    </form>
  );
}

function AcceptInviteForm({
  defaultInviteId,
  onDone,
}: {
  defaultInviteId?: string;
  onDone: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [inviteId, setInviteId] = useState(defaultInviteId ?? "");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPending(true);
    const result = await authClient.organization.acceptInvitation({
      invitationId: inviteId,
    });
    setPending(false);

    if (result.error) {
      toast.error(result.error.message ?? "Could not accept invite");
      return;
    }

    await onDone();
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field>
        <FieldLabel htmlFor="invite-id">Invitation id</FieldLabel>
        <Input
          id="invite-id"
          onChange={(e) => setInviteId(e.target.value)}
          placeholder="inv_…"
          required
          value={inviteId}
        />
      </Field>
      <Button className="w-full" disabled={pending || !inviteId} type="submit">
        {pending ? "Accepting…" : "Accept invite"}
      </Button>
    </form>
  );
}
