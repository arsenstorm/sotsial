export function ClipboardIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path
        d="M3.5 6v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1l-.447.894A2 2 0 0 1 11.263 6H8.737a2 2 0 0 1-1.789-1.106L6.5 4h-1a2 2 0 0 0-2 2Z"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13.5 4-.447.894A2 2 0 0 1 11.263 6H8.737a2 2 0 0 1-1.789-1.106L6.5 4l.724-1.447A1 1 0 0 1 8.118 2h3.764a1 1 0 0 1 .894.553L13.5 4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
