export function ClipboardIcon({
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
					d="M6.25 2.75V3.25C6.25 3.80228 6.69772 4.25 7.25 4.25H10.75C11.3023 4.25 11.75 3.80228 11.75 3.25V2.75H12.75C13.855 2.75 14.75 3.645 14.75 4.75V14.25C14.75 15.355 13.855 16.25 12.75 16.25H5.25C4.145 16.25 3.25 15.355 3.25 14.25V4.75C3.25 3.645 4.145 2.75 5.25 2.75H6.25Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M6.25 2.75H5.25C4.145 2.75 3.25 3.645 3.25 4.75V14.25C3.25 15.355 4.145 16.25 5.25 16.25H12.75C13.855 16.25 14.75 15.355 14.75 14.25V4.75C14.75 3.645 13.855 2.75 12.75 2.75H11.75" />{" "}
				<path d="M10.75 1.25H7.25C6.69772 1.25 6.25 1.69772 6.25 2.25V3.25C6.25 3.80228 6.69772 4.25 7.25 4.25H10.75C11.3023 4.25 11.75 3.80228 11.75 3.25V2.25C11.75 1.69772 11.3023 1.25 10.75 1.25Z" />{" "}
				<path d="M6.25 11.75H11.75" /> <path d="M6.25 8.75H11.75" />
			</g>
		</svg>
	);
}
