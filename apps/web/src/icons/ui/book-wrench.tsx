export function BookWrenchIcon({
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
				<path
					d="M15.25 12.75H4.5C3.534 12.75 2.75 13.533 2.75 14.5V3.75C2.75 2.645 3.645 1.75 4.75 1.75H15.25V12.75Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M15.25 12.75C14.609 13.594 14.516 15.297 15.25 16.25H4.5C3.534 16.25 2.75 15.467 2.75 14.5" />{" "}
				<path d="M15.25 12.75H4.5C3.534 12.75 2.75 13.533 2.75 14.5V3.75C2.75 2.645 3.645 1.75 4.75 1.75H15.25V12.75Z" />{" "}
				<path
					d="M11.25 5.75C11.25 4.772 10.622 3.948 9.75 3.638V5.5C9.75 5.776 9.526 6 9.25 6H8.75C8.474 6 8.25 5.776 8.25 5.5V3.638C7.378 3.948 6.75 4.772 6.75 5.75C6.75 6.632 7.262 7.387 8 7.756V10C8 10.552 8.448 11 9 11C9.552 11 10 10.552 10 10V7.756C10.738 7.387 11.25 6.632 11.25 5.75Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>
			</g>
		</svg>
	);
}
