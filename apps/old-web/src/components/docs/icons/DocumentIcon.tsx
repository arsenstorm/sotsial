export function DocumentIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M3.5 4.5v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-8h-5v-5h-6a2 2 0 0 0-2 2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m11.5 2.5 5 5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
