export function HomeIcon({
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
					d="M3.145 6.2L8.395 2.21C8.753 1.938 9.248 1.938 9.605 2.21L14.855 6.2C15.104 6.389 15.25 6.684 15.25 6.996V14.25C15.25 15.355 14.355 16.25 13.25 16.25H4.75C3.645 16.25 2.75 15.355 2.75 14.25V6.996C2.75 6.683 2.896 6.389 3.145 6.2Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M3.145 6.2L8.395 2.21C8.753 1.938 9.248 1.938 9.605 2.21L14.855 6.2C15.104 6.389 15.25 6.684 15.25 6.996V14.25C15.25 15.355 14.355 16.25 13.25 16.25H4.75C3.645 16.25 2.75 15.355 2.75 14.25V6.996C2.75 6.683 2.896 6.389 3.145 6.2Z" />{" "}
				<path
					d="M6.75 10.5C7.16421 10.5 7.5 10.1642 7.5 9.75C7.5 9.33579 7.16421 9 6.75 9C6.33579 9 6 9.33579 6 9.75C6 10.1642 6.33579 10.5 6.75 10.5Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path
					d="M11.25 10.5C11.6642 10.5 12 10.1642 12 9.75C12 9.33579 11.6642 9 11.25 9C10.8358 9 10.5 9.33579 10.5 9.75C10.5 10.1642 10.8358 10.5 11.25 10.5Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path
					d="M8 11H10C10.276 11 10.5 11.224 10.5 11.5C10.5 12.328 9.828 13 9 13C8.172 13 7.5 12.328 7.5 11.5C7.5 11.224 7.724 11 8 11Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>
			</g>
		</svg>
	);
}
