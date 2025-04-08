// Components
import { TextLink } from "@/components/ui/text";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="bg-white text-black min-h-screen">
			<div className="max-w-2xl mx-auto px-4 min-md:border-x border-dashed border-black/10 min-h-screen flex flex-col">
				<header className="w-full py-6 mb-6 border-b border-dashed border-black/10">
					<div className="container mx-auto flex items-center justify-between">
						<Link href="/" className="flex items-center gap-2 text-black">
							<Logo className="w-6 h-6" />
							<span className="font-medium text-xl">Sotsial</span>
						</Link>

						<div className="flex items-center gap-6">
							<Link
								href="/docs"
								className="text-sm text-black/70 hover:text-black"
							>
								Docs
							</Link>
							<Link
								href="/pricing"
								className="text-sm text-black/70 hover:text-black"
							>
								Pricing
							</Link>
							<Link
								href="/continue"
								className="bg-black text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
							>
								Dashboard &rarr;
							</Link>
						</div>
					</div>
				</header>
				<div className="flex-1 grow">{children}</div>
				<footer className="w-full py-6 mt-6 border-t border-dashed border-black/10">
					<div className="container mx-auto flex items-center justify-between">
						<p className="text-sm text-black/50">
							&copy; {new Date().getFullYear()} Arsen Shkrumelyak. All rights reserved.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}
