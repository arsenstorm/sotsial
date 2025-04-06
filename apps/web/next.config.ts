import type { NextConfig } from "next";

import nextMDX from "@next/mdx";

import { recmaPlugins } from "./src/mdx/recma.mjs";
import { rehypePlugins } from "./src/mdx/rehype.mjs";
import { remarkPlugins } from "./src/mdx/remark.mjs";

// MDX Search
import withSearch from "./src/mdx/search.mjs";

const withMDX = nextMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins,
		rehypePlugins,
		recmaPlugins,
	},
});

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
	outputFileTracingIncludes: {
		"/docs/**/*": ["./src/docs/**/*.mdx"],
	},
	allowedDevOrigins: ["next.local", "localhost", "127.0.0.1"],
};

export default withSearch(withMDX(nextConfig));
