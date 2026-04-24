import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/settings")({
  component: SettingsLayout,
});

const SECTIONS = [
  {
    group: "You",
    items: [{ to: "/settings", label: "Account" }],
  },
  {
    group: "Workspace",
    items: [
      { to: "/settings/organization", label: "Organization" },
      { to: "/settings/members", label: "Members" },
      { to: "/settings/billing", label: "Billing" },
    ],
  },
  {
    group: "Platforms",
    items: [
      { to: "/settings/integrations", label: "Integrations" },
      { to: "/settings/credentials", label: "Credentials" },
    ],
  },
] as const;

function SettingsLayout() {
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/settings"
      ? location.pathname === "/settings"
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <div className="grid @3xl:grid-cols-[14rem_1fr] grid-cols-1 @3xl:gap-12 gap-8">
      <aside className="@3xl:pt-1">
        <nav className="-mx-3 @3xl:mx-0 flex @3xl:flex-col @3xl:gap-6 gap-1 @3xl:overflow-visible overflow-x-auto @3xl:px-0 px-3">
          {SECTIONS.map((section) => (
            <div
              className="@3xl:block flex @3xl:shrink shrink-0 items-center gap-1"
              key={section.group}
            >
              <p className="@3xl:mb-2 @3xl:block hidden @3xl:px-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
                {section.group}
              </p>
              <ul className="flex @3xl:flex-col @3xl:gap-0.5 gap-1">
                {section.items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        className={
                          active
                            ? "inline-flex @3xl:w-full whitespace-nowrap rounded-md bg-muted px-3 py-1.5 font-medium text-foreground text-sm"
                            : "inline-flex @3xl:w-full whitespace-nowrap rounded-md px-3 py-1.5 text-muted-foreground text-sm hover:bg-muted/60 hover:text-foreground"
                        }
                        to={item.to}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
