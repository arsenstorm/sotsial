"use client";

import { Link } from "@/components/ui/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/docs/Button";
import { navigation } from "@/components/docs/Navigation";
import { Footer } from "@/components/marketing/footer";
import { Divider } from "@/components/ui/divider";

function PageLink({
	label,
	page,
	previous = false,
}: {
	readonly label: string;
	readonly page: { href: string; title: string };
	readonly previous?: boolean;
}) {
	return (
		<>
			<Button
				href={page.href}
				aria-label={`${label}: ${page.title}`}
				variant="secondary"
				arrow={previous ? "left" : "right"}
			>
				{label}
			</Button>
			<Link
				href={page.href}
				tabIndex={-1}
				aria-hidden="true"
				className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
			>
				{page.title}
			</Link>
		</>
	);
}

function PageNavigation() {
	const pathname = usePathname();
	const allPages = navigation.flatMap((group) => group.links);
	const currentPageIndex = allPages.findIndex((page) => page.href === pathname);

	if (currentPageIndex === -1) {
		return null;
	}

	const previousPage = allPages[currentPageIndex - 1];
	const nextPage = allPages[currentPageIndex + 1];

	if (!previousPage && !nextPage) {
		return null;
	}

	return (
		<div className="flex">
			{previousPage && (
				<div className="flex flex-col items-start gap-3">
					<PageLink label="Previous" page={previousPage} previous />
				</div>
			)}
			{nextPage && (
				<div className="ml-auto flex flex-col items-end gap-3">
					<PageLink label="Next" page={nextPage} />
				</div>
			)}
		</div>
	);
}

export function DocsFooter() {
	return (
		<footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
			<PageNavigation />
			<Divider />
			<Footer className="!px-0 mt-8" />
		</footer>
	);
}
