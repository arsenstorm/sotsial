import {
	createCipheriv,
	createDecipheriv,
	randomBytes,
	scryptSync,
} from "node:crypto";

/**
 * Encrypt a string
 *
 * @param text - The text to encrypt
 * @param secret - The secret key to use for encryption
 *
 * @returns The encrypted text
 */
export async function encrypt(
	text?: string | null,
	{ secret = process.env.ENCRYPTION_KEY }: { secret?: string } = {},
): Promise<string | null> {
	if (!text) return null;
	if (!secret) throw new Error("Encryption key is required");

	const iv = randomBytes(16);
	const cipher = createCipheriv(
		"aes-256-cbc",
		scryptSync(secret, "salt", 32),
		iv,
	);

	const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
	return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt a string
 *
 * @param text - The text to decrypt
 * @param secret - The secret key to use for decryption
 *
 * @returns The decrypted text
 */
export async function decrypt(
	text: string,
	{ secret = process.env.ENCRYPTION_KEY }: { secret?: string } = {},
): Promise<string | null> {
	if (!text || !secret) return null;

	const [ivHex, encryptedText] = text.split(":");
	if (!ivHex || !encryptedText) return null;

	const decipher = createDecipheriv(
		"aes-256-cbc",
		scryptSync(secret, "salt", 32),
		Buffer.from(ivHex, "hex"),
	);

	return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
}
