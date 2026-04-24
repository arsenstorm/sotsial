export function OpenInNewTabIcon({
  title,
  className,
}: Readonly<{ title?: string; className?: string }>) {
  return (
    <svg
      className={className}
      data-slot="icon"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <rect
          data-color="color-2"
          data-stroke="none"
          fill="currentColor"
          fillOpacity="0.3"
          height="10"
          rx="2"
          stroke="none"
          width="10"
          x="3"
          y="5"
        />{" "}
        <path d="M10.5 2.75H15.25V7.5" /> <path d="M15.25 2.75L9 9" />{" "}
        <path d="M13.25 10.5V13.25C13.25 14.355 12.355 15.25 11.25 15.25H4.75C3.645 15.25 2.75 14.355 2.75 13.25V6.75C2.75 5.645 3.645 4.75 4.75 4.75H7.5" />
      </g>
    </svg>
  );
}
