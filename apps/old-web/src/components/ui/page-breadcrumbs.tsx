"use client";

import { clsx } from "clsx";
import { Fragment } from "react";
import { Heading } from "./heading";
import { Strong, Text, TextLink } from "./text";

const ChevronRightIcon = ({ className }: Readonly<{ className?: string }>) => (
  <svg
    className={clsx("size-6", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{""}</title>
    <path
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PageBreadcrumbs({
  useHeading = true,
  items = [],
  current,
  ...props
}: {
  readonly useHeading?: boolean; // Use the Heading component to render the breadcrumbs instead of Text
  readonly items: {
    readonly name: string;
    readonly href: string;
  }[];
  readonly current: string;
  readonly props?: any;
}) {
  const Wrapper = useHeading ? Heading : Text;

  return (
    <div {...props}>
      <Wrapper className="flex flex-row items-center gap-x-1">
        {items.map((item) => (
          <Fragment key={item.name}>
            <TextLink href={item.href}>
              <Strong>{item.name}</Strong>
            </TextLink>
            <ChevronRightIcon className="size-4" />
          </Fragment>
        ))}
        <Strong>{current}</Strong>
      </Wrapper>
    </div>
  );
}
