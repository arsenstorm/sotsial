export function ChevronDownIcon({
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
        <path d="M15.25 7.5L9 11.75L2.75 7.5" />
      </g>
    </svg>
  );
}
