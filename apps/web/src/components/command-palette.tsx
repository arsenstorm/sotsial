import {
  CreditCardIcon,
  Edit02Icon,
  Home01Icon,
  KeyIcon,
  LinkSquare02Icon,
  Logout02Icon,
  Moon02Icon,
  PlusSignIcon,
  Settings02Icon,
  Store01Icon,
  Sun02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@sotsial/ui/components/command";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { authClient, sessionQuery } from "@/lib/auth";

type NavDest =
  | "/dashboard"
  | "/connections"
  | "/keys"
  | "/posts"
  | "/posts/create"
  | "/settings"
  | "/settings/organization"
  | "/settings/members"
  | "/settings/billing"
  | "/settings/integrations"
  | "/settings/credentials";

const NAV_ITEMS: { label: string; to: NavDest; icon: unknown }[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home01Icon },
  { label: "Connections", to: "/connections", icon: LinkSquare02Icon },
  { label: "API keys", to: "/keys", icon: KeyIcon },
  { label: "Posts", to: "/posts", icon: Edit02Icon },
  { label: "New post", to: "/posts/create", icon: PlusSignIcon },
  { label: "Settings", to: "/settings", icon: Settings02Icon },
  {
    label: "Organization settings",
    to: "/settings/organization",
    icon: Settings02Icon,
  },
  { label: "Members", to: "/settings/members", icon: UserIcon },
  { label: "Billing", to: "/settings/billing", icon: CreditCardIcon },
  {
    label: "Integrations",
    to: "/settings/integrations",
    icon: Store01Icon,
  },
  {
    label: "Credentials",
    to: "/settings/credentials",
    icon: CreditCardIcon,
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: orgs } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const run = (fn: () => void | Promise<void>) => {
    setOpen(false);
    fn();
  };

  const goTo = (to: NavDest) => run(() => navigate({ to }));

  const switchOrg = (organizationId: string) =>
    run(async () => {
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
      queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
      await queryClient.fetchQuery(sessionQuery);
      await router.invalidate();
    });

  const signOut = () =>
    run(async () => {
      await authClient.signOut();
      queryClient.removeQueries({ queryKey: sessionQuery.queryKey });
      await queryClient.fetchQuery(sessionQuery);
      await router.invalidate();
      navigate({ to: "/sign-in" });
    });

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {NAV_ITEMS.map((item) => (
              <CommandItem
                key={item.to}
                onSelect={() => goTo(item.to)}
                value={item.label}
              >
                <HugeiconsIcon
                  icon={
                    item.icon as Parameters<typeof HugeiconsIcon>[0]["icon"]
                  }
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          {orgs && orgs.length > 1 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Switch organization">
                {orgs.map((org) => (
                  <CommandItem
                    key={org.id}
                    onSelect={() => switchOrg(org.id)}
                    value={`org:${org.name}`}
                  >
                    {org.name}
                    {org.id === activeOrg?.id ? (
                      <CommandShortcut>Current</CommandShortcut>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}

          <CommandSeparator />
          <CommandGroup heading="Preferences">
            <CommandItem
              onSelect={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setOpen(false);
              }}
              value="toggle theme"
            >
              <HugeiconsIcon icon={theme === "dark" ? Sun02Icon : Moon02Icon} />
              {theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </CommandItem>
            <CommandItem onSelect={signOut} value="sign out">
              <HugeiconsIcon icon={Logout02Icon} />
              Sign out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
