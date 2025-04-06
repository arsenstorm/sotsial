import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 512,
	height: 512,
};
export const contentType = "image/png";

export const runtime = "edge";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: size.width,
				height: size.height,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "white",
				borderRadius: "2rem",
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 18 18"
				style={{
					width: "80%",
					height: "80%",
				}}
			>
				<title>{/* noop */}</title>
				<g
					strokeLinecap="round"
					strokeWidth="1.5"
					fill="none"
					stroke="currentColor"
					strokeLinejoin="round"
				>
					<polygon
						points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75"
						fill="currentColor"
						opacity=".3"
						strokeWidth="0"
						data-color="color-2"
					/>
					<polygon points="6.9851 1.75 10.6443 4.4354 14.9306 2.9443 13.5072 7.2539 16.25 10.8696 11.7117 10.8474 9.1208 14.5736 7.7392 10.2507 3.3946 8.9378 7.0788 6.2879 6.9851 1.75" />
					<line x1="2" y1="16" x2="5" y2="13" />
					<line x1="1.75" y1="12.25" x2="2.25" y2="11.75" />
					<line x1="5.75" y1="16.25" x2="6.25" y2="15.75" />
				</g>
			</svg>
		</div>,
		{
			...size,
		},
	);
}
