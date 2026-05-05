export function BookIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="m10 5.5-7.5-3v12l7.5 3m0-12 7.5-3v12l-7.5 3m0-12v12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m17.5 2.5-7.5 3v12l7.5-3v-12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
