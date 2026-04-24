"use client";

// Hooks
import { useMounted } from "@mantine/hooks";
// Openpanel
import { OpenPanelComponent } from "@openpanel/nextjs";
// Themes
import { ThemeProvider, useTheme } from "next-themes";
// Nuqs
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Sonner
import { Toaster as Sonner } from "sonner";
// Auth
import AuthProvider, { useAuth } from "@/utils/auth/provider";
// Captcha
import { Captcha, CaptchaProvider } from "@/utils/captcha/provider";

export function Providers({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <CaptchaProvider>
      <ThemeProvider attribute="class" enableSystem={false}>
        <AuthProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
          <AnalyticsProvider />
        </AuthProvider>
      </ThemeProvider>
      <Captcha invisible />
    </CaptchaProvider>
  );
}

export function Toaster() {
  const { resolvedTheme } = useTheme();

  if (!resolvedTheme) {
    return null;
  }

  return (
    <Sonner richColors theme={resolvedTheme === "dark" ? "dark" : "light"} />
  );
}

export function AnalyticsProvider() {
  const { user } = useAuth();

  const clientId = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;

  if (!clientId) {
    return null;
  }

  return (
    <OpenPanelComponent
      clientId={clientId}
      profileId={user?.id ?? ""}
      trackAttributes
      trackHashChanges
      trackOutgoingLinks
      trackScreenViews
    />
  );
}
