export function LicenseIcon({
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
					d="M4.75 1.75H13.25C14.3546 1.75 15.25 2.64543 15.25 3.75V14.25C15.25 15.3546 14.3546 16.25 13.25 16.25H4.75C3.64543 16.25 2.75 15.3546 2.75 14.25V3.75C2.75 2.64543 3.64543 1.75 4.75 1.75ZM12.75 12.25C12.75 13.0784 12.0784 13.75 11.25 13.75C10.4216 13.75 9.75 13.0784 9.75 12.25C9.75 11.4216 10.4216 10.75 11.25 10.75C12.0784 10.75 12.75 11.4216 12.75 12.25Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M5.75 7.75H9.25" /> <path d="M5.75 5.25H12.25" />{" "}
				<path d="M13.25 1.75H4.75C3.64543 1.75 2.75 2.64543 2.75 3.75V14.25C2.75 15.3546 3.64543 16.25 4.75 16.25H13.25C14.3546 16.25 15.25 15.3546 15.25 14.25V3.75C15.25 2.64543 14.3546 1.75 13.25 1.75Z" />{" "}
				<path d="M11.25 13.75C12.0784 13.75 12.75 13.0784 12.75 12.25C12.75 11.4216 12.0784 10.75 11.25 10.75C10.4216 10.75 9.75 11.4216 9.75 12.25C9.75 13.0784 10.4216 13.75 11.25 13.75Z" />
			</g>
		</svg>
	);
}
