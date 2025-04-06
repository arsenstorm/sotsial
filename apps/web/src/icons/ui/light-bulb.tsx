export function LightBulbIcon({
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
					fillRule="evenodd"
					clipRule="evenodd"
					d="M7.92201 1.86301C11.154 1.18801 14 3.63701 14 6.75001C14 8.70101 12.88 10.387 11.25 11.211V11.25H6.75001V11.211C4.85901 10.255 3.65401 8.14001 4.08801 5.79601C4.44701 3.85601 5.99001 2.26601 7.92201 1.86301Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M9 11.25V8.25L7 6.25" /> <path d="M9 8.25L11 6.25" />{" "}
				<path d="M6.75 13.75H11.25" />{" "}
				<path d="M14 6.75001C14 3.63701 11.154 1.18801 7.92201 1.86301C5.99001 2.26601 4.44701 3.85601 4.08801 5.79601C3.65401 8.14001 4.85901 10.255 6.75001 11.211V14.25C6.75001 15.355 7.64501 16.25 8.75001 16.25H9.25001C10.355 16.25 11.25 15.355 11.25 14.25V11.211C12.88 10.387 14 8.70101 14 6.75001Z" />{" "}
				<path d="M6.75 11.25H11.25" />
			</g>
		</svg>
	);
}
