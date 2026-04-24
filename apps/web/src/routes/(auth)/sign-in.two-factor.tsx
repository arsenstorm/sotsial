import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/(auth)/sign-in/two-factor")({
  component: TwoFactorChallengePage,
});

function TwoFactorChallengePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);
  const [useBackup, setUseBackup] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get("code") ?? "").trim();

    setPending(true);

    const result = useBackup
      ? await authClient.twoFactor.verifyBackupCode({ code })
      : await authClient.twoFactor.verifyTotp({ code });

    setPending(false);

    if (result.error) {
      toast.error(result.error.message ?? "Invalid code");
      return;
    }

    queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
    await queryClient.fetchQuery(sessionQuery);
    await router.invalidate();
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">
          Two-factor verification
        </h1>
        <p className="text-muted-foreground text-sm">
          {useBackup
            ? "Enter one of the backup codes you saved when setting up 2FA."
            : "Open your authenticator app and enter the 6-digit code."}
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field>
          <FieldLabel htmlFor="code">
            {useBackup ? "Backup code" : "Authenticator code"}
          </FieldLabel>
          <Input
            autoComplete="one-time-code"
            id="code"
            inputMode={useBackup ? "text" : "numeric"}
            name="code"
            pattern={useBackup ? undefined : "[0-9]{6}"}
            required
          />
        </Field>
        <Button className="w-full" disabled={pending} type="submit">
          {pending ? "Verifying…" : "Verify"}
        </Button>
      </form>
      <p className="text-center text-muted-foreground text-sm">
        <button
          className="font-medium text-foreground underline-offset-4 hover:underline"
          onClick={() => setUseBackup((prev) => !prev)}
          type="button"
        >
          {useBackup ? "Use authenticator app" : "Use a backup code"}
        </button>
      </p>
    </div>
  );
}
