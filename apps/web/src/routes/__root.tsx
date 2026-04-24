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
import { ThemeProvider } from "@/components/theme-provider";
import { getThemeServerFn, type Theme } from "@/lib/theme";
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
  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData() as Theme;

  return (
    <html
      className={`antialiased ${theme === "dark" ? "dark" : ""}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="isolate">
        <RootProviders theme={theme}>{children ?? <Outlet />}</RootProviders>
        <Scripts />
      </body>
    </html>
  );
}

function RootProviders({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={theme}>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
