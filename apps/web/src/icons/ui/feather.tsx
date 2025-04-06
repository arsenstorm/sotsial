export function FeatherIcon({
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
					d="M16.1712 3.75C9.16612 4.22492 5.67346 9.78548 4.80276 12.5064C5.4877 13.0181 7.5683 13.9131 10.4112 13.3991C13.2542 12.8852 13.9633 10.7548 13.9626 9.75386C16.1163 8.4295 15.0729 6.38275 16.1712 3.75Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M13.974 9.731C13.5 13.422 10.25 13.844 7 13.25" />{" "}
				<path d="M3.75 16.25C3.75 16.25 5.062 4.729 16.25 3.75C15.69 4.726 15.677 6.355 15.304 7.989C14.78 10 12.969 10.25 10.75 10.25" />{" "}
				<path d="M4.25 1.75V6.75" /> <path d="M6.75 4.25H1.75" />
			</g>
		</svg>
	);
}
