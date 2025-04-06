import { useOs } from "@mantine/hooks";

export function useCommandKey() {
	const os = useOs();

	if (os === "undetermined") {
		return { device: "desktop", key: "Ctrl" };
	}

	return {
		device: ["windows", "linux", "macos"].includes(os) ? "desktop" : "mobile",
		key: os === "macos" ? "⌘" : "Ctrl",
	};
}
