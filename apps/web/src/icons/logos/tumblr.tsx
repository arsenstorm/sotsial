export function TumblrIcon({
	title,
	className,
}: Readonly<{ title?: string; className?: string }>) {
	return (
		<svg
			data-slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 32 32"
			className={className}
		>
			<title>{title}</title>
			<g fill="currentColor">
				<path d="M18.5,30c-4.211,0-7.349-2.166-7.349-7.349V14.35h-3.827v-4.495c4.211-1.094,5.972-4.717,6.175-7.856h4.373v7.127h5.102v5.224h-5.102v7.228c0,2.166,1.094,2.915,2.834,2.915h2.47v5.507h-4.677Z" />
			</g>
		</svg>
	);
}
