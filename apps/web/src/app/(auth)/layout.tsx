import AuthCheckpoint from "@/utils/auth/checkpoint";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AuthCheckpoint ifAuthenticated="/home">{children}</AuthCheckpoint>;
}
