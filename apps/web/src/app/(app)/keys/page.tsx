// Components
import { KeyCreateDialog } from "./page.client";
import { KeyStatusToggle } from "@/components/key-status-toggle";

// UI
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Code } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Better Auth
import { auth } from "@/auth";

// Utils
import { format } from "date-fns";

// React
import { Suspense } from "react";
import { headers } from "next/headers";

export default async function KeysPage() {
	return (
		<div>
			<KeyCreateDialog />
			<Card
				title="Need help with your API keys?"
				description="Check out our documentation or contact support."
				className="my-4"
			/>
			<Divider className="my-6" soft />
			<Suspense fallback={<Skeleton />}>
				<KeysTable />
			</Suspense>
		</div>
	);
}

async function KeysTable() {
	const headersList = await headers();

	const keys = await auth.api.listApiKeys({
		headers: headersList,
	});

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader>Key ID</TableHeader>
					<TableHeader>Name</TableHeader>
					<TableHeader>Created At</TableHeader>
					<TableHeader>Key Hint</TableHeader>
					<TableHeader>Status</TableHeader>
					<TableHeader>
						<span className="sr-only">Actions</span>
					</TableHeader>
				</TableRow>
			</TableHead>
			<TableBody>
				{keys?.map((key) => (
					<TableRow key={key.id}>
						<TableCell>{key.id}</TableCell>
						<TableCell>{(key.name as string) ?? "Unnamed Key"}</TableCell>
						<TableCell>
							<time dateTime={key.createdAt.toString()}>
								{format(key.createdAt, "MMM, d, yyyy h:mm a")}
							</time>
						</TableCell>
						<TableCell>
							<Code>{key.start}</Code>
						</TableCell>
						<TableCell>
							<KeyStatusToggle id={key.id} enabled={key.enabled} />
						</TableCell>
						<TableCell className="text-right">
							<Button href={`/keys/${key.id}`}>Manage Key</Button>
						</TableCell>
					</TableRow>
				))}
				{keys.length === 0 && (
					<TableRow>
						<TableCell colSpan={6} className="text-center">
							No keys found
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
