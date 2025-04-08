// Components
import { Logo } from "@/components/logo";
import Link from "next/link";

// Auth
import AuthCheckpoint from "@/utils/auth/checkpoint";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthCheckpoint ifAuthenticated="/home">
			<div className="bg-white text-black min-h-screen">
				<div className="max-w-2xl mx-auto px-4 min-md:border-x border-dashed border-black/10 min-h-screen flex flex-col">
					<header className="w-full py-6 mb-6 border-b border-dashed border-black/10 h-[88px] flex items-center">
						<div className="container mx-auto flex items-center justify-between">
							<Link href="/" className="flex items-center gap-2 text-black">
								<Logo className="w-6 h-6" />
								<span className="font-medium text-xl">Sotsial</span>
							</Link>
						</div>
					</header>
					<div className="flex-1 grow">{children}</div>
					<footer className="w-full py-6 mt-6 border-t border-dashed border-black/10">
						<div className="container mx-auto flex items-center justify-between">
							<p className="text-sm text-black/50">
								&copy; {new Date().getFullYear()} Arsen Shkrumelyak. All rights
								reserved.
							</p>
						</div>
					</footer>
				</div>
			</div>
		</AuthCheckpoint>
	);
}
