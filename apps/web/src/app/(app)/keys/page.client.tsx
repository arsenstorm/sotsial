"use client";

// UI
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import {
	Dialog,
	DialogActions,
	DialogBody,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, Label } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// React
import { useCallback, useState } from "react";

// Next
import { useTransitionRouter } from "next-view-transitions";

export function KeyCreateDialog() {
	const router = useTransitionRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const [key, setKey] = useState<string | null>(null);

	const openCreateKeyDialog = useCallback(() => setIsOpen(true), []);

	const closeCreateKeyDialog = useCallback(() => {
		setIsOpen(false);
		setName("");
		setKey(null);
		router.refresh();
	}, [router]);

	const setKeyName = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
		[],
	);

	const createKey = useCallback(async () => {
		setIsLoading(true);
		const response = await fetch("/v1/keys", {
			method: "POST",
			body: JSON.stringify({ name }),
		});

		if (!response.ok) {
			toast.error("Failed to create key.");
			setIsLoading(false);
			closeCreateKeyDialog();
			return;
		}

		const data = await response.json();

		if (!data?.key) {
			toast.error("Failed to create key.");
			setIsLoading(false);
			closeCreateKeyDialog();
			return;
		}

		setKey(data?.key);
		setIsLoading(false);

		toast.success("Key created successfully!");
	}, [name, closeCreateKeyDialog]);

	return (
		<div>
			<PageHeading title="API Keys" description="Manage your API keys.">
				<Button color="dark/white" onClick={openCreateKeyDialog}>
					Create Key
				</Button>
			</PageHeading>
			<Dialog open={isOpen} onClose={setIsOpen}>
				{!key ? (
					<>
						<DialogTitle>Create Key</DialogTitle>
						<DialogDescription>Create a new API key.</DialogDescription>
						<DialogBody>
							<Field>
								<Label>Name</Label>
								<Input
									name="name"
									placeholder="My Key"
									value={name}
									onChange={setKeyName}
								/>
							</Field>
						</DialogBody>
						<DialogActions>
							<Button plain onClick={closeCreateKeyDialog}>
								Cancel
							</Button>
							<Button
								onClick={createKey}
								color="dark/white"
								disabled={!name.length || isLoading}
							>
								{isLoading ? "Creating..." : "Create Key"}
							</Button>
						</DialogActions>
					</>
				) : (
					<>
						<DialogTitle>Your API Key</DialogTitle>
						<DialogDescription>
							Below is your new API Key. Keep it safe as you can only view it
							once.
						</DialogDescription>
						<DialogBody>
							<Field>
								<Label>Key</Label>
								<Input name="key" value={key} readOnly disabled />
							</Field>
						</DialogBody>
						<DialogActions>
							<Button onClick={closeCreateKeyDialog} color="dark/white">
								I‘ve saved my key and I want to close this dialog.
							</Button>
						</DialogActions>
					</>
				)}
			</Dialog>
		</div>
	);
}
