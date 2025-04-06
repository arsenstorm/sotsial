// UI
import { Text, TextLink } from "@/components/ui/text";
import { Subheading } from "@/components/ui/heading";

// Utils
import clsx from "clsx";

// Components
import { Logo } from "@/components/logo";

export function Footer({
	className,
	simpleFooter,
	forceDark,
}: Readonly<{
	className?: string;
	simpleFooter?: boolean;
	forceDark?: boolean;
}>) {
	return (
		<footer
			className={clsx(
				"max-w-7xl mx-auto px-4 flex flex-col gap-y-8 sm:gap-y-16",
				className,
			)}
		>
			{!simpleFooter && (
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
					<div className="md:col-span-7">
						<TextLink
							href="/"
							className={clsx(
								"flex flex-row items-center gap-x-2 font-semibold",
								forceDark && "!text-black",
							)}
						>
							<Logo className="h-6" />
							Sotsial
						</TextLink>
					</div>
					<div className="md:col-span-5 flex flex-col md:flex-row gap-4 md:justify-between">
						<div>
							<Subheading
								className={clsx(forceDark && "!text-black !decoration-black")}
							>
								Links
							</Subheading>
							<ul>
								<li>
									<Text>
										<TextLink
											href="/docs"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											Documentation
										</TextLink>
									</Text>
								</li>
								<li>
									<Text>
										<TextLink
											href="/pricing"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											Pricing
										</TextLink>
									</Text>
								</li>
								<li>
									<Text>
										<TextLink
											href="https://github.com/arsenstorm/sotsial"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											GitHub
										</TextLink>
									</Text>
								</li>
							</ul>
						</div>
						<div>
							<Subheading
								className={clsx(forceDark && "!text-black !decoration-black")}
							>
								Important Stuff
							</Subheading>
							<ul>
								<li>
									<Text>
										<TextLink
											href="/privacy"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											Privacy Policy
										</TextLink>
									</Text>
								</li>
								<li>
									<Text>
										<TextLink
											href="/security"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											Security Policy
										</TextLink>
									</Text>
								</li>
								<li>
									<Text>
										<TextLink
											href="/terms"
											className={clsx(
												forceDark && "!text-black !decoration-black",
											)}
										>
											Terms of Service
										</TextLink>
									</Text>
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}
			<div className="flex flex-col sm:flex-row sm:items-center py-4 gap-2 sm:justify-between">
				<Text className={clsx(forceDark && "!text-black")}>
					&copy; 2025 Sotsial. All rights reserved.
				</Text>
				<Text className={clsx(forceDark && "!text-black")}>
					Made with ❤️ by{" "}
					<TextLink
						href="https://arsenstorm.com?ref=sotsial"
						className={clsx(
							"underline-offset-2",
							forceDark && "!text-black !decoration-black",
						)}
					>
						Arsen Shkrumelyak
					</TextLink>
					.
				</Text>
			</div>
		</footer>
	);
}
