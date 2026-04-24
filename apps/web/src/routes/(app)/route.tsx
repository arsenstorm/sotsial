import {
  ApiIcon,
  CreditCardIcon,
  Edit02Icon,
  Home01Icon,
  KeyIcon,
  LinkSquare02Icon,
  Logout02Icon,
  Menu01Icon,
  Settings02Icon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback } from "@sotsial/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sotsial/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@sotsial/ui/components/sidebar";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { toast } from "sonner";
import { authClient, sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context, location }) => {
    const session = await context.queryClient.ensureQueryData(sessionQuery);

    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
        search: { next: location.href },
      });
    }

    if (!session.session.activeOrganizationId) {
      throw redirect({ to: "/onboarding" });
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(sessionQuery),
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { to: "/connections", label: "Connections", icon: LinkSquare02Icon },
  { to: "/integrations", label: "Integrations", icon: Store01Icon },
  { to: "/credentials", label: "Credentials", icon: CreditCardIcon },
  { to: "/keys", label: "API keys", icon: KeyIcon },
  { to: "/posting", label: "Posting", icon: Edit02Icon },
  { to: "/settings", label: "Settings", icon: Settings02Icon },
] as const;

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-border border-b px-4">
          <SidebarTrigger>
            <HugeiconsIcon icon={Menu01Icon} />
          </SidebarTrigger>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();
  const session = Route.useLoaderData();
  const user = session?.user;

  return (
    <Sidebar>
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV.map((item) => {
              const isActive =
                item.to === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.to);
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={<Link to={item.to} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? <UserMenu email={user.email} name={user.name} /> : null}
      </SidebarFooter>
    </Sidebar>
  );
}

function OrgSwitcher() {
  const router = useRouter();
  const { data: orgs } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const onSelect = async (organizationId: string) => {
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
    await router.invalidate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton className="w-full">
            <HugeiconsIcon icon={ApiIcon} />
            <span className="truncate">{activeOrg?.name ?? "Select org"}</span>
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {orgs?.map((org) => (
            <DropdownMenuItem key={org.id} onClick={() => onSelect(org.id)}>
              {org.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.navigate({ to: "/onboarding" })}
        >
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ email, name }: { email: string; name: string }) {
  const router = useRouter();

  const onSignOut = async () => {
    await authClient.signOut();
    await router.invalidate();
    router.navigate({ to: "/sign-in" });
  };

  const initials = (name || email)
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton>
            <Avatar className="size-6">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="truncate">{name || email}</span>
          </SidebarMenuButton>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-muted-foreground text-xs">
                {email}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <HugeiconsIcon icon={Logout02Icon} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
