import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setPending(true);

    const { error } = await authClient.signUp.email({ email, password, name });

    setPending(false);

    if (error) {
      toast.error(error.message ?? "Sign-up failed");
      return;
    }

    await router.invalidate();
    router.navigate({ to: "/onboarding" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Get started with Sotsial in minutes.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input autoComplete="name" id="name" name="name" required />
        </Field>
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
            autoComplete="new-password"
            id="password"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </Field>
        <Button className="w-full" disabled={pending} type="submit">
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="font-medium text-foreground underline-offset-4 hover:underline"
          to="/sign-in"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
