import { Button } from "@/components/docs/Button";
import { HeroPattern } from "@/components/docs/HeroPattern";

export default function NotFound() {
  return (
    <div>
      <HeroPattern />
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-16 text-center">
        <p className="font-semibold text-sm text-zinc-900 dark:text-white">
          404
        </p>
        <h1 className="mt-2 font-bold text-2xl text-zinc-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8 flex gap-2">
          <Button arrow="left" href="/">
            Go back home
          </Button>
          <Button arrow="right" href="/docs">
            Visit docs
          </Button>
        </div>
      </div>
    </div>
  );
}
