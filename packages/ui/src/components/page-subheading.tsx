import { Separator } from "@sotsial/ui/components/separator";
import { cn } from "@sotsial/ui/lib/utils";

type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

interface PageSubheadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
  as?: HeadingLevel;
}

function PageSubheading({
  title,
  description,
  actions,
  divider = true,
  as: As = "h2",
  className,
  ...props
}: PageSubheadingProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <As className="font-semibold text-lg tracking-tight">{title}</As>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {divider ? <Separator /> : null}
    </div>
  );
}

export { PageSubheading };
