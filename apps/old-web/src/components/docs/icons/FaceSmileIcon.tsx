export function FaceSmileIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M10 1.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 6.5v2M12.5 6.5v2M5.5 11.5s1 3 4.5 3 4.5-3 4.5-3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
