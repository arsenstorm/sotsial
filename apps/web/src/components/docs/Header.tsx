import { forwardRef } from "react";
import { Link } from "@/components/ui/link";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/components/docs/Button";
import { Logo } from "@/components/logo";
import {
	MobileNavigation,
	useIsInsideMobileNavigation,
	useMobileNavigationStore,
} from "@/components/docs/MobileNavigation";
import { MobileSearch, Search } from "@/components/docs/Search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/utils/auth/provider";

function TopLevelNavItem({
	href,
	children,
}: {
	readonly href: string;
	readonly children: React.ReactNode;
}) {
	return (
		<li>
			<Link
				href={href}
				className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
			>
				{children}
			</Link>
		</li>
	);
}

function HeaderContent() {
	const { session } = useAuth();

	return (
		<div className="flex items-center gap-5">
			<nav className="hidden md:block">
				<ul className="flex items-center gap-8">
					<TopLevelNavItem href="/docs">Documentation</TopLevelNavItem>
					<TopLevelNavItem href="/help">Support</TopLevelNavItem>
				</ul>
			</nav>
			<div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
			<div className="flex gap-4">
				<MobileSearch />
				<ThemeToggle />
			</div>
			<div className="hidden min-[416px]:contents">
				{session ? (
					<Button href="/home">Dashboard</Button>
				) : (
					<Button href="/continue">Sign in</Button>
				)}
			</div>
		</div>
	);
}

export const Header = forwardRef<
	React.ElementRef<"div">,
	React.ComponentPropsWithoutRef<typeof motion.div>
>(function Header({ className, ...props }, ref) {
	const { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
	const isInsideMobileNavigation = useIsInsideMobileNavigation();

	const { scrollY } = useScroll();
	const bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
	const bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

	return (
		<motion.div
			{...props}
			ref={ref}
			className={clsx(
				className,
				"fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80",
				!isInsideMobileNavigation &&
					"backdrop-blur-sm lg:left-72 xl:left-80 dark:backdrop-blur",
				isInsideMobileNavigation
					? "bg-white dark:bg-zinc-900"
					: "border-b border-white/5 dark:border-zinc-900/5 backdrop-blur-md",
			)}
			style={
				{
					"--bg-opacity-light": bgOpacityLight,
					"--bg-opacity-dark": bgOpacityDark,
				} as React.CSSProperties
			}
		>
			<div
				className={clsx(
					"absolute inset-x-0 top-full h-px transition",
					(isInsideMobileNavigation || !mobileNavIsOpen) &&
						//'bg-zinc-900/7.5 dark:bg-white/7.5',
						"backdrop-blur-md",
				)}
			/>
			<div className="flex items-center gap-5 lg:hidden">
				<MobileNavigation />
				<Link href="/docs" aria-label="Home">
					<Logo className="h-6" />
				</Link>
			</div>
			<Search />
			<HeaderContent />
		</motion.div>
	);
});
