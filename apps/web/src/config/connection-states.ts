// Nuqs
import {
	parseAsString,
	parseAsStringEnum,
	parseAsBoolean,
	useQueryStates,
} from "nuqs";

export function useConnectionStates() {
	return useQueryStates({
		connection: parseAsStringEnum([
			"",
			"selecting", // user needs to select a platform
			"creating", // user needs to click connect
			"waiting", // we are waiting for the user to approve the connection
			"connected", // user is connected to the platform
		]).withDefault(""),
		platform: parseAsString.withDefault(""),
		tags: parseAsString.withDefault(""),
		open: parseAsBoolean.withDefault(false),
	});
}
