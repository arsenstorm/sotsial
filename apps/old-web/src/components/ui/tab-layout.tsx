"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface TabLayoutItems {
  children: React.ReactNode;
  id: string;
  name: string;
}

export default function TabLayout({
  items = [],
}: {
  readonly items: TabLayoutItems[];
}) {
  return (
    <TabGroup defaultIndex={0}>
      <TabList className="flex gap-4">
        {items.map((item) => (
          <Tab
            className="rounded-full px-3 py-1 font-semibold text-sm/6 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[selected]:data-[hover]:bg-black/5 data-[hover]:bg-black/2.5 data-[selected]:bg-black/5 data-[focus]:outline-1 data-[focus]:outline-black dark:data-[selected]:data-[hover]:bg-white/5 dark:text-white dark:data-[hover]:bg-white/2.5 dark:data-[selected]:bg-white/5 dark:data-[focus]:outline-1 dark:data-[focus]:outline-white"
            disabled={item.children === null}
            key={item.id}
          >
            {item.name}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-3">
        {items.map((item) => (
          <TabPanel
            className="rounded-xl bg-black/5 p-3 dark:bg-white/5"
            key={item.id}
          >
            {item.children}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
