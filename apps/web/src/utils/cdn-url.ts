import "server-only";

export async function createCdnUrl(url: string): Promise<string> {
	const SOTSIAL_PROXY_KEY = process.env.SOTSIAL_PROXY_KEY;

	if (!SOTSIAL_PROXY_KEY) {
		console.warn("Not proxying the url because SOTSIAL_PROXY_KEY is not set.");
		return url;
	}

	const validToken = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(`${SOTSIAL_PROXY_KEY}:${url}`),
	);

	const tokenHex = Array.from(new Uint8Array(validToken))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `https://cdn.sotsial.com/?url=${encodeURIComponent(url)}&token=${tokenHex}`;
}
