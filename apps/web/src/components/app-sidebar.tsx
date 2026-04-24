import {
  Edit02Icon,
  Home01Icon,
  KeyIcon,
  LinkSquare02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@sotsial/ui/components/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import type * as React from "react";
import { NavUser } from "@/components/nav-user";
import { sessionQuery } from "@/lib/auth";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { to: "/connections", label: "Connections", icon: LinkSquare02Icon },
  { to: "/keys", label: "API keys", icon: KeyIcon },
  { to: "/posts", label: "Posts", icon: Edit02Icon },
  { to: "/settings", label: "Settings", icon: Settings02Icon },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { data: session } = useQuery(sessionQuery);
  const user = session?.user;

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      collapsible="icon"
      {...props}
    >
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
                    tooltip={item.label}
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
        {user ? <NavUser email={user.email} name={user.name} /> : null}
      </SidebarFooter>
    </Sidebar>
  );
}
