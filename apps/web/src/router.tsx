import type { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import {
  DefaultErrorComponent,
  DefaultNotFoundComponent,
} from "./components/error-state";
import { createQueryClient } from "./lib/query";
import { routeTree } from "./routeTree.gen";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export function getRouter() {
  const queryClient = createQueryClient();

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient } satisfies RouterAppContext,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: DefaultNotFoundComponent,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
