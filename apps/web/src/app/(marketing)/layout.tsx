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
			<div className="fixed top-0 left-0 right-0 bottom-16 w-full z-0">
				<div className="h-full w-full max-w-7xl mx-auto rounded-b-2xl sm:rounded-b-4xl bg-white dark:bg-black" />
			</div>

			<div className="relative z-[1] w-full max-w-7xl mx-auto px-4 sm:px-8">
				<div className="bg-white dark:bg-black rounded-b-2xl sm:rounded-b-4xl relative z-[1]">
					{children}
				</div>
				<div className="relative -mx-6">
					<Footer simpleFooter className="w-full max-w-7xl mx-auto" />
				</div>
			</div>

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
							<TextLink href="/continue" className="hidden md:inline-flex">
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
		</div>
	);
}
