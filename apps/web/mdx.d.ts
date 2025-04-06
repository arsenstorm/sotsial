declare module "*.mdx" {
	import type { ComponentType } from "react";
	import type { Metadata } from "next";

	const component: ComponentType;
	export default component;

	export const metadata: Metadata | undefined;
}
