// Components
import { KeyStatusToggle } from "@/components/key-status-toggle";

// UI
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { PageHeading } from "@/components/ui/page-heading";
import { Button } from "@/components/ui/button";

// Utils
import { format } from "date-fns";

// Better Auth
import { auth } from "@/auth";

// React
import { Suspense } from "react";

// Next
import { headers } from "next/headers";

export default async function KeysPage({
	params,
}: Readonly<{
	params: Promise<{ id: string }>;
}>) {
	const { id } = await params;

	return (
		<div className="space-y-6">
			<PageHeading title="Manage API Key" description="Manage your API key.">
				<Button color="dark/white" href="/keys">
					See all API keys
				</Button>
			</PageHeading>
			<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
				<KeyDetails id={id} />
			</Suspense>
		</div>
	);
}

async function KeyDetails({ id }: Readonly<{ id: string }>) {
	const headersList = await headers();

	const key = await auth.api.getApiKey({
		headers: headersList,
		query: {
			id,
		},
	});

	if (!key) {
		throw new Error("Key not found");
	}

	return (
		<div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-6 border border-zinc-200 dark:border-zinc-700 rounded-lg">
			<div className="flex flex-col">
				<h2 className="text-xl font-semibold">{key.name ?? "Unnamed Key"}</h2>
				<p className="text-sm text-muted-foreground">API Key Details</p>
			</div>

			<div className="mt-6 space-y-6">
				<div className="flex justify-between items-center">
					<div className="flex flex-col gap-2">
						<div className="flex flex-row items-center gap-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Status
							</h3>
							<Badge color={key.enabled ? "green" : "red"}>
								{key.enabled ? "Enabled" : "Disabled"}
							</Badge>
						</div>
						<div className="flex flex-row items-center gap-2">
							<Text>Toggle:</Text>
							<KeyStatusToggle
								id={key.id}
								enabled={key.enabled}
								refreshOnToggle
							/>
						</div>
					</div>
					<div>
						<h3 className="text-sm font-medium text-muted-foreground">
							Key Hint
						</h3>
						<p className="text-sm mt-1">{key.start}...</p>
					</div>
				</div>

				<Divider />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Key ID
							</h3>
							<p className="text-sm mt-1">{key.id}</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Created
							</h3>
							<p className="text-sm mt-1">
								{format(key.createdAt, "MMM d, yyyy h:mm a")}
							</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Last Updated
							</h3>
							<p className="text-sm mt-1">
								{format(key.updatedAt, "MMM d, yyyy h:mm a")}
							</p>
						</div>
						{key.expiresAt && (
							<div>
								<h3 className="text-sm font-medium text-muted-foreground">
									Expires
								</h3>
								<p className="text-sm mt-1">
									{format(key.expiresAt, "MMM d, yyyy h:mm a")}
								</p>
							</div>
						)}
					</div>

					<div className="space-y-4">
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Rate Limiting
							</h3>
							{key.rateLimitEnabled ? (
								<div className="mt-1">
									<p className="text-sm">
										<Badge color="blue">{key.rateLimitMax ?? 0}</Badge> requests
										per{" "}
										<Badge color="blue">
											{key.rateLimitTimeWindow
												? `${key.rateLimitTimeWindow / 60000} minutes`
												: "N/A"}
										</Badge>
									</p>
								</div>
							) : (
								<p className="text-sm mt-1">Disabled</p>
							)}
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground">
								Usage
							</h3>
							<div className="mt-1">
								<p className="text-sm">
									<Badge color="blue">
										<span className="font-medium">{key.requestCount ?? 0}</span>
									</Badge>{" "}
									total requests
								</p>
								<p className="text-sm">
									Last request:{" "}
									{key.lastRequest
										? format(key.lastRequest, "MMM d, yyyy h:mm a")
										: "Never"}
								</p>
							</div>
						</div>
						{key.refillInterval && (
							<div>
								<h3 className="text-sm font-medium text-muted-foreground">
									Quota Refill
								</h3>
								<p className="text-sm mt-1">
									{key.refillAmount ?? 0} requests every{" "}
									{key.refillInterval
										? `${key.refillInterval / 60000} minutes`
										: "N/A"}
								</p>
								<p className="text-sm">
									Last refill:{" "}
									{key.lastRefillAt
										? format(key.lastRefillAt, "MMM d, yyyy h:mm a")
										: "Never"}
								</p>
							</div>
						)}
					</div>
				</div>

				{(key.permissions ?? key.metadata) && (
					<>
						<Divider />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{key.permissions && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Permissions
									</h3>
									<pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
										{JSON.stringify(key.permissions, null, 2)}
									</pre>
								</div>
							)}
							{key.metadata && (
								<div>
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Metadata
									</h3>
									<pre className="bg-muted p-2 rounded-md text-xs overflow-auto">
										{JSON.stringify(key.metadata, null, 2)}
									</pre>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
