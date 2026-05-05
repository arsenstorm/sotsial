import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient, sessionQuery } from "@/lib/auth";

const searchSchema = z.object({
  next: z.string().optional(),
});

export const Route = createFileRoute("/(auth)/sign-in")({
  validateSearch: searchSchema,
  component: SignInPage,
});

function SignInPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { next } = Route.useSearch();
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setPending(true);

    const { error } = await authClient.signIn.email({ email, password });

    setPending(false);

    if (error) {
      toast.error(error.message ?? "Sign-in failed");
      return;
    }

    queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
    await queryClient.fetchQuery(sessionQuery);
    await router.invalidate();
    router.navigate({ to: next ?? "/dashboard" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back to Sotsial.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            required
            type="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            required
            type="password"
          />
        </Field>
        <Button className="w-full" disabled={pending} type="submit">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="text-center text-muted-foreground text-sm">
        Don't have an account?{" "}
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/sign-up"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
