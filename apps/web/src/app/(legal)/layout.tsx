import { Footer } from "@/components/marketing/footer";

export default function LegalLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="max-w-3xl mx-auto">
			{children}
			<Footer className="!px-0 mt-8" />
		</div>
	);
}
