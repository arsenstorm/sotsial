import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@sotsial/ui/components/alert-dialog";
import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@sotsial/ui/components/description-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sotsial/ui/components/dialog";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { PageSubheading } from "@sotsial/ui/components/page-subheading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@sotsial/ui/components/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { authClient, sessionQuery } from "@/lib/auth";
import type { Theme } from "@/lib/theme";

export const Route = createFileRoute("/(app)/settings/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(sessionQuery),
  component: AccountPage,
});

const THEME_ITEMS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
};

interface SessionUser {
  email: string;
  id: string;
  name: string;
  twoFactorEnabled?: boolean | null;
}

function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = Route.useLoaderData();
  const user = session?.user as SessionUser | undefined;
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.name ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
  }, [user?.name]);

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

  const refreshSession = async () => {
    queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
    await queryClient.fetchQuery(sessionQuery);
    await router.invalidate();
  };

  const deleteMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await authClient.deleteUser({ password });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to delete account");
      }
    },
    onSuccess: async () => {
      toast.success("Account deleted");
      await refreshSession();
      router.navigate({ to: "/sign-in" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const onSignOut = async () => {
    await authClient.signOut();
    await refreshSession();
    router.navigate({ to: "/sign-in" });
  };

  return (
    <div className="space-y-8">
      <PageHeading
        description="Your personal profile and session."
        title="Account"
      />
      <section className="space-y-4">
        <PageSubheading title="Profile" />
        <DescriptionList>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>{user?.email}</DescriptionDetails>
          <DescriptionTerm>User ID</DescriptionTerm>
          <DescriptionDetails className="font-mono text-xs">
            {user?.id}
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
            disabled={updateMutation.isPending || name === user?.name}
            type="submit"
          >
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Preferences" />
        <Field className="max-w-xs">
          <FieldLabel htmlFor="theme">Theme</FieldLabel>
          <Select
            items={THEME_ITEMS}
            onValueChange={(value) => setTheme((value ?? "light") as Theme)}
            value={theme}
          >
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="space-y-6">
        <PageSubheading title="Security" />
        <ChangePasswordForm />
        <ChangeEmailForm currentEmail={user?.email ?? ""} />
        <TwoFactorPanel enabled={user?.twoFactorEnabled === true} />
      </section>

      <section className="space-y-4">
        <PageSubheading title="Session" />
        <Button onClick={onSignOut} variant="destructive">
          Sign out
        </Button>
      </section>

      <section className="space-y-4">
        <PageSubheading title="Danger zone" />
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button disabled={deleteMutation.isPending} variant="destructive">
                {deleteMutation.isPending ? "Deleting…" : "Delete account"}
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes your user record, sessions, and all memberships.
                Organizations you solely own will be orphaned. This cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <DeleteAccountConfirm
              onConfirm={(password) => deleteMutation.mutate(password)}
              pending={deleteMutation.isPending}
            />
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}

function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const changePassword = useMutation({
    mutationFn: async () => {
      const res = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to change password");
      }
    },
    onSuccess: () => {
      toast.success("Password updated");
      setCurrent("");
      setNext("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-3">
      <p className="font-medium text-sm">Change password</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          changePassword.mutate();
        }}
      >
        <Field>
          <FieldLabel htmlFor="current-password">Current password</FieldLabel>
          <Input
            autoComplete="current-password"
            id="current-password"
            onChange={(e) => setCurrent(e.target.value)}
            required
            type="password"
            value={current}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <Input
            autoComplete="new-password"
            id="new-password"
            minLength={8}
            onChange={(e) => setNext(e.target.value)}
            required
            type="password"
            value={next}
          />
        </Field>
        <Button
          disabled={changePassword.isPending || !(current && next)}
          type="submit"
        >
          {changePassword.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}

function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState("");

  const changeEmail = useMutation({
    mutationFn: async () => {
      const res = await authClient.changeEmail({
        newEmail,
        callbackURL: "/settings",
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to change email");
      }
    },
    onSuccess: () => {
      toast.success(
        "Verification email sent. Click the link to confirm the change."
      );
      setNewEmail("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-3">
      <p className="font-medium text-sm">Change email</p>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          changeEmail.mutate();
        }}
      >
        <Field>
          <FieldLabel htmlFor="new-email">
            New email (current: {currentEmail})
          </FieldLabel>
          <Input
            autoComplete="email"
            id="new-email"
            onChange={(e) => setNewEmail(e.target.value)}
            required
            type="email"
            value={newEmail}
          />
        </Field>
        <Button
          disabled={
            changeEmail.isPending || !newEmail || newEmail === currentEmail
          }
          type="submit"
        >
          {changeEmail.isPending ? "Sending…" : "Send verification"}
        </Button>
      </form>
    </div>
  );
}

function TwoFactorPanel({ enabled }: { enabled: boolean }) {
  return (
    <div className="flex flex-wrap items-start gap-4 rounded-xl border border-border bg-card p-5">
      <div className="min-w-[16rem] flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">Two-factor authentication</p>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Not set up"}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm leading-6">
          {enabled
            ? "You'll need your authenticator app to sign in on new devices."
            : "Add an extra step at sign-in via an authenticator app (TOTP)."}
        </p>
      </div>
      {enabled ? <DisableTwoFactorButton /> : <EnableTwoFactorButton />}
    </div>
  );
}

function EnableTwoFactorButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const start = useMutation({
    mutationFn: async () => {
      const res = await authClient.twoFactor.enable({ password });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to start 2FA setup");
      }
      return res.data;
    },
    onSuccess: (data) => {
      setTotpUri(data?.totpURI ?? null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const verify = useMutation({
    mutationFn: async () => {
      const res = await authClient.twoFactor.verifyTotp({ code });
      if (res.error) {
        throw new Error(res.error.message ?? "Invalid code");
      }
    },
    onSuccess: () => {
      toast.success("Two-factor authentication enabled");
      setOpen(false);
      setPassword("");
      setCode("");
      setTotpUri(null);
      queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPassword("");
          setCode("");
          setTotpUri(null);
        }
      }}
      open={open}
    >
      <Button onClick={() => setOpen(true)}>Enable 2FA</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable two-factor authentication</DialogTitle>
          <DialogDescription>
            {totpUri
              ? "Scan the QR below with your authenticator app, then enter the 6-digit code it generates."
              : "Confirm your password to begin setup."}
          </DialogDescription>
        </DialogHeader>

        {totpUri ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              verify.mutate();
            }}
          >
            <div className="flex justify-center">
              <img
                alt="2FA QR code"
                className="size-48 rounded-lg border border-border bg-white p-2"
                height={192}
                src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(totpUri)}`}
                width={192}
              />
            </div>
            <p className="break-all rounded-md bg-muted p-3 font-mono text-xs">
              {totpUri}
            </p>
            <Field>
              <FieldLabel htmlFor="totp-code">Verification code</FieldLabel>
              <Input
                autoComplete="one-time-code"
                id="totp-code"
                inputMode="numeric"
                onChange={(e) => setCode(e.target.value)}
                pattern="[0-9]{6}"
                required
                value={code}
              />
            </Field>
            <DialogFooter>
              <Button disabled={verify.isPending || !code} type="submit">
                {verify.isPending ? "Verifying…" : "Verify and enable"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              start.mutate();
            }}
          >
            <Field>
              <FieldLabel htmlFor="2fa-password">Current password</FieldLabel>
              <Input
                autoComplete="current-password"
                id="2fa-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </Field>
            <DialogFooter>
              <Button disabled={start.isPending || !password} type="submit">
                {start.isPending ? "Starting…" : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DisableTwoFactorButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const disable = useMutation({
    mutationFn: async () => {
      const res = await authClient.twoFactor.disable({ password });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to disable 2FA");
      }
    },
    onSuccess: () => {
      toast.success("Two-factor authentication disabled");
      setOpen(false);
      setPassword("");
      queryClient.invalidateQueries({ queryKey: sessionQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Dialog
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPassword("");
        }
      }}
      open={open}
    >
      <Button onClick={() => setOpen(true)} variant="outline">
        Disable 2FA
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable two-factor authentication</DialogTitle>
          <DialogDescription>
            Confirm your password to turn off 2FA.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            disable.mutate();
          }}
        >
          <Field>
            <FieldLabel htmlFor="disable-password">Password</FieldLabel>
            <Input
              autoComplete="current-password"
              id="disable-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
          </Field>
          <DialogFooter>
            <Button
              disabled={disable.isPending || !password}
              type="submit"
              variant="destructive"
            >
              {disable.isPending ? "Disabling…" : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAccountConfirm({
  onConfirm,
  pending,
}: {
  onConfirm: (password: string) => void;
  pending: boolean;
}) {
  const [password, setPassword] = useState("");

  return (
    <>
      <Field>
        <FieldLabel htmlFor="delete-password">
          Confirm with your password
        </FieldLabel>
        <Input
          autoComplete="current-password"
          id="delete-password"
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          value={password}
        />
      </Field>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onConfirm(password)}
          render={
            <Button disabled={pending || !password} variant="destructive">
              {pending ? "Deleting…" : "Delete account"}
            </Button>
          }
        />
      </AlertDialogFooter>
    </>
  );
}
