import { SidebarInset, SidebarProvider } from "@sotsial/ui/components/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { sessionQuery } from "@/lib/auth";
import { getSidebarStateServerFn } from "@/lib/sidebar-state";

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
  loader: async ({ context }) => {
    const [, sidebarOpen] = await Promise.all([
      context.queryClient.ensureQueryData(sessionQuery),
      getSidebarStateServerFn(),
    ]);
    return { sidebarOpen };
  },
  component: AppLayout,
});

function AppLayout() {
  const { sidebarOpen } = Route.useLoaderData();

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col" defaultOpen={sidebarOpen}>
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="@container p-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
