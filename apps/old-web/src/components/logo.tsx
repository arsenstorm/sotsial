export function Logo(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
  return (
    <svg
      fill={props.fill ?? "#000000"}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{/* noop */}</title>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <polygon
          data-color="color-2"
          fill="currentColor"
          opacity=".3"
          points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75"
          strokeWidth="0"
        />
        <polygon points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75" />
        <line x1="2" x2="5" y1="16" y2="13" />
        <line x1="1.75" x2="2.25" y1="12.25" y2="11.75" />
        <line x1="5.75" x2="6.25" y1="16.25" y2="15.75" />
      </g>
    </svg>
  );
}
