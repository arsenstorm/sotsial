import { PageHeading } from "@sotsial/ui/components/page-heading";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/settings")({
  component: SettingsLayout,
});

const TABS = [
  { to: "/settings", label: "Account" },
  { to: "/settings/organization", label: "Organization" },
  { to: "/settings/members", label: "Members" },
] as const;

function SettingsLayout() {
  const location = useLocation();

  return (
    <div className="space-y-6">
      <PageHeading
        description="Manage your account and organization."
        title="Settings"
      />
      <nav className="flex gap-1 border-border border-b">
        {TABS.map((tab) => {
          const active =
            tab.to === "/settings"
              ? location.pathname === "/settings"
              : location.pathname === tab.to;
          return (
            <Link
              className={
                active
                  ? "border-primary border-b-2 px-3 py-2 font-medium text-foreground text-sm"
                  : "border-transparent border-b-2 px-3 py-2 text-muted-foreground text-sm hover:text-foreground"
              }
              key={tab.to}
              to={tab.to}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </div>
  );
}
