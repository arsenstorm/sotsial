import { Button } from "@sotsial/ui/components/button";
import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

export function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-5">
        <div className="space-y-2">
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
            Something broke
          </p>
          <h1 className="text-balance font-semibold text-3xl tracking-tight">
            We hit an unexpected error.
          </h1>
          <p className="text-pretty text-muted-foreground text-sm leading-6">
            {error.message ||
              "An unknown error occurred while loading this page."}
          </p>
        </div>
        {error.stack ? (
          <pre className="max-h-64 overflow-auto rounded-lg border border-border bg-muted/50 p-3 font-mono text-[0.7rem] text-muted-foreground leading-5">
            {error.stack}
          </pre>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              reset();
              router.invalidate();
            }}
            size="sm"
          >
            Try again
          </Button>
          {isRoot ? null : (
            <Button render={<Link to="/" />} size="sm" variant="outline">
              Go home
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

export function DefaultNotFoundComponent() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-5 text-center">
        <div className="space-y-2">
          <p className="font-mono text-muted-foreground text-xs uppercase tracking-wide">
            404
          </p>
          <h1 className="text-balance font-semibold text-3xl tracking-tight">
            Page not found.
          </h1>
          <p className="mx-auto max-w-[42ch] text-pretty text-muted-foreground text-sm leading-6">
            The page you're looking for doesn't exist, or it's been moved.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button render={<Link to="/" />} size="sm">
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}
