// Auth

// Layout
import { NavigationProvider } from "@/components/layout/navigation";
import AuthCheckpoint from "@/utils/auth/checkpoint";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthCheckpoint ifUnauthenticated="/continue">
      <NavigationProvider>{children}</NavigationProvider>
    </AuthCheckpoint>
  );
}
