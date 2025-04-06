// Next
import type { Metadata } from "next";
import localFont from "next/font/local";

// Styles
import "@/styles/globals.css";
import clsx from "clsx";

// Providers
import { Providers } from "./providers";

// View Transitions
import { ViewTransitions } from "next-view-transitions";

const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});

const geistMono = localFont({
	src: "../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const boska = localFont({
	src: "../fonts/Boska.woff2",
	variable: "--font-boska",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Sotsial",
	description: "API-first content publishing for all social media platforms.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ViewTransitions>
			<html lang="en" suppressHydrationWarning>
				<body
					className={clsx(
						"antialiased",
						"bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950",
						geistSans.variable,
						geistMono.variable,
						boska.variable,
					)}
				>
					<Providers>{children}</Providers>
				</body>
			</html>
		</ViewTransitions>
	);
}
