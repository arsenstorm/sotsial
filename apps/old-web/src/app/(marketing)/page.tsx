// Icons
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MediumIcon,
  ThreadsIcon,
  TiktokIcon,
  XTwitterIcon,
  YoutubeIcon,
} from "@/icons/logos";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6">
        <h1 className="text-balance font-medium text-4xl">
          API-first content publishing for all social platforms
        </h1>
        <p className="text-balance text-lg">
          Sotsial allows you to connect all your social media accounts and
          publish to them with a single API call.
        </p>
      </div>

      <hr className="my-6 border-black/10 border-dashed" />

      <div className="flex flex-col gap-2">
        <h2 className="text-balance font-medium text-2xl">
          One API, all social platforms
        </h2>
        <p className="text-balance text-base">
          Connect and publish to all major social media platforms with a single
          API call.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
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
              className="flex flex-col items-center justify-center rounded-lg border border-black/10 border-dashed p-4"
              key={platform.name}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center">
                {platform.icon}
              </div>
              <p className="text-center font-medium text-sm">{platform.name}</p>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6 border-black/10 border-dashed" />

      <div className="flex flex-col gap-2">
        <h2 className="text-balance font-medium text-2xl">
          Designed for developers
        </h2>
        <p className="text-balance text-base">
          Sotsial provides developers with powerful tools to integrate social
          publishing into their applications.
        </p>
      </div>

      <hr className="my-6 border-black/10 border-dashed" />

      <div className="flex flex-col gap-2">
        <h2 className="text-balance font-medium text-2xl">How it works</h2>
        <p className="text-balance text-base">
          Get up and running with Sotsial in minutes.
        </p>

        <div className="mt-4 grid gap-3">
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
            <div className="flex flex-col" key={step.title}>
              <div className="font-bold text-lg">
                {index + 1}. {step.title}
              </div>
              <p className="text-balance text-black/70 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
