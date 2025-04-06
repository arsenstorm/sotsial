export function CircleQuestionIcon({
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
					d="M9 16.25C13.0041 16.25 16.25 13.0041 16.25 9C16.25 4.99594 13.0041 1.75 9 1.75C4.99594 1.75 1.75 4.99594 1.75 9C1.75 13.0041 4.99594 16.25 9 16.25Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M9 16.25C13.0041 16.25 16.25 13.0041 16.25 9C16.25 4.99594 13.0041 1.75 9 1.75C4.99594 1.75 1.75 4.99594 1.75 9C1.75 13.0041 4.99594 16.25 9 16.25Z" />{" "}
				<path d="M6.92499 6.61901C7.31299 5.56201 8.21899 5.12701 9.10499 5.12701C9.99999 5.12701 10.923 5.76501 10.923 6.93501C10.923 8.71901 9.10699 8.40301 8.82699 10" />{" "}
				<path
					d="M8.79099 13.567C8.23899 13.567 7.79099 13.118 7.79099 12.567C7.79099 12.016 8.23899 11.567 8.79099 11.567C9.34299 11.567 9.79099 12.016 9.79099 12.567C9.79099 13.118 9.34299 13.567 8.79099 13.567Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>
			</g>
		</svg>
	);
}
