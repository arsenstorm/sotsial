import { Button } from "@sotsial/ui/components/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@sotsial/ui/components/description-list";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { PageSubheading } from "@sotsial/ui/components/page-subheading";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/settings/organization")({
  component: OrganizationPage,
});

function OrganizationPage() {
  const { data: org, refetch } = authClient.useActiveOrganization();
  const [name, setName] = useState(org?.name ?? "");
  const [slug, setSlug] = useState(org?.slug ?? "");

  useEffect(() => {
    setName(org?.name ?? "");
    setSlug(org?.slug ?? "");
  }, [org?.name, org?.slug]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!org) {
        return;
      }
      const res = await authClient.organization.update({
        organizationId: org.id,
        data: { name, slug },
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to update");
      }
    },
    onSuccess: () => {
      toast.success("Organization updated");
      refetch();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!org) {
        return;
      }
      // biome-ignore lint/suspicious/noAlert: destructive action requires explicit confirmation
      const ok = window.confirm(`Delete ${org.name}? This cannot be undone.`);
      if (!ok) {
        return;
      }
      const res = await authClient.organization.delete({
        organizationId: org.id,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to delete");
      }
    },
    onSuccess: () => {
      toast.success("Organization deleted");
      window.location.assign("/onboarding");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!org) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <PageSubheading title="Identity" />
        <DescriptionList>
          <DescriptionTerm>ID</DescriptionTerm>
          <DescriptionDetails className="font-mono text-xs">
            {org.id}
          </DescriptionDetails>
        </DescriptionList>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Details" />
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
        >
          <Field>
            <FieldLabel htmlFor="org-name">Name</FieldLabel>
            <Input
              id="org-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
            <Input
              id="org-slug"
              onChange={(e) => setSlug(e.target.value)}
              value={slug}
            />
          </Field>
          <Button
            disabled={
              updateMutation.isPending ||
              (name === org.name && slug === org.slug)
            }
            type="submit"
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </section>

      <section className="space-y-3">
        <PageSubheading title="Danger zone" />
        <Button
          disabled={deleteMutation.isPending}
          onClick={() => deleteMutation.mutate()}
          variant="destructive"
        >
          {deleteMutation.isPending ? "Deleting…" : "Delete organization"}
        </Button>
      </section>
    </div>
  );
}
