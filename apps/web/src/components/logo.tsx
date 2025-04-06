export function Logo(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 18 18"
			fill={props.fill ?? "#000000"}
			{...props}
		>
			<title>{/* noop */}</title>
			<g
				strokeLinecap="round"
				strokeWidth="1.5"
				fill="none"
				stroke="currentColor"
				strokeLinejoin="round"
			>
				<polygon
					points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75"
					fill="currentColor"
					opacity=".3"
					strokeWidth="0"
					data-color="color-2"
				/>
				<polygon points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75" />
				<line x1="2" y1="16" x2="5" y2="13" />
				<line x1="1.75" y1="12.25" x2="2.25" y2="11.75" />
				<line x1="5.75" y1="16.25" x2="6.25" y2="15.75" />
			</g>
		</svg>
	);
}
