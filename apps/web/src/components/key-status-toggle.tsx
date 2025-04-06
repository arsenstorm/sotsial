"use client";

// Better Auth
import { auth } from "@/utils/auth/client";

// Next View Transitions
import { useTransitionRouter } from "next-view-transitions";

// UI
import { Switch } from "./ui/switch";
import { toast } from "sonner";

// React
import { useState } from "react";

export function KeyStatusToggle({
	id,
	enabled,
}: { id: string; enabled: boolean; refreshOnToggle?: boolean }) {
	const [disabled, setDisabled] = useState(false);
	const [status, setStatus] = useState(enabled ? "enabled" : "disabled");
	const router = useTransitionRouter();

	return (
		<Switch
			color="lime"
			disabled={disabled}
			checked={status === "enabled"}
			onChange={async (status) => {
				async function updateKeyStatus() {
					setDisabled(true);

					await auth.apiKey.update({
						keyId: id,
						enabled: status,
					});

					setDisabled(false);
					setStatus(status ? "enabled" : "disabled");

					router.refresh();
				}
				toast.promise(updateKeyStatus, {
					loading: `${enabled ? "Disabling" : "Enabling"} key...`,
					success: `${enabled ? "Disabled" : "Enabled"} key successfully!`,
					error: `Failed to ${enabled ? "disable" : "enable"} key.`,
				});
			}}
		/>
	);
}
