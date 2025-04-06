export function OpenInNewTabIcon({
	title,
	className,
}: Readonly<{ title?: string; className?: string }>) {
	return (
		<svg
			data-slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 18 18"
			className={className}
		>
			<title>{title}</title>
			<g
				strokeLinecap="round"
				strokeWidth="1.5"
				fill="none"
				stroke="currentColor"
				strokeLinejoin="round"
			>
				<rect
					x="3"
					y="5"
					width="10"
					height="10"
					rx="2"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				></rect>{" "}
				<path d="M10.5 2.75H15.25V7.5" /> <path d="M15.25 2.75L9 9" />{" "}
				<path d="M13.25 10.5V13.25C13.25 14.355 12.355 15.25 11.25 15.25H4.75C3.645 15.25 2.75 14.355 2.75 13.25V6.75C2.75 5.645 3.645 4.75 4.75 4.75H7.5" />
			</g>
		</svg>
	);
}
