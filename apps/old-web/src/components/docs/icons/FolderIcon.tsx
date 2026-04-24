export function FolderIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M17.5 15.5v-8a2 2 0 0 0-2-2h-2.93a2 2 0 0 1-1.664-.89l-.812-1.22A2 2 0 0 0 8.43 2.5H4.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.43 2.5H4.5a2 2 0 0 0-2 2v1h9l-1.406-2.11A2 2 0 0 0 8.43 2.5Z"
        strokeWidth="0"
      />
      <path
        d="m11.5 5.5-1.406-2.11A2 2 0 0 0 8.43 2.5H4.5a2 2 0 0 0-2 2v1h9Zm0 0h2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
