// Components
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

// Icons
import {
	TiktokIcon,
	FacebookIcon,
	InstagramIcon,
	LinkedinIcon,
	MediumIcon,
	ThreadsIcon,
	XTwitterIcon,
	YoutubeIcon,
} from "@/icons/logos";

export default function Home() {
	return (
		<main className="mx-auto px-4 max-w-7xl relative flex flex-col">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col items-start justify-center min-h-[calc(100dvh-16*4px)] max-w-xl text-balance gap-y-4">
					<Heading className="text-4xl sm:text-6xl md:text-7xl font-bold font-boska">
						API-first content
						<br className="hidden sm:inline" /> publishing for all
						<br className="hidden sm:inline" /> social platforms
					</Heading>
					<p className="text-lg text-zinc-700 dark:text-zinc-300">
						Sotsial allows you to connect all your social media accounts and
						publish to them with a single API call.
					</p>
					<div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
						<Button
							href="/continue"
							color="dark/white"
							className="w-full sm:w-auto text-xs sm:text-md"
						>
							Get your API Key &rarr;
						</Button>
						<Button
							plain
							href="/docs"
							className="w-full sm:w-auto text-xs sm:text-md"
						>
							Read the docs &rarr;
						</Button>
					</div>
				</div>

				{/* Platforms Section */}
				<section className="py-20">
					<div className="max-w-5xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold mb-6 font-boska">
								One API, all social platforms
							</h2>
							<p className="max-w-2xl mx-auto">
								Connect and publish to all major social media platforms with a
								single API call.
							</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
							{[
								{ name: "Twitter", icon: <XTwitterIcon /> },
								{ name: "Instagram", icon: <InstagramIcon /> },
								{ name: "LinkedIn", icon: <LinkedinIcon /> },
								{ name: "Threads", icon: <ThreadsIcon /> },
								{ name: "Facebook", icon: <FacebookIcon /> },
								{ name: "Medium", icon: <MediumIcon /> },
								{ name: "YouTube", icon: <YoutubeIcon /> },
								{ name: "TikTok", icon: <TiktokIcon /> },
							].map((platform) => (
								<div
									key={platform.name}
									className="flex flex-col items-center justify-center p-6 hover:shadow-md transition-shadow border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-100 dark:bg-zinc-800"
								>
									<div className="h-12 w-12 mb-4 flex items-center justify-center">
										{platform.icon}
									</div>
									<p className="text-center font-medium">{platform.name}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-20 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
					<div className="max-w-5xl mx-auto">
						<div className="text-center">
							<h2 className="text-2xl sm:text-5xl font-bold mb-4 font-boska">
								Designed for developers
							</h2>
							<p className="max-w-2xl mx-auto text-zinc-700 dark:text-zinc-300 text-balance text-lg">
								Sotsial provides developers with powerful tools to integrate
								social publishing into their applications.
							</p>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="py-20">
					<div className="max-w-5xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-2xl sm:text-3xl font-bold mb-2 font-boska">
								How it works
							</h2>
							<p className="max-w-2xl mx-auto text-zinc-700 dark:text-zinc-300 text-balance text-lg">
								Get up and running with Sotsial in minutes.
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									title: "Get your API Key",
									description:
										"Sign up with GitHub, add your payment method, and get your API key.",
								},
								{
									title: "Connect your accounts",
									description:
										"Connect all your social media accounts to the Sotsial platform.",
								},
								{
									title: "Start publishing",
									description:
										"Use the API to publish your content to all connected platforms.",
								},
							].map((step, index) => (
								<div key={step.title} className="flex flex-col items-center">
									<div className="h-12 w-12 mb-4 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-700 text-white font-bold text-lg">
										{index + 1}
									</div>
									<h3 className="text-lg font-bold mb-2 text-center">
										{step.title}
									</h3>
									<p className="text-sm text-center text-zinc-700 dark:text-zinc-300 text-balance">
										{step.description}
									</p>
								</div>
							))}
						</div>

						<div className="mt-12 text-center">
							<Button href="/continue" color="dark" className="text-sm">
								Get started &rarr;
							</Button>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
