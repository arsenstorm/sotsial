export function ArrowTriangleLineRightIcon({
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
				<path d="M10.25 9H2.25" />
				<path
					d="M15.547 8.58599L11.031 5.52799C10.699 5.30299 10.251 5.54099 10.251 5.94199V12.057C10.251 12.458 10.699 12.696 11.031 12.471L15.547 9.41299C15.84 9.21499 15.84 8.78299 15.547 8.58499V8.58599Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>
				<path d="M15.547 8.58599L11.031 5.52799C10.699 5.30299 10.251 5.54099 10.251 5.94199V12.057C10.251 12.458 10.699 12.696 11.031 12.471L15.547 9.41299C15.84 9.21499 15.84 8.78299 15.547 8.58499V8.58599Z" />
			</g>
		</svg>
	);
}
