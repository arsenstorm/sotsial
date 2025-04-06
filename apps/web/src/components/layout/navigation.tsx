"use client";

// UI
import { Avatar } from "@/components/ui/avatar";
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
	DropdownShortcut,
} from "@/components/ui/dropdown";
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from "@/components/ui/navbar";
import {
	Sidebar,
	SidebarBody,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarLabel,
	SidebarSection,
	SidebarSpacer,
	SidebarShortcut,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";

// Icons
import {
	SunIcon,
	MoonIcon,
	ChevronUpIcon,
	CircleQuestionIcon,
	SettingsIcon,
	ArrowRightStartOnRectangleIcon,
	ShieldCheckIcon,
	HomeIcon,
	KeyIcon,
	BillingIcon,
	LicenseIcon,
	ConnectionsIcon,
	IntegrationsIcon,
	FeatherIcon,
	ArchiveIcon,
	BookWrenchIcon,
} from "@/icons/ui/index";

// Components
import { Logo } from "@/components/logo";

// Hooks
import { useHotkeys } from "@mantine/hooks";
import { useAuth } from "@/utils/auth/provider";

// Utils
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";

export function NavigationProvider({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	const { user } = useAuth();
	const router = useTransitionRouter();
	const pathname = usePathname();
	const { resolvedTheme, setTheme } = useTheme();

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	const switchToHome = useCallback(() => {
		router.push("/home");
	}, [router]);

	const switchToApiKeys = useCallback(() => {
		router.push("/keys");
	}, [router]);

	const switchToBilling = useCallback(() => {
		router.push("/billing");
	}, [router]);

	const switchToConnections = useCallback(() => {
		router.push("/connections");
	}, [router]);

	const switchToIntegrations = useCallback(() => {
		router.push("/integrations");
	}, [router]);

	const switchToPosting = useCallback(() => {
		router.push("/posting");
	}, [router]);

	const switchToLogs = useCallback(() => {
		router.push("/logs");
	}, [router]);

	const switchToDocs = useCallback(() => {
		router.push("/docs");
	}, [router]);

	const switchToHelp = useCallback(() => {
		router.push("/help");
	}, [router]);

	const switchToSettings = useCallback(() => {
		router.push("/settings");
	}, [router]);

	const switchTheme = useCallback(() => {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}, [resolvedTheme, setTheme]);

	useHotkeys([
		// Home
		["h", switchToHome],

		// API Keys
		["a", switchToApiKeys],

		// Billing
		["b", switchToBilling],

		// Connections
		["c", switchToConnections],

		// Integrations
		["i", switchToIntegrations],

		// Posting
		["p", switchToPosting],

		// Logs
		["l", switchToLogs],

		// Docs
		["d", switchToDocs],

		// Settings
		["s", switchToSettings],

		// Theme
		["t", switchTheme],

		// Help
		["shift+?", switchToHelp],
		["?", switchToHelp],
		["F1", switchToHelp],
	]);

	return (
		<SidebarLayout
			navbar={
				<Navbar>
					<NavbarSpacer />
					<NavbarSection>
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar
									src={user?.image ?? undefined}
									className="size-10"
									initials={!user?.image ? "A" : undefined}
									square
								/>
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="bottom end">
								<DropdownItem href="/settings">
									<SettingsIcon />
									<DropdownLabel>Settings</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/privacy">
									<ShieldCheckIcon />
									<DropdownLabel>Privacy policy</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/terms">
									<LicenseIcon />
									<DropdownLabel>Terms of service</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/logout">
									<ArrowRightStartOnRectangleIcon />
									<DropdownLabel>Sign out</DropdownLabel>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarSection>
				</Navbar>
			}
			sidebar={
				<Sidebar>
					<SidebarHeader>
						<SidebarSection>
							<SidebarItem href="/home">
								<Logo className="h-5" />
								<SidebarLabel className="font-semibold">Sotsial</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							<SidebarItem href="/home" current={pathname === "/home"}>
								<HomeIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Home
									<SidebarShortcut keys={["H"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/keys" current={pathname?.startsWith("/keys")}>
								<KeyIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									API Keys
									<SidebarShortcut keys={["A"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/billing" current={pathname === "/billing"}>
								<BillingIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Billing
									<SidebarShortcut keys={["B"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								href="/connections"
								current={pathname === "/connections"}
							>
								<ConnectionsIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Connections
									<SidebarShortcut keys={["C"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem
								href="/integrations"
								current={pathname === "/integrations"}
							>
								<IntegrationsIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Integrations
									<SidebarShortcut keys={["I"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/posting" current={pathname === "/posting"}>
								<FeatherIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Posting
									<SidebarShortcut keys={["P"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/logs" current={pathname === "/logs"}>
								<ArchiveIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Logs
									<SidebarShortcut keys={["L"]} />
								</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
						<SidebarSpacer />
						<SidebarSection>
							<SidebarItem href="/docs" current={pathname === "/docs"}>
								<BookWrenchIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Docs
									<SidebarShortcut keys={["D"]} />
								</SidebarLabel>
							</SidebarItem>
							<SidebarItem href="/help" current={pathname === "/help"}>
								<CircleQuestionIcon />
								<SidebarLabel className="flex items-center justify-between w-full">
									Help
									<SidebarShortcut keys={["F1"]} />
								</SidebarLabel>
							</SidebarItem>
						</SidebarSection>
					</SidebarBody>
					<SidebarFooter className="max-lg:hidden">
						<Dropdown>
							<DropdownButton as={SidebarItem}>
								<span className="flex min-w-0 items-center gap-3">
									<Avatar
										src={user?.image ?? undefined}
										className="size-10"
										initials={!user?.image ? "A" : undefined}
										square
										alt=""
									/>
									<span className="min-w-0">
										<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
											{user?.name ?? "Me"}
										</span>
										<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
											{user?.email}
										</span>
									</span>
								</span>
								<ChevronUpIcon />
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="top start">
								<DropdownItem href="/settings">
									<SettingsIcon />
									<DropdownLabel>Settings</DropdownLabel>
									<DropdownShortcut keys={["S"]} />
								</DropdownItem>
								<DropdownItem onClick={toggleTheme}>
									{resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
									<DropdownLabel>Toggle Theme</DropdownLabel>
									<DropdownShortcut keys={["T"]} />
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/privacy">
									<ShieldCheckIcon />
									<DropdownLabel>Privacy policy</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/terms">
									<LicenseIcon />
									<DropdownLabel>Terms of service</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/sign-out">
									<ArrowRightStartOnRectangleIcon />
									<DropdownLabel>Sign out</DropdownLabel>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</SidebarFooter>
				</Sidebar>
			}
		>
			{children}
		</SidebarLayout>
	);
}
