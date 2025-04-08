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
		<div className="flex flex-col">
			<div className="flex flex-col gap-6">
				<h1 className="text-4xl font-medium text-balance">
					API-first content publishing for all social platforms
				</h1>
				<p className="text-lg text-balance">
					Sotsial allows you to connect all your social media accounts and
					publish to them with a single API call.
				</p>
			</div>

			<hr className="my-6 border-dashed border-black/10" />

			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-medium text-balance">One API, all social platforms</h2>
				<p className="text-base text-balance">
					Connect and publish to all major social media platforms with a single API call.
				</p>
				
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
							className="flex flex-col items-center justify-center p-4 border border-dashed border-black/10 rounded-lg"
						>
							<div className="h-8 w-8 mb-2 flex items-center justify-center">
								{platform.icon}
							</div>
							<p className="text-center text-sm font-medium">{platform.name}</p>
						</div>
					))}
				</div>
			</div>

			<hr className="my-6 border-dashed border-black/10" />

			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-medium text-balance">Designed for developers</h2>
				<p className="text-base text-balance">
					Sotsial provides developers with powerful tools to integrate social publishing into their applications.
				</p>
			</div>

			<hr className="my-6 border-dashed border-black/10" />

			<div className="flex flex-col gap-2">
				<h2 className="text-2xl font-medium text-balance">How it works</h2>
				<p className="text-base text-balance">
					Get up and running with Sotsial in minutes.
				</p>

				<div className="grid gap-3 mt-4">
					{[
						{
							title: "Get your API Key",
							description: "Sign up with GitHub, add your payment method, and get your API key.",
						},
						{
							title: "Connect your accounts",
							description: "Connect all your social media accounts to the Sotsial platform.",
						},
						{
							title: "Start publishing",
							description: "Use the API to publish your content to all connected platforms.",
						},
					].map((step, index) => (
						<div key={step.title} className="flex flex-col">
							<div className="text-lg font-bold">
								{index + 1}. {step.title}
							</div>
							<p className="text-sm text-black/70 text-balance">
								{step.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
