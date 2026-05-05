export function PlusIcon({
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
        <path d="M9 3.25V14.75" /> <path d="M3.25 9H14.75" />
      </g>
    </svg>
  );
}
