import clsx from "clsx";
import type { Connection } from "@/app/(app)/posting/page.client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Subheading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { platformDetails } from "@/config/platform-details";
import { ArrowTriangleLineRightIcon } from "@/icons/ui";

interface AccountSelectionProps {
  connections: Connection[];
  error: string | null;
  isLoading: boolean;
  onContinue: () => void;
  onToggleConnection: (connection: Connection) => void;
  selectedConnections: Connection[];
}

export function AccountSelection({
  connections,
  selectedConnections,
  isLoading,
  error,
  onToggleConnection,
  onContinue,
}: AccountSelectionProps) {
  // Helper function to render connection cards
  const renderConnectionCard = (connection: Connection) => {
    const isSelected = selectedConnections.some((c) => c.id === connection.id);
    const Logo =
      platformDetails[connection.platform as keyof typeof platformDetails]
        ?.logo ?? null;

    return (
      <div
        className={clsx(
          "flex items-center gap-2 rounded-full border px-3 py-1.5",
          isSelected
            ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
            : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        )}
        key={connection.id}
        onClick={() => onToggleConnection(connection)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleConnection(connection);
          }
        }}
      >
        {Logo && <Logo className="size-5" />}
        <Avatar
          className="size-6"
          initials={
            connection.account?.avatar
              ? undefined
              : (connection.account?.username ?? "?").slice(0, 1)
          }
          square
          src={connection.account?.avatar}
        />
        <Text
          className="text-sm"
          title={connection.account?.username ?? "no username"}
        >
          {connection.account?.username ?? "no username"}
        </Text>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Subheading>Select accounts to post to</Subheading>
          <Text>Choose the platforms and accounts for your content.</Text>
        </div>
        <div className="flex items-center gap-2">
          <Button
            color="blue"
            disabled={selectedConnections.length === 0 || isLoading}
            onClick={onContinue}
          >
            Continue with {selectedConnections.length}{" "}
            {selectedConnections.length === 1 ? "account" : "accounts"}
            <ArrowTriangleLineRightIcon className="ml-1" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500 dark:border-zinc-600" />
          <p className="text-zinc-500 dark:text-zinc-400">
            Loading your connected accounts...
          </p>
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 inline-flex items-center justify-center rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
            <svg
              aria-hidden="true"
              className="h-6 w-6 text-zinc-500"
              fill="none"
              role="img"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Information</title>
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <p className="mb-1 font-medium text-zinc-600 dark:text-zinc-300">
            No connected accounts found
          </p>
          <p className="mx-auto mb-4 max-w-md text-zinc-500 dark:text-zinc-400">
            You need to connect at least one social media account before you can
            create posts.
          </p>
          <Button color="blue" href="/connections">
            Connect Accounts
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-4">
            {connections.map((connection) => renderConnectionCard(connection))}
          </div>

          {/* Selected count */}
          {selectedConnections.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-zinc-200 border-t pt-4 dark:border-zinc-800">
              <Text className="text-zinc-600 dark:text-zinc-400">
                {selectedConnections.length}{" "}
                {selectedConnections.length === 1 ? "account" : "accounts"}{" "}
                selected
              </Text>
              <Button color="blue" onClick={onContinue}>
                Continue
                <ArrowTriangleLineRightIcon className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
