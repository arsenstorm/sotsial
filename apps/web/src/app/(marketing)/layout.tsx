// Components
import { Footer } from "@/components/marketing/footer";
import { TextLink } from "@/components/ui/text";
import { Logo } from "@/components/logo";

export default function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 relative">
			<div className="sticky bottom-0 w-full bg-zinc-100 dark:bg-zinc-900 z-10">
				<header className="h-16 flex flex-row items-center justify-between w-full max-w-7xl mx-auto">
					<div className="px-4 flex flex-row justify-between items-center py-4 font-semibold relative z-10 w-full">
						<TextLink
							href="/"
							className="flex flex-row items-center gap-x-2 font-semibold"
						>
							<Logo className="h-6" />
							Sotsial
						</TextLink>
						<div className="flex flex-row gap-x-6">
							<TextLink href="/continue">
								Dashboard
							</TextLink>
							<TextLink href="/docs" className="hidden md:inline-flex">
								Docs
							</TextLink>
							<TextLink href="/pricing" className="hidden md:inline-flex">
								Pricing
							</TextLink>
						</div>
					</div>
				</header>
			</div>

			<div className="relative z-[1] w-full max-w-7xl mx-auto px-4 sm:px-8 bg-white dark:bg-black rounded-4xl">
				{children}
			</div>

			<Footer className="w-full max-w-7xl mx-auto mt-6" />
		</div>
	);
}
