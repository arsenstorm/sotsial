// Auth
import AuthCheckpoint from "@/utils/auth/checkpoint";

// Layout
import { NavigationProvider } from "@/components/layout/navigation";

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
