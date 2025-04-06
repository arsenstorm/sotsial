export function ArrowTriangleLineLeftIcon({
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
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				stroke="currentColor"
			>
				<path d="M7.75 9H15.75" />
				<path
					d="M2.45303 9.41399L6.96903 12.472C7.30103 12.697 7.74903 12.459 7.74903 12.058V5.94199C7.74903 5.54099 7.30103 5.30299 6.96903 5.52799L2.45303 8.58599C2.16003 8.78399 2.16003 9.21599 2.45303 9.41399Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-stroke="none"
					stroke="none"
				/>
				<path d="M2.45303 9.41399L6.96903 12.472C7.30103 12.697 7.74903 12.459 7.74903 12.058V5.94199C7.74903 5.54099 7.30103 5.30299 6.96903 5.52799L2.45303 8.58599C2.16003 8.78399 2.16003 9.21599 2.45303 9.41399Z" />
			</g>
		</svg>
	);
}
