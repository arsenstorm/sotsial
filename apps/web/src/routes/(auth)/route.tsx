import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async ({ context, location }) => {
    // Allow /onboarding even when signed in (used to pick/accept an org).
    if (location.pathname.startsWith("/onboarding")) {
      return;
    }

    const session = await context.queryClient.ensureQueryData(sessionQuery);

    if (session?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </main>
  );
}
