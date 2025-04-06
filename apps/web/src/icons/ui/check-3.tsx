export function Check3Icon({
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
				<path d="M2.75 9C4.29 10.537 5.495 12.312 6.5 14.25C8.833 9.833 11.75 6.333 15.25 3.75" />
			</g>
		</svg>
	);
}
