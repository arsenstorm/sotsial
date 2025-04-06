"use client";

import Image, { type ImageProps } from "next/image";
import { Link } from "@/components/ui/link";
import clsx from "clsx";

import { Feedback } from "@/components/docs/Feedback";
import { Heading } from "@/components/docs/Heading";
import { Prose } from "@/components/docs/Prose";

export { Button } from "@/components/docs/Button";
export { CodeGroup, Code as code, Pre as pre } from "@/components/docs/Code";

export const a = Link;

type ImagePropsWithOptionalAlt = Omit<ImageProps, "alt"> & { alt?: string };

export const img = function Img(props: ImagePropsWithOptionalAlt) {
	return (
		<div className="relative mt-8 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-900 [&+*]:mt-8">
			<Image
				alt=""
				sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 45vw, (min-width: 640px) 32rem, 95vw"
				{...props}
			/>
			<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-zinc-900/10 dark:ring-white/10" />
		</div>
	);
};

export const h2 = function H2(
	props: Omit<React.ComponentPropsWithoutRef<typeof Heading>, "level">,
) {
	return <Heading level={2} {...props} />;
};

function ContentWrapper({
	className,
	...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
	return (
		<div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
			<div className="lg:ml-96 lg:flex lg:w-full lg:justify-end lg:pl-32">
				<div
					className={clsx(
						"mx-auto max-w-lg lg:mx-0 lg:w-0 lg:max-w-xl lg:flex-auto",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
}

export function wrapper({ children }: { readonly children: React.ReactNode }) {
	return (
		<article className="flex h-full flex-col pb-10 pt-16">
			<Prose className="flex-auto">{children}</Prose>
			<footer className="mx-auto mt-16 w-full max-w-2xl lg:max-w-5xl">
				<Feedback />
			</footer>
		</article>
	);
}

function InfoIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
			<circle cx="8" cy="8" r="8" strokeWidth="0" />
			<path
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
				d="M6.75 7.75h1.5v3.5"
			/>
			<circle cx="8" cy="4" r=".5" fill="none" />
		</svg>
	);
}

export function Tip({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/5 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Note({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-blue-500/20 bg-blue-50/5 p-4 leading-6 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/5 dark:text-blue-200 dark:[--tw-prose-links-hover:theme(colors.blue.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-blue-500 stroke-white dark:fill-blue-200/20 dark:stroke-blue-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Warn({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-50/50 p-4 leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/5 dark:text-amber-200 dark:[--tw-prose-links-hover:theme(colors.amber.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-amber-500 stroke-white dark:fill-amber-200/20 dark:stroke-amber-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Danger({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6 flex gap-2.5 rounded-2xl border border-red-500/20 bg-red-50/50 p-4 leading-6 text-red-900 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-200 dark:[--tw-prose-links-hover:theme(colors.red.300)] dark:[--tw-prose-links:theme(colors.white)]">
			<InfoIcon className="mt-1 h-4 w-4 flex-none fill-red-500 stroke-white dark:fill-red-200/20 dark:stroke-red-200" />
			<div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
				{children}
			</div>
		</div>
	);
}

export function Row({ children }: { readonly children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
			{children}
		</div>
	);
}

export function Col({
	children,
	sticky = false,
}: {
	readonly children: React.ReactNode;
	readonly sticky?: boolean;
}) {
	return (
		<div
			className={clsx(
				"[&>:first-child]:mt-0 [&>:last-child]:mb-0",
				sticky && "xl:sticky xl:top-24",
			)}
		>
			{children}
		</div>
	);
}

export function Properties({
	children,
}: { readonly children: React.ReactNode }) {
	return (
		<div className="my-6">
			<ul className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5">
				{children}
			</ul>
		</div>
	);
}

export function Property({
	name,
	children,
	type,
	defaultValue,
	required = false,
	sometimes = false,
}: {
	readonly name: string;
	readonly children: React.ReactNode;
	readonly type?: string;
	readonly defaultValue?: string;
	readonly required?: boolean;
	readonly sometimes?: boolean;
}) {
	let statusElement = (
		<>
			<dt className="sr-only">Optional</dt>
			<dd className="text-xs text-emerald-500 dark:text-green-500/80">
				optional
			</dd>
		</>
	);

	if (sometimes) {
		statusElement = (
			<>
				<dt className="sr-only">Sometimes Required</dt>
				<dd className="text-xs text-amber-400 dark:text-amber-500">
					sometimes required
				</dd>
			</>
		);
	}

	if (required) {
		statusElement = (
			<>
				<dt className="sr-only">Required</dt>
				<dd className="text-xs text-red-400 dark:text-red-500">required</dd>
			</>
		);
	}

	return (
		<li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
			<dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
				<dt className="sr-only">Name</dt>
				<dd>
					<code>{name}</code>
				</dd>
				{type && (
					<>
						<dt className="sr-only">Type</dt>
						<dd className="text-xs text-zinc-400 dark:text-zinc-500">{type}</dd>
					</>
				)}
				{defaultValue && (
					<>
						<dt className="sr-only">Default</dt>
						<dd className="text-xs text-zinc-400 dark:text-zinc-500">
							default: {defaultValue}
						</dd>
					</>
				)}
				{statusElement}
				<dt className="sr-only">Description</dt>
				<dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
					{children}
				</dd>
			</dl>
		</li>
	);
}
