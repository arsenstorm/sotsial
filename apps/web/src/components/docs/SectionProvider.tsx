"use client";

import {
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
// skipcq: JS-W1029
import { type StoreApi, createStore, useStore } from "zustand";

import { remToPx } from "@/utils/remToPx";

export interface Section {
	id: string;
	title: string;
	offsetRem?: number;
	tag?: string;
	headingRef?: React.RefObject<HTMLHeadingElement>;
}

interface SectionState {
	sections: Array<Section>;
	visibleSections: Array<string>;
	setVisibleSections: (visibleSections: Array<string>) => void;
	registerHeading: ({
		id,
		ref,
		offsetRem,
	}: {
		id: string;
		ref: React.RefObject<HTMLHeadingElement>;
		offsetRem: number;
	}) => void;
}

function createSectionStore(sections: Array<Section>) {
	function updateSection(
		sections: Array<Section>,
		id: string,
		ref: React.RefObject<HTMLHeadingElement>,
		offsetRem: number,
	) {
		return sections.map((section) =>
			section.id === id ? { ...section, headingRef: ref, offsetRem } : section,
		);
	}

	return createStore<SectionState>()((set) => ({
		sections,
		visibleSections: [],
		setVisibleSections: (visibleSections) =>
			set((state) =>
				state.visibleSections.join() === visibleSections.join()
					? {}
					: { visibleSections },
			),
		registerHeading: ({ id, ref, offsetRem }) =>
			set((state) => ({
				sections: updateSection(state.sections, id, ref, offsetRem),
			})),
	}));
}

function useVisibleSections(sectionStore: StoreApi<SectionState>) {
	// skipcq: JS-W1029
	const setVisibleSections = useStore(
		sectionStore,
		(s) => s.setVisibleSections,
	);
	// skipcq: JS-W1029
	const sections = useStore(sectionStore, (s) => s.sections);

	useEffect(() => {
		function isVisible(
			top: number,
			bottom: number,
			scrollY: number,
			innerHeight: number,
		) {
			return (
				(top > scrollY && top < scrollY + innerHeight) ||
				(bottom > scrollY && bottom < scrollY + innerHeight) ||
				(top <= scrollY && bottom >= scrollY + innerHeight)
			);
		}

		function checkVisibleSections() {
			const { innerHeight, scrollY } = window;
			const newVisibleSections: string[] = [];

			sections.forEach((section, index) => {
				if (!section?.headingRef?.current) return;

				const { id, headingRef, offsetRem = 0 } = section;

				if (!headingRef.current) return;

				const offset = remToPx(offsetRem);
				const top = headingRef.current.getBoundingClientRect().top + scrollY;

				if (index === 0 && top - offset > scrollY) {
					newVisibleSections.push("_top");
				}

				const nextSection = sections[index + 1];
				const bottom =
					(nextSection?.headingRef?.current?.getBoundingClientRect().top ??
						Number.NEGATIVE_INFINITY) +
					scrollY -
					remToPx(nextSection?.offsetRem ?? 0);

				if (isVisible(top, bottom, scrollY, innerHeight)) {
					newVisibleSections.push(id);
				}
			});

			setVisibleSections(newVisibleSections);
		}

		const raf = window.requestAnimationFrame(() => checkVisibleSections());
		window.addEventListener("scroll", checkVisibleSections, { passive: true });
		window.addEventListener("resize", checkVisibleSections);

		return () => {
			window.cancelAnimationFrame(raf);
			window.removeEventListener("scroll", checkVisibleSections);
			window.removeEventListener("resize", checkVisibleSections);
		};
	}, [setVisibleSections, sections]);
}

const SectionStoreContext = createContext<StoreApi<SectionState> | null>(null);

const useIsomorphicLayoutEffect =
	typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SectionProvider({
	sections,
	children,
}: {
	readonly sections: Array<Section>;
	readonly children: React.ReactNode;
}) {
	const [sectionStore] = useState(() => createSectionStore(sections));

	useVisibleSections(sectionStore);

	useIsomorphicLayoutEffect(() => {
		sectionStore.setState({ sections });
	}, [sectionStore, sections]);

	return (
		<SectionStoreContext.Provider value={sectionStore}>
			{children}
		</SectionStoreContext.Provider>
	);
}

export function useSectionStore<T>(selector: (state: SectionState) => T) {
	const store = useContext(SectionStoreContext);

	try {
		return useStore(store!, selector); // skipcq: JS-0339, JS-W1029
	} catch (error) {
		console.warn("Unable to use section store outside of SectionProvider");
	}
}
