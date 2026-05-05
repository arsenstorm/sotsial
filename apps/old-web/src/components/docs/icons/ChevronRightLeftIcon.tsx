export function ChevronRightLeftIcon(
  props: React.ComponentPropsWithoutRef<"svg">
) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M1.5 10A6.5 6.5 0 0 1 8 3.5h4a6.5 6.5 0 1 1 0 13H8A6.5 6.5 0 0 1 1.5 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m7.5 7.5-3 2.5 3 2.5M12.5 7.5l3 2.5-3 2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
