import { Button } from "@/components/docs/Button";
import { Heading } from "@/components/docs/Heading";

const guides = [
  {
    href: "/authentication",
    name: "Authentication",
    description: "Learn how to authenticate your API requests.",
  },
  {
    href: "/pagination",
    name: "Pagination",
    description: "Understand how to work with paginated responses.",
  },
  {
    href: "/errors",
    name: "Errors",
    description:
      "Read about the different types of errors returned by the API.",
  },
  {
    href: "/webhooks",
    name: "Webhooks",
    description:
      "Learn how to programmatically configure webhooks for your app.",
  },
];

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading id="guides" level={2}>
        Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-zinc-900/5 border-t pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button arrow="right" href={guide.href} variant="text">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
