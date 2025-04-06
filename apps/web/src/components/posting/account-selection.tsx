import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Subheading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ArrowTriangleLineRightIcon } from "@/icons/ui";
import { platformDetails } from "@/config/platform-details";
import type { Connection } from "@/app/(app)/posting/page.client";
import clsx from "clsx";

interface AccountSelectionProps {
	connections: Connection[];
	selectedConnections: Connection[];
	isLoading: boolean;
	error: string | null;
	onToggleConnection: (connection: Connection) => void;
	onContinue: () => void;
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
				key={connection.id}
				className={clsx(
					"flex items-center gap-2 px-3 py-1.5 rounded-full border",
					isSelected
						? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
						: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700",
				)}
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
					src={connection.account?.avatar}
					className="size-6"
					initials={
						connection.account?.avatar
							? undefined
							: (connection.account?.username ?? "?").slice(0, 1)
					}
					square
				/>
				<Text className="text-sm" title={connection.account?.username ?? "no username"}>
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
						disabled={selectedConnections.length === 0 || isLoading}
						onClick={onContinue}
						color="blue"
					>
						Continue with {selectedConnections.length}{" "}
						{selectedConnections.length === 1 ? "account" : "accounts"}
						<ArrowTriangleLineRightIcon className="ml-1" />
					</Button>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
					<p className="text-red-700 dark:text-red-400">{error}</p>
				</div>
			)}

			{isLoading ? (
				<div className="py-12 text-center bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-300 dark:border-zinc-600 border-t-blue-500 mb-2" />
					<p className="text-zinc-500 dark:text-zinc-400">
						Loading your connected accounts...
					</p>
				</div>
			) : connections.length === 0 ? (
				<div className="py-12 text-center bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
					<div className="inline-flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-3 mb-3">
						<svg
							className="w-6 h-6 text-zinc-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							role="img"
						>
							<title>Information</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p className="text-zinc-600 dark:text-zinc-300 font-medium mb-1">
						No connected accounts found
					</p>
					<p className="text-zinc-500 dark:text-zinc-400 mb-4 max-w-md mx-auto">
						You need to connect at least one social media account before you can
						create posts.
					</p>
					<Button href="/connections" color="blue">
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
						<div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
							<Text className="text-zinc-600 dark:text-zinc-400">
								{selectedConnections.length}{" "}
								{selectedConnections.length === 1 ? "account" : "accounts"}{" "}
								selected
							</Text>
							<Button onClick={onContinue} color="blue">
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
