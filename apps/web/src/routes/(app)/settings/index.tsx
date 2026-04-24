import { Button } from "@sotsial/ui/components/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@sotsial/ui/components/description-list";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { PageSubheading } from "@sotsial/ui/components/page-subheading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient, sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/(app)/settings/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(sessionQuery),
  component: AccountPage,
});

function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = Route.useLoaderData();
  const [name, setName] = useState(session?.user.name ?? "");

  useEffect(() => {
    setName(session?.user.name ?? "");
  }, [session?.user.name]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.updateUser({ name });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to update");
      }
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSignOut = async () => {
    await authClient.signOut();
    await router.invalidate();
    router.navigate({ to: "/sign-in" });
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <PageSubheading title="Profile" />
        <DescriptionList>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{session?.user.email}</DescriptionDetails>
          <DescriptionTerm>User ID</DescriptionTerm>
          <DescriptionDetails className="font-mono text-xs">
            {session?.user.id}
          </DescriptionDetails>
        </DescriptionList>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Display name" />
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
        >
          <Field>
            <FieldLabel htmlFor="display-name">Name</FieldLabel>
            <Input
              id="display-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Field>
          <Button
            disabled={updateMutation.isPending || name === session?.user.name}
            type="submit"
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Session" />
        <Button onClick={onSignOut} variant="destructive">
          Sign out
        </Button>
      </section>
    </div>
  );
}
