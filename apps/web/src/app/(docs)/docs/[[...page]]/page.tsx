// Next
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import glob from "fast-glob";

// React
import type { ComponentType } from "react";

let docsCache: Record<string, ComponentType> | null = null;
let metadataCache: Record<string, Metadata | undefined> | null = null;

async function getDocsData() {
	if (docsCache && metadataCache) {
		return { docs: docsCache, metadata: metadataCache };
	}

	const pages = await glob("**/*.mdx", { cwd: "src/docs" });

	docsCache = {};
	metadataCache = {};

	await Promise.all(
		pages.map(async (filename) => {
			const path = `/${filename.replace(/page\.mdx$/, "")}`.replace(/\/$/, "");

			try {
				const doc = await import(`@/docs/${filename}`);

				for (const p of [path]) {
					if (p === "") {
						docsCache!["/"] = doc.default;
						metadataCache!["/"] = doc.metadata;
					} else {
						docsCache![p] = doc.default;
						metadataCache![p] = doc.metadata;
					}
				}
			} catch (error) {
				console.error(`Failed to import ${filename}:`, error);
			}
		}),
	);

	return { docs: docsCache, metadata: metadataCache };
}

export async function generateMetadata({
	params,
}: Readonly<{ params: Promise<{ page?: string[] }> }>) {
	const { page = [] } = await params;
	const path = `/${page.join("/")}`;
	const { metadata } = await getDocsData();
	return metadata[path] ?? {};
}

export default async function DocsPage({
	params,
}: Readonly<{ params: Promise<{ page?: string[] }> }>) {
	const { page = [] } = await params;

	const path = `/${page.join("/")}`;

	const { docs } = await getDocsData();

	const Component = docs[path];

	if (!Component) {
		return notFound();
	}

	return <Component />;
}

export async function generateStaticParams() {
	const { docs } = await getDocsData();
	const paths = Object.keys(docs);
	return paths.map((path) => ({
		page: path === "/" ? [] : path.split("/").slice(1),
	}));
}
