/**
 * Get an environment variable
 *
 * @param variable - The environment variable to get
 *
 * @returns The environment variable
 */
export function env(
	variable: string,
	options?: {
		throw?: boolean;
	},
) {
	const value = process.env[variable];

	if (!value && options?.throw) {
		throw new Error(`Environment variable ${variable} is not set.`);
	}

	if (!value) {
		return null;
	}

	return value;
}
