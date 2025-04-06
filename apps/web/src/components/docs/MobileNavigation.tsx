"use client";

import {
	createContext,
	Suspense,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
	Dialog,
	DialogPanel,
	DialogBackdrop,
	TransitionChild,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { create } from "zustand";

import { Header } from "@/components/docs/Header";
import { Navigation } from "@/components/docs/Navigation";

function MenuIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg
			viewBox="0 0 10 9"
			fill="none"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M.5 1h9M.5 8h9M.5 4.5h9" />
		</svg>
	);
}

function XIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
	return (
		<svg
			viewBox="0 0 10 9"
			fill="none"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="m1.5 1 7 7M8.5 1l-7 7" />
		</svg>
	);
}

const IsInsideMobileNavigationContext = createContext<boolean>(false);

function MobileNavigationDialog({
	isOpen,
	close,
}: {
	readonly isOpen: boolean;
	readonly close: () => void;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const initialPathname = useRef(pathname).current;
	const initialSearchParams = useRef(searchParams).current;

	useEffect(() => {
		if (pathname !== initialPathname || searchParams !== initialSearchParams) {
			close();
		}
	}, [pathname, searchParams, close, initialPathname, initialSearchParams]);

	const onClickDialog = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!(event.target instanceof HTMLElement)) {
				return;
			}

			const link = event.target.closest("a");
			if (
				link &&
				link.pathname + link.search + link.hash ===
					window.location.pathname +
						window.location.search +
						window.location.hash
			) {
				close();
			}
		},
		[close],
	);

	return (
		<Dialog
			open={isOpen}
			onClickCapture={onClickDialog}
			onClose={close}
			className="fixed inset-0 z-50 lg:hidden"
		>
			<DialogBackdrop
				transition
				className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black/40"
			/>

			<DialogPanel>
				<TransitionChild>
					<Header className="data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />
				</TransitionChild>

				<TransitionChild>
					<motion.div
						layoutScroll
						className="fixed bottom-0 left-0 top-14 w-full overflow-y-auto bg-white px-4 pb-4 pt-6 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 duration-500 ease-in-out data-[closed]:-translate-x-full min-[416px]:max-w-sm sm:px-6 sm:pb-10 dark:bg-zinc-900 dark:ring-zinc-800"
					>
						<Navigation />
					</motion.div>
				</TransitionChild>
			</DialogPanel>
		</Dialog>
	);
}

export function useIsInsideMobileNavigation() {
	return useContext(IsInsideMobileNavigationContext);
}

export const useMobileNavigationStore = create<{
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}>()((set) => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export function MobileNavigation() {
	const isInsideMobileNavigation = useIsInsideMobileNavigation();
	const { isOpen, toggle, close } = useMobileNavigationStore();
	const ToggleIcon = isOpen ? XIcon : MenuIcon;

	return (
		<IsInsideMobileNavigationContext.Provider value>
			<button
				type="button"
				className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
				aria-label="Toggle navigation"
				onClick={toggle}
			>
				<ToggleIcon className="w-2.5 stroke-zinc-900 dark:stroke-white" />
			</button>
			{!isInsideMobileNavigation && (
				<Suspense fallback={null}>
					<MobileNavigationDialog isOpen={isOpen} close={close} />
				</Suspense>
			)}
		</IsInsideMobileNavigationContext.Provider>
	);
}
