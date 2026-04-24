import { Toaster } from "@sotsial/ui/components/sonner";
import { TooltipProvider } from "@sotsial/ui/components/tooltip";
import appCss from "@sotsial/ui/globals.css?url";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { RouterAppContext } from "../router";

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sotsial" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1 className="font-semibold text-2xl">404</h1>
      <p className="text-muted-foreground">
        The requested page could not be found.
      </p>
    </main>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html className="antialiased" lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="isolate">
        <RootProviders>{children ?? <Outlet />}</RootProviders>
        <Scripts />
      </body>
    </html>
  );
}

function RootProviders({ children }: { children: React.ReactNode }) {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster richColors />
    </QueryClientProvider>
  );
}
