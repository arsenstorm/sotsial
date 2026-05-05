"use client";

import clsx from "clsx";

export function Skeleton({
  className,
}: {
  readonly className?: string;
}): React.ReactNode {
  if (!className) {
    className = "h-[500px] w-full";
  }

  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
    />
  );
}
