"use client";

// Headless UI
import { DataInteractive as HeadlessDataInteractive } from "@headlessui/react";
// Link
import type { LinkProps } from "next/link";
import { Link as ViewTransitionLink } from "next-view-transitions";
// React
import React from "react";

export const Link = React.forwardRef(function Link(
  props: LinkProps & React.ComponentPropsWithoutRef<"a">,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <HeadlessDataInteractive>
      <ViewTransitionLink prefetch ref={ref} {...props} />
    </HeadlessDataInteractive>
  );
});
