import { describe, test, expect } from "bun:test";
import { encrypt, decrypt } from "../encryption";

describe("Encryption Utils", () => {
	const testSecret = "test-secret-key";
	const testText = "Hello, this is a test message!";

	test("encrypt returns null for null or undefined input", async () => {
		expect(await encrypt(null, { secret: testSecret })).toBeNull();
		expect(await encrypt(undefined, { secret: testSecret })).toBeNull();
	});

	test("encrypt throws error when secret is not provided", async () => {
		try {
			await encrypt(testText, { secret: undefined });
			// Should not reach here
			expect(true).toBe(false);
		} catch (error: any) {
			expect(error.message).toBe("Encryption key is required");
		}
	});

	test("decrypt returns null for invalid input", async () => {
		expect(await decrypt("", { secret: testSecret })).toBeNull();
		expect(await decrypt("invalid-format", { secret: testSecret })).toBeNull();
	});

	test("decrypt returns null when secret is not provided", async () => {
		const encrypted = await encrypt(testText, { secret: testSecret });
		expect(await decrypt(encrypted!, { secret: undefined })).toBeNull();
	});

	test("can encrypt and decrypt a string", async () => {
		const encrypted = await encrypt(testText, { secret: testSecret });
		expect(encrypted).not.toBeNull();
		expect(typeof encrypted).toBe("string");
		expect(encrypted).toContain(":");

		const decrypted = await decrypt(encrypted!, { secret: testSecret });
		expect(decrypted).toBe(testText);
	});

	test("different secrets produce different encryptions", async () => {
		const encrypted1 = await encrypt(testText, { secret: testSecret });
		const encrypted2 = await encrypt(testText, { secret: "different-secret" });

		expect(encrypted1).not.toBe(encrypted2);
	});

	test("cannot decrypt with wrong secret", async () => {
		const encrypted = await encrypt(testText, { secret: testSecret });

		try {
			const decrypted = await decrypt(encrypted!, { secret: "wrong-secret" });
			// If it doesn't throw but returns something different, that's also acceptable
			if (decrypted !== null) {
				expect(decrypted).not.toBe(testText);
			}
		} catch (error: any) {
			// It's acceptable if decryption with wrong key throws an error
			expect(error).toBeDefined();
		}
	});
});
