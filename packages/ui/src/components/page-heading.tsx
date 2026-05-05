import { cn } from "@sotsial/ui/lib/utils";
import { Separator } from "@sotsial/ui/components/separator";

interface PageHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  divider?: boolean;
}

function PageHeading({
  title,
  description,
  actions,
  divider = true,
  className,
  ...props
}: PageHeadingProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
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

export { PageHeading };
