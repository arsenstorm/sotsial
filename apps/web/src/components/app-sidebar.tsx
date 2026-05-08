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
import {
  IconHouseOutlineDuo18,
  IconKeyOutlineDuo18,
  IconLinkOutlineDuo18,
  IconPencilOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import type * as React from "react";
import { NavUser } from "@/components/nav-user";
import { sessionQuery } from "@/lib/auth";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: IconHouseOutlineDuo18 },
  { to: "/connections", label: "Connections", icon: IconLinkOutlineDuo18 },
  { to: "/keys", label: "API keys", icon: IconKeyOutlineDuo18 },
  { to: "/posts", label: "Posts", icon: IconPencilOutlineDuo18 },
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
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={<Link to={item.to} />}
                    tooltip={item.label}
                  >
                    <Icon />
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
