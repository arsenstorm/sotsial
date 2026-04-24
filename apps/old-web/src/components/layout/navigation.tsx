"use client";

// Hooks
import { useHotkeys } from "@mantine/hooks";
// Utils
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useTransitionRouter } from "next-view-transitions";
import { useCallback } from "react";
// Components
import { Logo } from "@/components/logo";
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
  SidebarShortcut,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
// Icons
import {
  ArchiveIcon,
  ArrowRightStartOnRectangleIcon,
  BillingIcon,
  BookWrenchIcon,
  ChevronUpIcon,
  CircleQuestionIcon,
  ConnectionsIcon,
  FeatherIcon,
  HomeIcon,
  IntegrationsIcon,
  KeyIcon,
  LicenseIcon,
  MoonIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SunIcon,
} from "@/icons/ui/index";
import { useAuth } from "@/utils/auth/provider";

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
                  className="size-10"
                  initials={user?.image ? undefined : "A"}
                  square
                  src={user?.image ?? undefined}
                />
              </DropdownButton>
              <DropdownMenu anchor="bottom end" className="min-w-64">
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
              <SidebarItem current={pathname === "/home"} href="/home">
                <HomeIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Home
                  <SidebarShortcut keys={["H"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem current={pathname?.startsWith("/keys")} href="/keys">
                <KeyIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  API Keys
                  <SidebarShortcut keys={["A"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem current={pathname === "/billing"} href="/billing">
                <BillingIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Billing
                  <SidebarShortcut keys={["B"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem
                current={pathname === "/connections"}
                href="/connections"
              >
                <ConnectionsIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Connections
                  <SidebarShortcut keys={["C"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem
                current={pathname === "/integrations"}
                href="/integrations"
              >
                <IntegrationsIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Integrations
                  <SidebarShortcut keys={["I"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem current={pathname === "/posting"} href="/posting">
                <FeatherIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Posting
                  <SidebarShortcut keys={["P"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem current={pathname === "/logs"} href="/logs">
                <ArchiveIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Logs
                  <SidebarShortcut keys={["L"]} />
                </SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem current={pathname === "/docs"} href="/docs">
                <BookWrenchIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
                  Docs
                  <SidebarShortcut keys={["D"]} />
                </SidebarLabel>
              </SidebarItem>
              <SidebarItem current={pathname === "/help"} href="/help">
                <CircleQuestionIcon />
                <SidebarLabel className="flex w-full items-center justify-between">
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
                    alt=""
                    className="size-10"
                    initials={user?.image ? undefined : "A"}
                    square
                    src={user?.image ?? undefined}
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-sm/5 text-zinc-950 dark:text-white">
                      {user?.name ?? "Me"}
                    </span>
                    <span className="block truncate font-normal text-xs/5 text-zinc-500 dark:text-zinc-400">
                      {user?.email}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu anchor="top start" className="min-w-64">
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
