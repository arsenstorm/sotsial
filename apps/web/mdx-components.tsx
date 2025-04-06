import type { MDXComponents } from "mdx/types";

// skipcq: JS-C1003
import * as mdxComponents from "@/components/mdx";

export function useMDXComponents(components: MDXComponents) {
	return {
		...components,
		...mdxComponents,
	};
}
