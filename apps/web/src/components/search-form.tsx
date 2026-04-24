import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Label } from "@sotsial/ui/components/label";
import { SidebarInput } from "@sotsial/ui/components/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Label className="sr-only" htmlFor="site-search">
          Search
        </Label>
        <SidebarInput
          className="h-8 pl-7"
          id="site-search"
          placeholder="Search…"
        />
        <HugeiconsIcon
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 select-none opacity-50"
          icon={Search01Icon}
          strokeWidth={2}
        />
      </div>
    </form>
  );
}
