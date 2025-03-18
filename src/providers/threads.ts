// Base
import Provider from "@/base/provider";

// Types
import type { Account } from "@/types/auth";
import type {
	ExchangeProps,
	ExchangeResponse,
	GrantProps,
	GrantResponse,
	ValidateProps,
	ValidateResponse,
} from "@/types/connect";
import type { Response } from "@/types/response";
import type { PublishProps } from "@/types/publish";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

// Types
import type { ThreadsConfig } from "@/types/providers";

export class Threads extends Provider<ThreadsConfig, Account> {
	constructor({
		config,
		account,
	}: Readonly<{
		config: ThreadsConfig;
		account?: Account;
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? ["threads_basic", "threads_content_publish"],
			},
			account,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Threads account.
	 *
	 * @param client_id - The client ID
	 * @param redirect_uri - The redirect URI
	 * @param scopes - The scopes
	 *
	 * @returns The URL to redirect to
	 */
	async grant(
		{ scopes }: Omit<GrantProps, "client_id" | "redirect_uri"> = {
			scopes: this.config.scopes ?? [],
		},
	): Promise<Response<GrantResponse | null>> {
		return super.grant({
			base: "https://threads.net/oauth/authorize",
			scopes,
		});
	}

	/**
	 * Validates a Threads access token against the required scopes.
	 *
	 * @param access_token - The access token to validate
	 * @param scopes - The required scopes
	 *
	 * @returns The granted scopes and the expiry date of the access token.
	 */
	async validate({
		access_token,
		scopes,
	}: Omit<ValidateProps, "client_id" | "client_secret">): Promise<
		Response<ValidateResponse | null>
	> {
		// NOTE: Due to issues with the /debug_token endpoint, we're unable to use this function
		// with Threads for the time being.

		return super.validate({
			access_token,
			scopes,
		});

		/**const url = new URL("https://graph.facebook.com/debug_token");
		url.searchParams.set("input_token", access_token);
		url.searchParams.set("access_token", `${app_id}|${app_secret}`);

		const response = await fetch(url);
		const body = await response.json();

		const granted_scopes = body?.data?.scopes;

		if (
			granted_scopes &&
			!scopes.every((required) => granted_scopes?.includes(required))
		) {
			return {
				data: {
					scopes: granted_scopes,
				},
				error: {
					message: `Invalid scope(s). Missing: ${scopes
						.filter((required) => !granted_scopes?.includes(required))
						.join(", ")}`,
					hint: "The necessary permissions are not set for this connection.",
				},
			};
		}

		return {
			data: {
				scopes: granted_scopes,
			},
			error: null,
		};*/
	}

	/**
	 * Exchanges a Threads code for useful tokens.
	 *
	 * @param code - The code to exchange
	 * @param csrf_token - The CSRF token
	 *
	 * @returns The refresh token, long-lived access token, account ID, and expiry date
	 */
	async exchange({
		code,
		csrf_token,
	}: Omit<
		ExchangeProps,
		"client_id" | "client_secret" | "redirect_uri"
	>): Promise<Response<ExchangeResponse | null>> {
		// Log warning if CSRF token is missing
		csrf_token ??
			console.warn("CSRF token may be required for Threads authorization.");

		try {
			// Step 1: Exchange code for access token
			const accessTokenResponse = await fetch(
				"https://graph.threads.net/oauth/access_token",
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						client_id: this.config.clientId,
						client_secret: this.config.clientSecret,
						grant_type: "authorization_code",
						redirect_uri: this.config.redirectUri,
						code,
					}),
				},
			);

			if (!accessTokenResponse.ok) {
				throw new Error("Failed to exchange Threads code for access token");
			}

			const { access_token } = await accessTokenResponse.json();

			// Step 2: Exchange access token for refresh token
			const refreshTokenResponse = await fetch(
				`https://graph.threads.net/access_token?access_token=${access_token}&client_secret=${this.config.clientSecret}&grant_type=th_exchange_token`,
			);

			if (!refreshTokenResponse.ok) {
				throw new Error("Failed to exchange access token for refresh token");
			}

			const { access_token: refresh_token, expires_in } =
				await refreshTokenResponse.json();

			// Step 3: Validate the refresh token
			const validation = await this.validate({
				access_token: refresh_token,
				scopes: this.config.scopes ?? [],
			});

			if (validation.error) {
				return { data: null, error: validation.error };
			}

			// Step 4: Get user ID - This is required due to an issue with the access token endpoint
			const userResponse = await fetch(
				`https://graph.threads.net/me?fields=id,name,username,threads_profile_picture_url&access_token=${access_token}`,
			);

			if (!userResponse.ok) {
				console.error(await userResponse.text());
				throw new Error("Failed to get Threads user id");
			}

			const data = await userResponse.json();

			return {
				data: {
					refresh_token,
					access_token,
					account_id: data.id,
					expiry: timestamp(expires_in),
					details: {
						name: data.name ?? null,
						username: data.username ?? null,
						avatar_url: data.threads_profile_picture_url ?? null,
					},
				},
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Failed to exchange Threads code",
				},
			};
		}
	}

	/**
	 * Refreshes a Threads access token or refresh token.
	 *
	 * @param token - The token to refresh
	 * @param option - The token to refresh
	 *
	 * @returns The new access token, refresh token, and expiry date
	 */
	async refresh({
		token,
	}: Omit<RefreshAccessTokenProps, "client_id" | "client_secret">): Promise<
		Response<RefreshAccessTokenResponse | null>
	> {
		const url = new URL("https://graph.threads.net/refresh_access_token");
		url.searchParams.set("grant_type", "th_refresh_token");
		url.searchParams.set("access_token", token);

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		// TODO: Implement this

		return {
			data: {
				token: "",
				expires_in: 0,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to Threads.
	 *
	 * @param account - The account to publish the post to
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({
		post,
	}: Omit<PublishProps<"threads">, "account">): Promise<Response<any | null>> {
		if (!this.account) {
			throw new Error("No account connected");
		}

		try {
			const mediaArray = Array.isArray(post?.media)
				? post.media
				: post?.media
					? [post.media]
					: [];
			const mediaCount = mediaArray.length;
			let containerId: string | undefined;

			if (mediaCount <= 1) {
				containerId = await this.createSingleContainer(post);
			} else {
				containerId = await this.createCarouselContainer(post);
			}

			if (!containerId) {
				throw new Error("Failed to create container");
			}

			// Publish the container
			return await this.publishContainer(containerId);
		} catch (error) {
			console.error(error);
			return {
				data: {
					success: false,
					id: undefined,
				},
				error: {
					message:
						error instanceof Error ? error.message : "Failed to publish post",
					hint: "Please try again later",
				},
			};
		}
	}

	/**
	 * Creates a single container with 0 or 1 media items
	 */
	private async createSingleContainer(
		post: PublishProps<"threads">["post"],
	): Promise<string> {
		if (!this.account?.access_token) {
			throw new Error("No access token found");
		}

		const url = new URL(
			`https://graph.threads.net/v1.0/${this.account?.id}/threads`,
		);
		url.searchParams.set("access_token", this.account?.access_token);
		url.searchParams.set("media_type", "TEXT");
		url.searchParams.set("text", post?.text ?? "");

		const mediaArray = Array.isArray(post?.media)
			? post.media
			: post?.media
				? [post.media]
				: [];
		const media = mediaArray[0];

		if (media) {
			if (media.type === "image") {
				url.searchParams.set("media_type", "IMAGE");
				url.searchParams.set("image_url", media.url);
			} else if (media.type === "video") {
				url.searchParams.set("media_type", "VIDEO");
				url.searchParams.set("video_url", media.url);
			}
		}

		const response = await fetch(url.toString(), { method: "POST" });
		const data = await response.json();

		if (!response.ok) {
			console.error(data);
			throw new Error("Failed to create single container");
		}

		return data.id;
	}

	/**
	 * Creates a carousel container with multiple media items
	 */
	private async createCarouselContainer(
		post: PublishProps<"threads">["post"],
	): Promise<string> {
		if (!this.account?.access_token) {
			throw new Error("No access token found");
		}

		if (!post?.media) {
			throw new Error(
				"You must provide at least one media item for a carousel post",
			);
		}

		const mediaArray = Array.isArray(post.media) ? post.media : [post.media];

		if (mediaArray.length > 20) {
			throw new Error("Threads only allows up to 20 media items per carousel");
		}

		// Upload each media item
		const base = new URL(
			`https://graph.threads.net/v1.0/${this.account?.id}/threads`,
		);
		base.searchParams.set("access_token", this.account?.access_token);

		const children = await Promise.all(
			mediaArray.map(async (media) => {
				if (!["image", "video"].includes(media.type)) {
					throw new Error(`Invalid media type: ${media.type}`);
				}

				const url = new URL(base.toString());
				url.searchParams.set(
					"media_type",
					media.type === "image" ? "IMAGE" : "VIDEO",
				);
				url.searchParams.set(
					media.type === "image" ? "image_url" : "video_url",
					media.url,
				);

				const response = await fetch(url.toString(), { method: "POST" });
				const data = await response.json();

				if (!response.ok) {
					console.error(data);
					throw new Error("Failed to upload media");
				}

				return data.id;
			}),
		);

		// Create carousel with all media items
		const url = new URL(
			`https://graph.threads.net/v1.0/${this.account?.id}/threads`,
		);
		url.searchParams.set("access_token", this.account?.access_token);
		url.searchParams.set("media_type", "CAROUSEL");
		url.searchParams.set("children", children.join(","));
		url.searchParams.set("text", post?.text ?? "");

		const response = await fetch(url.toString(), {
			method: "POST",
		});
		const data = await response.json();

		if (!response.ok) {
			console.error(data);
			throw new Error("Failed to create carousel");
		}

		return data.id;
	}

	/**
	 * Publishes a container that has been created
	 */
	private async publishContainer(
		containerId: string,
	): Promise<Response<any | null>> {
		if (!this.account?.access_token) {
			throw new Error("No access token found");
		}

		const url = new URL(
			`https://graph.threads.net/v1.0/${this.account?.id}/threads_publish`,
		);
		url.searchParams.set("access_token", this.account?.access_token);
		url.searchParams.set("creation_id", containerId);

		const response = await fetch(url.toString(), {
			method: "POST",
		});
		const data = await response.json();

		if (!response.ok) {
			console.error(data);
			throw new Error("Failed to publish post");
		}

		return {
			data: {
				success: true,
				id: data.id,
			},
			error: null,
		};
	}
}

export default Threads;
