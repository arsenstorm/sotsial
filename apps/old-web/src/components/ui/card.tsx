"use client";

import clsx from "clsx";
import { Button } from "./button";
import { Subheading } from "./heading";
import { Link } from "./link";
import { Text } from "./text";

type CardBaseProps = {
  readonly className?: string;
  readonly onClick?: () => void;
};

type CardWithTitleProps = CardBaseProps & {
  readonly title: string;
  readonly description: string;
  readonly href?: string;
  readonly cta?: string;
  readonly children?: never;
};

type CardWithChildrenProps = CardBaseProps & {
  readonly title?: never;
  readonly description?: never;
  readonly href?: never;
  readonly cta?: never;
  readonly children: React.ReactNode;
};

type CardProps = CardWithTitleProps | CardWithChildrenProps;

export function Card({
  title = "",
  description = "",
  href = "",
  cta,
  className = "",
  onClick,
  children,
  ...props
}: CardProps): React.ReactNode {
  // If children are provided, render a simple card with children
  if (children) {
    return (
      <div
        className={clsx(
          "rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
          className
        )}
        {...props}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  // Original card implementation
  if (!href) {
    return (
      <div
        className={clsx(
          "flex rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-6 dark:border-zinc-700 dark:bg-zinc-800",
          className
        )}
        {...props}
        onClick={onClick}
      >
        <div className="flex flex-col">
          <Subheading level={4}>{title}</Subheading>
          <Text>{description}</Text>
        </div>
      </div>
    );
  }

  return (
    <Link
      className={clsx(
        "flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-6 lg:flex-row dark:border-zinc-700 dark:bg-zinc-800",
        className
      )}
      href={href}
      {...props}
    >
      <div className="flex flex-col">
        <Subheading level={4}>{title}</Subheading>
        <Text>{description}</Text>
      </div>
      <div className="flex w-fit flex-col justify-center lg:ml-auto">
        <Button>{cta ?? "Take me there"}</Button>
      </div>
    </Link>
  );
}

export function CardGroup({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  );
}
