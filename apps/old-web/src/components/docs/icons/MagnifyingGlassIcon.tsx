export function MagnifyingGlassIcon(
  props: React.ComponentPropsWithoutRef<"svg">
) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M2.5 8.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" strokeWidth="0" />
      <path
        d="m13 13 4.5 4.5m-9-3a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
