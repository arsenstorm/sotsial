import { SidebarTrigger, useSidebar } from "@sotsial/ui/components/sidebar";
import { Link } from "@tanstack/react-router";
import { SearchForm } from "@/components/search-form";

export function SiteHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center border-b bg-background">
      <div
        className={
          isMobile
            ? "flex items-center p-2"
            : "flex w-(--sidebar-width-icon) items-center justify-center p-2"
        }
      >
        <SidebarTrigger />
      </div>
      {isMobile ? null : (
        <span
          aria-hidden
          className="mr-3 h-4 w-px shrink-0 self-center bg-border"
        />
      )}
      <div className="flex flex-1 items-center gap-4 pr-4 md:pl-0">
        <Link
          aria-label="Homepage"
          className="flex items-center gap-2 font-semibold text-sm tracking-tight"
          to="/dashboard"
        >
          <span className="inline-block size-2 rounded-full bg-emerald-500" />
          sotsial
        </Link>
        <SearchForm className="ml-auto" />
      </div>
    </header>
  );
}
