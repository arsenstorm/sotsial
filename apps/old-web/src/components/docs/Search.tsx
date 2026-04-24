"use client";

import {
  type AutocompleteApi,
  type AutocompleteCollection,
  type AutocompleteState,
  type BaseItem,
  createAutocomplete,
} from "@algolia/autocomplete-core";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Fragment,
  forwardRef,
  type RefObject,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";

import { navigation } from "@/components/docs/Navigation";
import { useCommandKey } from "@/utils/use-command-key";

export interface Result extends BaseItem {
  pageTitle: string;
  title: string;
  url: string;
}

type EmptyObject = Record<string, never>;

type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>;

function useAutocomplete({ close }: { close: () => void }) {
  const id = useId();
  const router = useRouter();
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result> | EmptyObject
  >({});

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) {
      return;
    }

    router.push(itemUrl);

    if (
      itemUrl ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close();
    }
  }

  const [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: "Find something...",
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      navigator: {
        navigate,
      },
      getSources({ query }) {
        // @ts-expect-error - dynamic import
        return import("@/mdx/search.mjs").then(({ search }) => [
          {
            sourceId: "documentation",
            getItems() {
              return search(query, { limit: 5 });
            },
            getItemUrl({ item }) {
              return item.url;
            },
            onSelect: navigate,
          },
        ]);
      },
    })
  );

  return { autocomplete, autocompleteState };
}

function SearchIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NoResultsIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12A4.237 4.237 0 0 1 9 13.25c-.635 0-1.237-.14-1.777-.388M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingIcon(props: Readonly<React.ComponentPropsWithoutRef<"svg">>) {
  const id = useId();

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HighlightQuery({
  text,
  query,
}: {
  readonly text: string;
  readonly query: string;
}) {
  return (
    <Highlighter
      autoEscape
      highlightClassName="underline bg-transparent text-amber-500"
      searchWords={[query]}
      textToHighlight={text}
    />
  );
}

function SearchResult({
  result,
  resultIndex,
  autocomplete,
  collection,
  query,
}: {
  readonly result: Result;
  readonly resultIndex: number;
  readonly autocomplete: Autocomplete;
  readonly collection: AutocompleteCollection<Result>;
  readonly query: string;
}) {
  const id = useId();

  const sectionTitle = navigation.find((section) =>
    section.links.find((link) => link.href === result.url.split("#")[0])
  )?.title;
  const hierarchy = [sectionTitle, result.pageTitle].filter(
    (x): x is string => typeof x === "string"
  );

  return (
    <li
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      className={clsx(
        "group block cursor-default px-4 py-3 aria-selected:bg-zinc-50 dark:aria-selected:bg-zinc-800/50",
        resultIndex > 0 && "border-zinc-100 border-t dark:border-zinc-800"
      )}
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        aria-hidden="true"
        className="font-medium text-sm text-zinc-900 group-aria-selected:text-amber-500 dark:text-white"
        id={`${id}-title`}
      >
        <HighlightQuery query={query} text={result.title} />
      </div>
      {hierarchy.length > 0 && (
        <div
          aria-hidden="true"
          className="mt-1 truncate whitespace-nowrap text-2xs text-zinc-500"
          id={`${id}-hierarchy`}
        >
          {hierarchy.map((item, itemIndex, items) => (
            <Fragment key={item}>
              <HighlightQuery query={query} text={item} />
              <span
                className={
                  itemIndex === items.length - 1
                    ? "sr-only"
                    : "mx-2 text-zinc-300 dark:text-zinc-700"
                }
              >
                /
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

function Quote({ children }: { readonly children: React.ReactNode }) {
  return (
    <strong className="break-words font-semibold text-zinc-900 dark:text-white">
      “{children}”
    </strong>
  );
}

function SearchResults({
  autocomplete,
  query,
  collection,
}: {
  readonly autocomplete: Autocomplete;
  readonly query: string;
  readonly collection?: AutocompleteCollection<Result>;
}) {
  if (!collection || collection.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
        <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
          Nothing found for <Quote>{query}</Quote>. Please try again.
        </p>
      </div>
    );
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result, resultIndex) => (
        <SearchResult
          autocomplete={autocomplete}
          collection={collection}
          key={result.url}
          query={query}
          result={result}
          resultIndex={resultIndex}
        />
      ))}
    </ul>
  );
}

const SearchInput = forwardRef<
  React.ElementRef<"input">,
  {
    autocomplete: Autocomplete;
    autocompleteState: AutocompleteState<Result> | EmptyObject;
    onClose: () => void;
  }
>(function SearchInput({ autocomplete, autocompleteState, onClose }, inputRef) {
  const inputProps = autocomplete.getInputProps({ inputElement: null });

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === "Escape" &&
        !autocompleteState.isOpen &&
        autocompleteState.query === ""
      ) {
        // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
        // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }

        onClose();
      } else {
        inputProps.onKeyDown(event);
      }
    },
    [
      autocompleteState.isOpen,
      autocompleteState.query,
      onClose,
      inputProps.onKeyDown,
    ]
  );

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute top-0 left-3 h-full w-5 stroke-zinc-500" />
      <input
        className={clsx(
          "flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
          autocompleteState.status === "stalled" ? "pr-11" : "pr-4"
        )}
        data-autofocus
        ref={inputRef}
        {...inputProps}
        onKeyDown={handleKeyDown}
      />
      {autocompleteState.status === "stalled" && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-5 w-5 animate-spin stroke-zinc-200 text-zinc-900 dark:stroke-zinc-800 dark:text-amber-400" />
        </div>
      )}
    </div>
  );
});

const SearchResultsPanel = ({
  panelRef,
  autocomplete,
  autocompleteState,
}: {
  readonly panelRef: React.RefObject<HTMLDivElement>;
  readonly autocomplete: Autocomplete;
  readonly autocompleteState: AutocompleteState<Result> | EmptyObject;
}) => (
  <div
    className="border-zinc-200 border-t bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
    ref={panelRef}
    {...autocomplete.getPanelProps({})}
  >
    {autocompleteState.isOpen && (
      <SearchResults
        autocomplete={autocomplete}
        collection={autocompleteState.collections[0]}
        query={autocompleteState.query}
      />
    )}
  </div>
);
// unused constant: SearchDialogContent
const SearchDialogContent = ({
  formRef,
  inputRef,
  panelRef,
  autocomplete,
  autocompleteState,
  onClose,
}: {
  readonly formRef: React.RefObject<HTMLFormElement>;
  readonly inputRef: React.RefObject<HTMLInputElement>;
  readonly panelRef: React.RefObject<HTMLDivElement>;
  readonly autocomplete: Autocomplete;
  readonly autocompleteState: AutocompleteState<Result> | EmptyObject;
  readonly onClose: () => void;
}) => (
  <div {...autocomplete.getRootProps({})}>
    <form
      ref={formRef}
      {...autocomplete.getFormProps({ inputElement: inputRef.current })}
    >
      <SearchInput
        autocomplete={autocomplete}
        autocompleteState={autocompleteState}
        onClose={onClose}
        ref={inputRef}
      />
      <SearchResultsPanel
        autocomplete={autocomplete}
        autocompleteState={autocompleteState}
        panelRef={panelRef}
      />
    </form>
  </div>
);

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly className?: string;
}) {
  const formRef = useRef<React.ElementRef<"form">>(null);
  const panelRef = useRef<React.ElementRef<"div">>(null);
  const inputRef = useRef<React.ElementRef<typeof SearchInput>>(null);
  const { autocomplete, autocompleteState } = useAutocomplete({
    close() {
      setOpen(false);
    },
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is okay.
  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams, setOpen]);

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    // skipcq: JS-0045
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  const handleDialogClose = useCallback(() => {
    setOpen(false);
    autocomplete.setQuery("");
  }, [setOpen, autocomplete]);

  return (
    <Dialog
      className={clsx("fixed inset-0 z-50", className)}
      onClose={handleDialogClose}
      open={open}
    >
      <DialogBackdrop
        className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black/40"
        transition
      />

      <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
        <DialogPanel
          className="mx-auto transform-gpu overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:max-w-xl dark:bg-zinc-900 dark:ring-zinc-800"
          transition
        >
          <SearchDialogContent
            autocomplete={autocomplete}
            autocompleteState={autocompleteState}
            formRef={formRef as RefObject<HTMLFormElement>}
            inputRef={inputRef as RefObject<HTMLInputElement>}
            onClose={handleDialogClose}
            panelRef={panelRef as RefObject<HTMLDivElement>}
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function useSearchProps() {
  const buttonRef = useRef<React.ElementRef<"button">>(null);
  const [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen: useCallback((open: boolean) => {
        const { width = 0, height = 0 } =
          buttonRef.current?.getBoundingClientRect() ?? {};
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      }, []),
    },
  };
}

export function Search() {
  const [modifierKey, setModifierKey] = useState<string>();
  const { buttonProps, dialogProps } = useSearchProps();

  const { key } = useCommandKey();

  useEffect(() => {
    setModifierKey(key);
  }, [key]);

  return (
    <div className="hidden lg:block lg:max-w-md lg:flex-auto">
      <button
        className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pr-3 pl-2 text-sm text-zinc-500 ui-not-focus-visible:outline-none ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 lg:flex dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10 dark:ring-inset dark:hover:ring-white/20"
        type="button"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-current" />
        Find something...
        <kbd className="ml-auto text-2xs text-zinc-500/70 dark:text-zinc-400/70">
          <kbd className="">{modifierKey}</kbd>
          <kbd className="">+</kbd>
          <kbd className="">K</kbd>
        </kbd>
      </button>
      <Suspense fallback={null}>
        <SearchDialog className="hidden lg:block" {...dialogProps} />
      </Suspense>
    </div>
  );
}

export function MobileSearch() {
  const { buttonProps, dialogProps } = useSearchProps();

  return (
    <div className="contents lg:hidden">
      <button
        aria-label="Find something..."
        className="flex h-6 w-6 items-center justify-center rounded-md ui-not-focus-visible:outline-none transition hover:bg-zinc-900/5 lg:hidden dark:hover:bg-white/5"
        type="button"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
      </button>
      <Suspense fallback={null}>
        <SearchDialog className="lg:hidden" {...dialogProps} />
      </Suspense>
    </div>
  );
}
