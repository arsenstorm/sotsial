"use client";

import { useTheme } from "next-themes";
import {
  IconCircleCheckOutlineDuo18,
  IconCircleInfoOutlineDuo18,
  IconCircleWarningOutlineDuo18,
  IconCircleXmarkOutlineDuo18,
  IconLoadingStatusOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: (
          <IconCircleCheckOutlineDuo18 className="size-4" strokeWidth={2} />
        ),
        info: (
          <IconCircleInfoOutlineDuo18 className="size-4" strokeWidth={2} />
        ),
        warning: (
          <IconCircleWarningOutlineDuo18 className="size-4" strokeWidth={2} />
        ),
        error: (
          <IconCircleXmarkOutlineDuo18 className="size-4" strokeWidth={2} />
        ),
        loading: (
          <IconLoadingStatusOutlineDuo18
            className="size-4 animate-spin"
            strokeWidth={2}
          />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      theme={theme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
