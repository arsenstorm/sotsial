export function BillingIcon({
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
					d="M7.25 4.75C4.859 6.031 3 9.266 3 12C3 15.314 5.686 16.25 9 16.25C12.314 16.25 15 15.314 15 12C15 9.266 13.141 6.031 10.75 4.75"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M10.264 8.71999C9.943 8.20099 9.429 8.07599 9.029 8.07599C8.608 8.07599 7.503 8.29999 7.606 9.36099C7.678 10.106 8.38 10.383 8.993 10.492C9.606 10.601 10.497 10.835 10.519 11.733C10.538 12.492 9.855 13.01 9.03 13.01C8.346 13.01 7.844 12.78 7.584 12.266" />{" "}
				<path d="M9 7.25V8.076" /> <path d="M9 13.011V13.75" />{" "}
				<path d="M10.75 4.75L12.75 1.75C12.75 1.198 12.302 0.75 11.75 0.75H9H6.25C5.698 0.75 5.25 1.198 5.25 1.75L7.25 4.75H10.75Z" />{" "}
				<path d="M9 4.75V3.25" />{" "}
				<path d="M7.25 4.75C4.859 6.031 3 9.266 3 12C3 15.314 5.686 16.25 9 16.25C12.314 16.25 15 15.314 15 12C15 9.266 13.141 6.031 10.75 4.75" />
			</g>
		</svg>
	);
}
