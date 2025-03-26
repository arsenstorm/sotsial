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
import type { ErrorResponse } from "@/types/error";
import type { PublishProps } from "@/types/publish";
import type { InstagramConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class Instagram extends Provider<InstagramConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: InstagramConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"instagram_business_basic",
					"instagram_business_content_publish",
				],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Instagram account.
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
			base: "https://www.instagram.com/oauth/authorize",
			scopes,
			params: {
				enable_fb_login: "0",
				force_authentication: "1",
			},
		});
	}

	/**
	 * Validates a Instagram access token against the required scopes.
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
		const url = new URL("https://graph.facebook.com/debug_token");
		url.searchParams.set("input_token", access_token);
		url.searchParams.set(
			"access_token",
			`${this.config.clientId}|${this.config.clientSecret}`,
		);

		const response = await fetch(url);
		const body = await response.json();

		const granted_scopes = body?.data?.scopes;

		if (
			granted_scopes &&
			!scopes.every((required) => granted_scopes?.includes(required))
		) {
			return {
				data: null,
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
		};
	}

	/**
	 * Exchanges a Instagram code for useful tokens.
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
			console.warn("CSRF token may be required for Instagram authorisation.");

		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			// Step 1: Exchange code for access token
			const accessTokenResponse = await fetch(
				"https://api.instagram.com/oauth/access_token",
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
				throw new Error("Failed to exchange Instagram code for access token");
			}

			const { access_token } = await accessTokenResponse.json();

			// Step 2: Exchange access token for refresh token
			const refreshTokenResponse = await fetch(
				`https://graph.instagram.com/access_token?access_token=${access_token}&client_secret=${this.config.clientSecret}&grant_type=ig_exchange_token`,
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
				`https://graph.instagram.com/v22.0/me?fields=id,name,username,profile_picture_url&access_token=${access_token}`,
			);

			if (!userResponse.ok) {
				console.error(await userResponse.text());
				throw new Error("Failed to get Instagram user.");
			}

			const data = await userResponse.json();

			return {
				data: {
					// In the case of Instagram, the refresh token is actually a long-lived access token
					// so we're going to use that instead.
					access_token: refresh_token,
					// we also won't provide a refresh token in the response
					refresh_token: undefined,
					account_id: data.id,
					expiry: timestamp(expires_in),
					details: {
						name: data.name ?? null,
						username: data.username ?? null,
						avatar_url: data.profile_picture_url ?? null,
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
							: "Failed to exchange Instagram code",
				},
			};
		}
	}

	/**
	 * Refreshes a Instagram access token or refresh token.
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
		const url = new URL("https://api.instagram.com/refresh_access_token");
		url.searchParams.set("grant_type", "ig_refresh_token");
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
	 * Publishes a post to Instagram.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"instagram">, "account">): Promise<
		Response<
			| {
					success: boolean;
					post_id: string;
					account_id: string;
			  }[]
			| null
		>
	> {
		if (!this.accounts) {
			throw new Error("No account connected");
		}

		try {
			const mediaArray = Array.isArray(post?.media)
				? post.media
				: post?.media
					? [post.media]
					: [];
			const mediaCount = mediaArray.length;
			const data: {
				success: boolean;
				post_id: string;
				account_id: string;
			}[] = [];
			const errors: ErrorResponse[] = [];

			for (const account of this.accounts) {
				let containerId: string | undefined;
				let media_type: "REELS" | "STORIES" | undefined;

				if (post.type === "reel") {
					if (!mediaArray.length || mediaArray[0]?.type !== "video") {
						errors.push({
							message: "Instagram only allows videos for reels.",
						});
						continue;
					}
					const result = await this.createSingleContainer(account, post);
					if (result.error) {
						errors.push(result.error);
						continue;
					}
					containerId = result.data?.container_id;
					media_type = "REELS";
				} else if (post.type === "story") {
					const result = await this.createSingleContainer(account, post);
					if (result.error) {
						errors.push(result.error);
						continue;
					}
					containerId = result.data?.container_id;
					media_type = "STORIES";
				} else {
					// Default feed post
					if (mediaCount === 0) {
						errors.push({
							message:
								"You must provide at least one media item for a post on Instagram.",
						});
						continue;
					}

					if (mediaCount === 1) {
						const result = await this.createSingleContainer(account, post);
						if (result.error) {
							errors.push(result.error);
							continue;
						}
						containerId = result.data?.container_id;
					} else {
						const result = await this.createCarouselContainer(account, post);
						if (result.error) {
							errors.push(result.error);
							continue;
						}
						containerId = result.data?.container_id;
					}
				}

				if (!containerId) {
					errors.push({
						message: "Failed to create container",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Publish the container
				const result = await this.publishContainer(
					account,
					containerId,
					media_type,
				);

				if (result.error) {
					errors.push(result.error);
					continue;
				}

				data.push(result.data);
			}

			return {
				data,
				error:
					errors.length > 0
						? {
								message: "Failed to publish post",
								details: errors,
							}
						: null,
			};
		} catch (error) {
			console.error(error);
			return {
				data: null,
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
		account: Account,
		post: PublishProps<"instagram">["post"],
	): Promise<
		Response<{
			success: boolean;
			container_id: string;
		} | null>
	> {
		if (!account?.access_token) {
			return {
				data: null,
				error: {
					message: "No access token found",
				},
			};
		}

		const url = new URL(`https://graph.instagram.com/${account?.id}/media`);
		url.searchParams.set("access_token", account?.access_token);

		const mediaArray = Array.isArray(post?.media)
			? post.media
			: post?.media
				? [post.media]
				: [];
		const media = mediaArray[0];

		if (media) {
			if (media.type === "image") {
				url.searchParams.set("image_url", media.url);
			} else if (media.type === "video") {
				url.searchParams.set("media_type", "VIDEO");
				url.searchParams.set("video_url", media.url);
			}
		}

		if (post.type !== "story") {
			url.searchParams.set("caption", post?.text ?? "");
		}

		if (post.type === "reel") {
			url.searchParams.set("media_type", "REELS");
		}

		if (post.type === "story") {
			url.searchParams.set("media_type", "STORIES");
		}

		const response = await fetch(url.toString(), { method: "POST" });
		const data = await response.json();

		if (!response.ok) {
			console.error(data);
			return {
				data: null,
				error: {
					message: "Failed to create single container",
				},
			};
		}

		return {
			data: {
				success: true,
				container_id: data.id,
			},
			error: null,
		};
	}

	/**
	 * Creates a carousel container with multiple media items
	 */
	private async createCarouselContainer(
		account: Account,
		post: PublishProps<"instagram">["post"],
	): Promise<
		Response<{
			success: boolean;
			container_id: string;
		} | null>
	> {
		if (!account?.access_token) {
			return {
				data: null,
				error: {
					message: "No account connected",
				},
			};
		}

		if (!post?.media) {
			return {
				data: null,
				error: {
					message:
						"You must provide at least one media item for a carousel post",
				},
			};
		}

		const mediaArray = Array.isArray(post.media) ? post.media : [post.media];

		if (mediaArray.length > 10) {
			return {
				data: null,
				error: {
					message: "Instagram only allows up to 10 media items per carousel",
				},
			};
		}

		// Upload each media item
		const base = new URL(`https://graph.instagram.com/${account?.id}/media`);
		base.searchParams.set("access_token", account?.access_token);

		let children: string[] = [];

		try {
			children = await Promise.all(
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
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error ? error.message : "Failed to upload media",
				},
			};
		}

		// Create carousel with all media items
		const url = new URL(`https://graph.instagram.com/${account?.id}/media`);
		url.searchParams.set("access_token", account?.access_token);
		url.searchParams.set("media_type", "CAROUSEL");
		url.searchParams.set("children", children.join(","));
		url.searchParams.set("caption", post?.text ?? "");

		const response = await fetch(url.toString(), {
			method: "POST",
		});
		const data = await response.json();

		if (!response.ok) {
			console.error(data);
			return {
				data: null,
				error: {
					message: "Failed to create carousel",
				},
			};
		}

		return {
			data: {
				success: true,
				container_id: data.id,
			},
			error: null,
		};
	}

	/**
	 * Publishes a container that has been created
	 */
	private async publishContainer(
		account: Account,
		containerId: string,
		media_type?: "REELS" | "STORIES",
	): Promise<Response<any | null>> {
		if (!account?.access_token) {
			throw new Error("No access token found");
		}

		const url = new URL(
			`https://graph.instagram.com/${account?.id}/media_publish`,
		);
		url.searchParams.set("access_token", account?.access_token);
		url.searchParams.set("creation_id", containerId);

		if (media_type) {
			url.searchParams.set("media_type", media_type);
		}

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
				post_id: data.id,
				account_id: account.id,
			},
			error: null,
		};
	}
}

export default Instagram;
