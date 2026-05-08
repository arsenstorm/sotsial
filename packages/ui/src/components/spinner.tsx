import { cn } from "@sotsial/ui/lib/utils";
import { IconLoadingStatusOutlineDuo18 } from "nucleo-ui-outline-duo-18";

function Spinner({
  className,
  strokeWidth = 2,
  ...props
}: React.ComponentProps<typeof IconLoadingStatusOutlineDuo18>) {
  return (
    <IconLoadingStatusOutlineDuo18
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      role="status"
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

export { Spinner };
