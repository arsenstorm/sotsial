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
export function encrypt(
  text?: string | null,
  { secret = process.env.ENCRYPTION_KEY }: { secret?: string } = {}
): Promise<string | null> {
  if (!text) {
    return Promise.resolve(null);
  }
  if (!secret) {
    return Promise.reject(new Error("Encryption key is required"));
  }

  const iv = randomBytes(16);
  const cipher = createCipheriv(
    "aes-256-cbc",
    scryptSync(secret, "salt", 32),
    iv
  );

  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return Promise.resolve(`${iv.toString("hex")}:${encrypted}`);
}

/**
 * Decrypt a string
 *
 * @param text - The text to decrypt
 * @param secret - The secret key to use for decryption
 *
 * @returns The decrypted text
 */
export function decrypt(
  text: string,
  { secret = process.env.ENCRYPTION_KEY }: { secret?: string } = {}
): Promise<string | null> {
  if (!(text && secret)) {
    return Promise.resolve(null);
  }

  const [ivHex, encryptedText] = text.split(":");
  if (!(ivHex && encryptedText)) {
    return Promise.resolve(null);
  }

  const decipher = createDecipheriv(
    "aes-256-cbc",
    scryptSync(secret, "salt", 32),
    Buffer.from(ivHex, "hex")
  );

  return Promise.resolve(
    decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8")
  );
}
