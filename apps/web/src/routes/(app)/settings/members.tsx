import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@sotsial/ui/components/badge";
import { Button } from "@sotsial/ui/components/button";
import { Empty } from "@sotsial/ui/components/empty";
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
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/(app)/settings/members")({
  component: MembersPage,
});

const ROLES = ["member", "admin", "owner"] as const;
type OrgRole = (typeof ROLES)[number];

const ROLE_LABELS: Record<OrgRole, string> = {
  member: "Member",
  admin: "Admin",
  owner: "Owner",
};

const membersKey = ["org-members"] as const;
const invitationsKey = ["org-invitations"] as const;

interface MemberRow {
  id: string;
  role: string;
  user: { id: string; name?: string | null; email: string };
}

interface InvitationRow {
  email: string;
  id: string;
  role: string | null;
  status: string;
}

function MembersPage() {
  const { data: org } = authClient.useActiveOrganization();
  const queryClient = useQueryClient();

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: membersKey,
    queryFn: async () => {
      const res = await authClient.organization.listMembers({});
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to load members");
      }
      return (res.data?.members ?? []) as unknown as MemberRow[];
    },
  });

  const { data: invitations } = useQuery({
    queryKey: invitationsKey,
    queryFn: async () => {
      if (!org) {
        return [] as InvitationRow[];
      }
      const res = await authClient.organization.listInvitations({
        query: { organizationId: org.id },
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to load invitations");
      }
      return (res.data ?? []) as unknown as InvitationRow[];
    },
    enabled: Boolean(org),
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to remove");
      }
    },
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: membersKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const cancelInvite = useMutation({
    mutationFn: async (invitationId: string) => {
      const res = await authClient.organization.cancelInvitation({
        invitationId,
      });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to cancel");
      }
    },
    onSuccess: () => {
      toast.success("Invitation cancelled");
      queryClient.invalidateQueries({ queryKey: invitationsKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <PageHeading
        description="People with access to this organization."
        title="Members"
      />
      <section className="space-y-4">
        <PageSubheading title="Members" />
        {membersLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : // biome-ignore lint/style/noNestedTernary: loading/data/empty render pattern
        members && members.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{m.user.name ?? m.user.email}</span>
                      <span className="text-muted-foreground text-xs">
                        {m.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{m.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => removeMember.mutate(m.id)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <HugeiconsIcon icon={Delete02Icon} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty>
            <p className="text-sm">No members yet.</p>
          </Empty>
        )}
      </section>

      <section className="space-y-4">
        <PageSubheading title="Invitations" />
        <InviteForm />
        {invitations && invitations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inv.role ?? "member"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.status === "pending" ? (
                      <Button
                        onClick={() => cancelInvite.mutate(inv.id)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-sm">
            No pending invitations.
          </p>
        )}
      </section>
    </div>
  );
}

function InviteForm() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrgRole>("member");

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.organization.inviteMember({ email, role });
      if (res.error) {
        throw new Error(res.error.message ?? "Failed to invite");
      }
    },
    onSuccess: () => {
      toast.success("Invitation sent");
      queryClient.invalidateQueries({ queryKey: invitationsKey });
      setEmail("");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        inviteMutation.mutate();
      }}
    >
      <Field className="min-w-[16rem] flex-1">
        <FieldLabel htmlFor="invite-email">Email</FieldLabel>
        <Input
          id="invite-email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </Field>
      <Field className="w-40">
        <FieldLabel htmlFor="invite-role">Role</FieldLabel>
        <Select
          items={ROLE_LABELS}
          onValueChange={(value) => setRole((value ?? "member") as OrgRole)}
          value={role}
        >
          <SelectTrigger id="invite-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Button disabled={inviteMutation.isPending || !email} type="submit">
        {inviteMutation.isPending ? "Sending…" : "Invite"}
      </Button>
    </form>
  );
}
