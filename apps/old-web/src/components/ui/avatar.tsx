import * as Headless from "@headlessui/react";
import clsx from "clsx";
import { forwardRef, type default as React } from "react";
import { TouchTarget } from "./button";
import { Link } from "./link";

type AvatarProps = {
  src?: string | null;
  square?: boolean;
  initials?: string;
  alt?: string;
  className?: string;
};

export function Avatar({
  src = null,
  square = false,
  initials,
  alt = "",
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={clsx(
        className,
        // Basic layout
        "inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1",
        "outline outline-black/(--ring-opacity) -outline-offset-1 dark:outline-white/(--ring-opacity)",
        // Add the correct border radius
        square
          ? "rounded-(--avatar-radius) *:rounded-(--avatar-radius)"
          : "rounded-full *:rounded-full"
      )}
    >
      {initials && (
        <svg
          aria-hidden={alt ? undefined : "true"}
          className="size-full select-none fill-current p-[5%] font-medium text-[48px] uppercase"
          viewBox="0 0 100 100"
        >
          <title>{alt}</title>
          <text
            alignmentBaseline="middle"
            dominantBaseline="middle"
            dy=".125em"
            textAnchor="middle"
            x="50%"
            y="50%"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && <img alt={alt} className="size-full" src={src} />}
    </span>
  );
}

export const AvatarButton = forwardRef(function AvatarButton(
  {
    src,
    square = false,
    initials,
    alt,
    className,
    ...props
  }: AvatarProps &
    (
      | Omit<Headless.ButtonProps, "as" | "className">
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    ),
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = clsx(
    className,
    square ? "rounded-[20%]" : "rounded-full",
    "relative inline-grid focus:outline-hidden data-focus:outline-2 data-focus:outline-blue-500 data-focus:outline-offset-2"
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>
        <Avatar alt={alt} initials={initials} square={square} src={src} />
      </TouchTarget>
    </Link>
  ) : (
    <Headless.Button {...props} className={classes} ref={ref}>
      <TouchTarget>
        <Avatar alt={alt} initials={initials} square={square} src={src} />
      </TouchTarget>
    </Headless.Button>
  );
});
