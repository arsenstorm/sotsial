export function UkraineIcon({
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
			<g>
				<path
					d="M31,8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4v9H31V8Z"
					fill="#2455b2"
				/>
				<path
					d="M5,28H27c2.209,0,4-1.791,4-4v-8H1v8c0,2.209,1.791,4,4,4Z"
					fill="#f9da49"
				/>
				<path
					d="M5,28H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4ZM2,8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8Z"
					opacity=".15"
				/>
				<path
					d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
					fill="#fff"
					opacity=".2"
				/>
			</g>
		</svg>
	);
}
