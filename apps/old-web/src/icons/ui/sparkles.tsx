export function SparklesIcon({
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
        <path
          d="M11.25 1.75L12.667 5.333L16.25 6.75L12.667 8.167L11.25 11.75L9.833 8.167L6.25 6.75L9.833 5.333L11.25 1.75Z"
          data-color="color-2"
          data-stroke="none"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="none"
        />{" "}
        <path d="M4.75 10.25L5.6 12.4L7.75 13.25L5.6 14.1L4.75 16.25L3.9 14.1L1.75 13.25L3.9 12.4L4.75 10.25Z" />{" "}
        <path d="M11.25 1.75L12.667 5.333L16.25 6.75L12.667 8.167L11.25 11.75L9.833 8.167L6.25 6.75L9.833 5.333L11.25 1.75Z" />
      </g>
    </svg>
  );
}
