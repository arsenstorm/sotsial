export function UserIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        clipRule="evenodd"
        d="M10 .5a9.5 9.5 0 0 1 5.598 17.177C14.466 15.177 12.383 13.5 10 13.5s-4.466 1.677-5.598 4.177A9.5 9.5 0 0 1 10 .5ZM12.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"
        fillRule="evenodd"
        strokeWidth="0"
      />
      <path
        d="M10 .5a9.5 9.5 0 0 1 5.598 17.177A9.458 9.458 0 0 1 10 19.5a9.458 9.458 0 0 1-5.598-1.823A9.5 9.5 0 0 1 10 .5Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.402 17.677C5.534 15.177 7.617 13.5 10 13.5s4.466 1.677 5.598 4.177M10 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
