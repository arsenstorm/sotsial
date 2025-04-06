export function TagIcon({
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
				<path
					d="M3.25 2.25H8.172C8.702 2.25 9.211 2.461 9.586 2.836L15.336 8.586C16.117 9.367 16.117 10.633 15.336 11.414L11.414 15.336C10.633 16.117 9.367 16.117 8.586 15.336L2.836 9.586C2.461 9.211 2.25 8.702 2.25 8.172V3.25C2.25 2.698 2.698 2.25 3.25 2.25Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-stroke="none"
					stroke="none"
				/>
				<path d="M3.25 2.25H8.172C8.702 2.25 9.211 2.461 9.586 2.836L15.336 8.586C16.117 9.367 16.117 10.633 15.336 11.414L11.414 15.336C10.633 16.117 9.367 16.117 8.586 15.336L2.836 9.586C2.461 9.211 2.25 8.702 2.25 8.172V3.25C2.25 2.698 2.698 2.25 3.25 2.25Z" />
				<path
					d="M6.25 7.5C6.94036 7.5 7.5 6.94036 7.5 6.25C7.5 5.55964 6.94036 5 6.25 5C5.55964 5 5 5.55964 5 6.25C5 6.94036 5.55964 7.5 6.25 7.5Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>
			</g>
		</svg>
	);
}
