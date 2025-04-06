export function KeyIcon({
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
					d="M15.747 2.076L12.9 2.253L7.009 8.144C6.685 8.06 6.351 8 6 8C3.791 8 2 9.791 2 12C2 14.209 3.791 16 6 16C8.209 16 10 14.209 10 12C10 11.638 9.936 11.293 9.846 10.959L11.75 9V6.75H14L15.753 5.105L15.747 2.076Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M15.747 2.076L12.9 2.253L7.009 8.144C6.685 8.06 6.351 8 6 8C3.791 8 2 9.791 2 12C2 14.209 3.791 16 6 16C8.209 16 10 14.209 10 12C10 11.638 9.936 11.293 9.846 10.959L11.75 9V6.75H14L15.753 5.105L15.747 2.076Z" />{" "}
				<path
					d="M5.5 13.5C6.05228 13.5 6.5 13.0523 6.5 12.5C6.5 11.9477 6.05228 11.5 5.5 11.5C4.94772 11.5 4.5 11.9477 4.5 12.5C4.5 13.0523 4.94772 13.5 5.5 13.5Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>
			</g>
		</svg>
	);
}
