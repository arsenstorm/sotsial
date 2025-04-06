export function MediumIcon({
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
				<path d="M18.05,16c0,5.018-4.041,9.087-9.025,9.087S0,21.018,0,16,4.041,6.913,9.025,6.913s9.025,4.069,9.025,9.087m9.901,0c0,4.724-2.02,8.555-4.513,8.555s-4.513-3.831-4.513-8.555,2.02-8.555,4.512-8.555,4.513,3.83,4.513,8.555m4.05,0c0,4.231-.71,7.664-1.587,7.664s-1.587-3.431-1.587-7.664,.71-7.664,1.587-7.664,1.587,3.431,1.587,7.664" />
			</g>
		</svg>
	);
}
