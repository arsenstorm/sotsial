export function TrashIcon({
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
				{" "}
				<path
					d="M13.577 5.24902L13.1 14.355C13.044 15.417 12.166 16.25 11.103 16.25H9.00099H6.89899C5.83499 16.25 4.95799 15.417 4.90199 14.355L4.42499 5.24902H13.578H13.577Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M4.42297 5.24904L6.73897 2.61504C7.14097 2.15804 7.85397 2.16304 8.24897 2.62504L10.496 5.24904" />{" "}
				<path d="M11.442 2.75696L13.577 5.24896" />{" "}
				<path d="M13.577 5.24902L13.1 14.355C13.044 15.417 12.166 16.25 11.103 16.25H9.00099H6.89899C5.83499 16.25 4.95799 15.417 4.90199 14.355L4.42499 5.24902H13.578H13.577Z" />{" "}
				<path d="M7.375 8.25L7.625 13.25" />{" "}
				<path d="M10.625 8.25L10.375 13.25" />{" "}
			</g>
		</svg>
	);
}
