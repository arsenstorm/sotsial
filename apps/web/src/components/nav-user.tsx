import { Avatar, AvatarFallback } from "@sotsial/ui/components/avatar";
import { Button } from "@sotsial/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sotsial/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@sotsial/ui/components/dropdown-menu";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@sotsial/ui/components/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  IconCheckOutlineDuo18,
  IconExitDoorOutlineDuo18,
  IconGearOutlineDuo18,
  IconOfficeOutlineDuo18,
  IconPlusOutlineDuo18,
  IconSortArrowsOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { useState } from "react";
import { toast } from "sonner";
import { authClient, sessionQuery } from "@/lib/auth";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function NavUser({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const { data: orgs } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [createOpen, setCreateOpen] = useState(false);

  const initials = (name || email)
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const refreshSession = async () => {
    queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
    await queryClient.fetchQuery(sessionQuery);
    await router.invalidate();
  };

  const onSelectOrg = async (organizationId: string) => {
    if (organizationId === activeOrg?.id) {
      return;
    }
    const { error } = await authClient.organization.setActive({
      organizationId,
    });
    if (error) {
      toast.error(error.message ?? "Failed to switch organization");
      return;
    }
    await refreshSession();
  };

  const onSignOut = async () => {
    await authClient.signOut();
    await refreshSession();
    router.navigate({ to: "/sign-in" });
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  className="aria-expanded:bg-muted aria-expanded:text-foreground"
                  size="lg"
                />
              }
            >
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name || email}</span>
                <span className="truncate text-muted-foreground text-xs">
                  {activeOrg?.name ?? email}
                </span>
              </div>
              <IconSortArrowsOutlineDuo18
                className="ml-auto size-4"
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {name || email}
                      </span>
                      <span className="truncate text-muted-foreground text-xs">
                        {email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconOfficeOutlineDuo18 strokeWidth={2} />
                    <span className="flex-1 truncate">
                      {activeOrg?.name ?? "No organization"}
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
                        Switch organization
                      </DropdownMenuLabel>
                      {orgs?.map((org) => {
                        const isActive = org.id === activeOrg?.id;
                        return (
                          <DropdownMenuItem
                            key={org.id}
                            onClick={() => onSelectOrg(org.id)}
                          >
                            <span className="flex-1 truncate">{org.name}</span>
                            {isActive ? (
                              <IconCheckOutlineDuo18
                                className="size-4 text-muted-foreground"
                                strokeWidth={2}
                              />
                            ) : null}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                        <IconPlusOutlineDuo18 strokeWidth={2} />
                        Create organization
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem render={<Link to="/settings" />}>
                  <IconGearOutlineDuo18 strokeWidth={2} />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOut}>
                  <IconExitDoorOutlineDuo18 strokeWidth={2} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateOrgDialog
        onCreated={async (organizationId) => {
          await authClient.organization.setActive({ organizationId });
          await refreshSession();
        }}
        onOpenChange={setCreateOpen}
        open={createOpen}
      />
    </>
  );
}

function CreateOrgDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (organizationId: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [pending, setPending] = useState(false);

  const reset = () => {
    setName("");
    setSlug("");
    setPending(false);
  };

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
      await onCreated(orgId);
    }

    toast.success("Organization created");
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          reset();
        }
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>
            Spin up a fresh workspace. You'll switch to it once it's created.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field>
            <FieldLabel htmlFor="new-org-name">Name</FieldLabel>
            <Input
              id="new-org-name"
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-org-slug">URL slug</FieldLabel>
            <Input
              id="new-org-slug"
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(name) || "my-org"}
              value={slug}
            />
          </Field>
          <DialogFooter>
            <Button disabled={pending || !name} type="submit">
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
