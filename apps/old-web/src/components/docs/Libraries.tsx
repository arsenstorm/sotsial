"use client";

import Image from "next/image";
import { Button } from "@/components/docs/Button";
import { Heading } from "@/components/docs/Heading";
import logoGo from "@/images/logos/go.svg";
import logoNode from "@/images/logos/node.svg";
import logoPhp from "@/images/logos/php.svg";
import logoPython from "@/images/logos/python.svg";
import logoRuby from "@/images/logos/ruby.svg";

const libraries = [
  {
    href: "#",
    name: "PHP",
    description:
      "A popular general-purpose scripting language that is especially suited to web development.",
    logo: logoPhp,
  },
  {
    href: "#",
    name: "Ruby",
    description:
      "A dynamic, open source programming language with a focus on simplicity and productivity.",
    logo: logoRuby,
  },
  {
    href: "#",
    name: "Node.js",
    description:
      "Node.js® is an open-source, cross-platform JavaScript runtime environment.",
    logo: logoNode,
  },
  {
    href: "#",
    name: "Python",
    description:
      "Python is a programming language that lets you work quickly and integrate systems more effectively.",
    logo: logoPython,
  },
  {
    href: "#",
    name: "Go",
    description:
      "An open-source programming language supported by Google with built-in concurrency.",
    logo: logoGo,
  },
];

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading id="official-libraries" level={2}>
        Official libraries
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-zinc-900/5 border-t pt-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-white/5">
        {libraries.map((library) => (
          <div className="flex flex-row-reverse gap-6" key={library.name}>
            <div className="flex-auto">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
                {library.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {library.description}
              </p>
              <p className="mt-4">
                <Button arrow="right" href={library.href} variant="text">
                  Read more
                </Button>
              </p>
            </div>
            <div className="aspect-square max-w-12">
              <Image
                alt={`${library.name} logo`}
                className="h-12 w-12"
                src={library.logo}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
