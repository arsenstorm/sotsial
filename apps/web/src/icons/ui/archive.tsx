export function ArchiveIcon({
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
					d="M14.75 6.25V13.25C14.75 14.355 13.855 15.25 12.75 15.25H5.25C4.145 15.25 3.25 14.355 3.25 13.25V6.25"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M14.75 6.25V13.25C14.75 14.355 13.855 15.25 12.75 15.25H5.25C4.145 15.25 3.25 14.355 3.25 13.25V6.25" />{" "}
				<path d="M15.25 2.75H2.75C2.19772 2.75 1.75 3.19772 1.75 3.75V5.25C1.75 5.80228 2.19772 6.25 2.75 6.25H15.25C15.8023 6.25 16.25 5.80228 16.25 5.25V3.75C16.25 3.19772 15.8023 2.75 15.25 2.75Z" />{" "}
				<path d="M7 9.25H11" />
			</g>
		</svg>
	);
}
