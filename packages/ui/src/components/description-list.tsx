import { cn } from "@sotsial/ui/lib/utils";

function DescriptionList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,12rem)_1fr]",
        className
      )}
      {...props}
    />
  );
}

function DescriptionTerm({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <dt
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function DescriptionDetails({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <dd
      className={cn(
        "text-foreground text-sm sm:border-l sm:border-border sm:pl-6",
        className
      )}
      {...props}
    />
  );
}

export { DescriptionList, DescriptionTerm, DescriptionDetails };
