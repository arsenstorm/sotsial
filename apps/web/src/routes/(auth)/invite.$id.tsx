import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionQuery } from "@/lib/auth";

export const Route = createFileRoute("/(auth)/invite/$id")({
  beforeLoad: async ({ context, params }) => {
    const session = await context.queryClient.ensureQueryData(sessionQuery);
    const next = `/onboarding?invite=${params.id}`;

    if (session?.user) {
      throw redirect({ to: next });
    }

    throw redirect({ to: "/sign-up", search: { next } });
  },
});
