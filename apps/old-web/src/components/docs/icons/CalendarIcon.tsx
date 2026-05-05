export function CalendarIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M2.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2h-15v-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5.5v-3M14.5 5.5v-3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
