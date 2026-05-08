import { Kbd } from "@sotsial/ui/components/kbd";
import { Label } from "@sotsial/ui/components/label";
import { SidebarInput } from "@sotsial/ui/components/sidebar";
import { IconMagnifierOutlineDuo18 } from "nucleo-ui-outline-duo-18";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Label className="sr-only" htmlFor="site-search">
          Search
        </Label>
        <SidebarInput
          className="h-8 pr-14 pl-7"
          id="site-search"
          placeholder="Search…"
        />
        <IconMagnifierOutlineDuo18
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 select-none opacity-50"
          strokeWidth={2}
        />
        <Kbd className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 select-none">
          ⌘K
        </Kbd>
      </div>
    </form>
  );
}
