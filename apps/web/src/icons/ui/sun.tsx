export function SunIcon({
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
					d="M9 15.25C12.4518 15.25 15.25 12.4518 15.25 9C15.25 5.54822 12.4518 2.75 9 2.75C5.54822 2.75 2.75 5.54822 2.75 9C2.75 12.4518 5.54822 15.25 9 15.25Z"
					fill="currentColor"
					fillOpacity="0.3"
					data-color="color-2"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path
					d="M6 10C6.55228 10 7 9.55228 7 9C7 8.44772 6.55228 8 6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path
					d="M12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path
					d="M8 10H10C10.276 10 10.5 10.224 10.5 10.5C10.5 11.328 9.828 12 9 12C8.172 12 7.5 11.328 7.5 10.5C7.5 10.224 7.724 10 8 10Z"
					fill="currentColor"
					data-stroke="none"
					stroke="none"
				/>{" "}
				<path d="M9 15.25C12.4518 15.25 15.25 12.4518 15.25 9C15.25 5.54822 12.4518 2.75 9 2.75C5.54822 2.75 2.75 5.54822 2.75 9C2.75 12.4518 5.54822 15.25 9 15.25Z" />{" "}
				<path d="M9 2.75V0.75" /> <path d="M13.419 4.581L15.5 2.5" />{" "}
				<path d="M13.419 13.419L15.5 15.5" />{" "}
				<path d="M4.581 13.419L2.5 15.5" /> <path d="M4.581 4.581L2.5 2.5" />{" "}
				<path d="M15.25 9H17.25" /> <path d="M9 15.25V17.25" />{" "}
				<path d="M2.75 9H0.75" />
			</g>
		</svg>
	);
}
