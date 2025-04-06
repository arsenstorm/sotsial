// Utils
import { encrypt } from "@/utils/encryption";

// Types
import type { Response } from "@/types/response";

/**
 * Generates a token and encrypts it
 *
 * @returns The token and encrypted token
 */
export async function generate(): Promise<
	Response<{
		plain: string;
		encrypted: string;
	} | null>
> {
	try {
		const token = Buffer.from(
			crypto.getRandomValues(new Uint8Array(32)),
		).toString("hex");

		const encryptedToken = await encrypt(token);

		if (!encryptedToken) {
			throw new Error("Failed to encrypt token");
		}

		return {
			data: {
				plain: token,
				encrypted: encryptedToken,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error as Error,
		};
	}
}
