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
import {
  IconCreditCardOutlineDuo18,
  IconExitDoorOutlineDuo18,
  IconGearOutlineDuo18,
  IconHouseOutlineDuo18,
  IconKeyOutlineDuo18,
  IconLinkOutlineDuo18,
  IconMoonOutlineDuo18,
  IconPencilOutlineDuo18,
  IconPlusOutlineDuo18,
  IconShopOutlineDuo18,
  IconSunOutlineDuo18,
  IconUserOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
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

type IconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

const NAV_ITEMS: { label: string; to: NavDest; icon: IconComponent }[] = [
  { label: "Dashboard", to: "/dashboard", icon: IconHouseOutlineDuo18 },
  { label: "Connections", to: "/connections", icon: IconLinkOutlineDuo18 },
  { label: "API keys", to: "/keys", icon: IconKeyOutlineDuo18 },
  { label: "Posts", to: "/posts", icon: IconPencilOutlineDuo18 },
  { label: "New post", to: "/posts/create", icon: IconPlusOutlineDuo18 },
  { label: "Settings", to: "/settings", icon: IconGearOutlineDuo18 },
  {
    label: "Organization settings",
    to: "/settings/organization",
    icon: IconGearOutlineDuo18,
  },
  { label: "Members", to: "/settings/members", icon: IconUserOutlineDuo18 },
  {
    label: "Billing",
    to: "/settings/billing",
    icon: IconCreditCardOutlineDuo18,
  },
  {
    label: "Integrations",
    to: "/settings/integrations",
    icon: IconShopOutlineDuo18,
  },
  {
    label: "Credentials",
    to: "/settings/credentials",
    icon: IconCreditCardOutlineDuo18,
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

  const ThemeIcon =
    theme === "dark" ? IconSunOutlineDuo18 : IconMoonOutlineDuo18;

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.to}
                  onSelect={() => goTo(item.to)}
                  value={item.label}
                >
                  <Icon />
                  {item.label}
                </CommandItem>
              );
            })}
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
              <ThemeIcon />
              {theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"}
            </CommandItem>
            <CommandItem onSelect={signOut} value="sign out">
              <IconExitDoorOutlineDuo18 />
              Sign out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
