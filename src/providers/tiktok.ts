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
import type { TikTokConfig } from "@/types/providers";
import type { RefreshAccessTokenProps } from "@/types/token";
import type { RefreshAccessTokenResponse } from "@/types/token";

// Security
import { timestamp } from "@/utils/timestamp";

export class TikTok extends Provider<TikTokConfig, Account> {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: TikTokConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"video.publish",
					"video.upload",
					"user.info.basic",
					"user.info.profile",
				],
			},
			accounts,
		});
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their TikTok account.
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
			base: "https://www.tiktok.com/v2/auth/authorize/",
			scopes,
			params: {
				// TikTok uses client_key instead of client_id
				client_key: this.config.clientId,
			},
		});
	}

	/**
	 * Validates a TikTok access token against the required scopes.
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
		// TODO: Implement this

		return super.validate({
			access_token,
			scopes,
		});
	}

	/**
	 * Exchanges a TikTok code for useful tokens.
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
		if (!csrf_token) {
			throw new Error("CSRF token is required for TikTok authorisation.");
		}

		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			const accessTokenResponse = await fetch(
				"https://open.tiktokapis.com/v2/oauth/token/",
				{
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						client_key: this.config.clientId,
						client_secret: this.config.clientSecret,
						grant_type: "authorization_code",
						redirect_uri: this.config.redirectUri,
						code,
						code_verifier: csrf_token,
					}),
				},
			);

			if (!accessTokenResponse.ok) {
				throw new Error("Failed to exchange TikTok code for access token");
			}

			const data = await accessTokenResponse.json();

			const {
				access_token,
				refresh_token,
				open_id,
				refresh_expires_in,
				scope,
			} = data;

			let profileData = undefined;

			if (scope.split(",").includes("user.info.profile")) {
				const response = await fetch(
					"https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,avatar_url,display_name",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${access_token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Failed to get TikTok user profile");
				}

				profileData = await response.json();
			}

			return {
				data: {
					access_token,
					refresh_token,
					account_id: open_id,
					expiry: timestamp(refresh_expires_in),
					details: {
						name: profileData?.data?.user?.display_name ?? null,
						username: profileData?.data?.user?.username ?? null,
						avatar_url: profileData?.data?.user?.avatar_url ?? null,
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
							: "Failed to exchange TikTok code",
				},
			};
		}
	}

	/**
	 * Refreshes a TikTok access token or refresh token.
	 *
	 * @param token - The token to refresh
	 * @param option - The token to refresh
	 *
	 * @returns The new access token, refresh token, and expiry date
	 */
	async refresh({
		token,
		option = "refresh_token",
	}: Omit<RefreshAccessTokenProps, "client_id" | "client_secret"> & {
		option?: "refresh_token";
	}): Promise<Response<RefreshAccessTokenResponse | null>> {
		const url = new URL("https://open.tiktokapis.com/v2/oauth/token/");
		url.searchParams.set("grant_type", "refresh_token");
		url.searchParams.set("refresh_token", token);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_key: this.config.clientId,
				client_secret: this.config.clientSecret,
				grant_type: option,
				refresh_token: token,
			}),
		});

		if (!response.ok) {
			return {
				data: null,
				error: {
					message: "Failed to refresh TikTok access token",
				},
			};
		}

		const data = await response.json();

		return {
			data: {
				token: data.access_token,
				expires_in: data.expires_in,
			},
			error: null,
		};
	}

	/**
	 * Publishes a post to TikTok.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"tiktok">, "account">): Promise<
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

		console.warn("Publishing to TikTok is not yet stable. Use at own risk.");

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

			// Validate media type consistency
			if (mediaCount > 0) {
				const mediaType = mediaArray[0].type;
				const hasMixedTypes = mediaArray.some(
					(media) => media.type !== mediaType,
				);
				if (hasMixedTypes) {
					return {
						data: null,
						error: {
							message:
								"TikTok posts must contain either all images or all videos, not a mix of both",
						},
					};
				}
			}

			for (const account of this.accounts) {
				// Step 1: Get creator info
				const creatorInfoResponse = await fetch(
					"https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${account.access_token}`,
							"Content-Type": "application/json; charset=UTF-8",
						},
					},
				);

				if (!creatorInfoResponse.ok) {
					errors.push({
						message: "Failed to get creator info",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				const creatorInfo = await creatorInfoResponse.json();

				// Check if creator can post more content
				if (creatorInfo.error?.code !== "ok") {
					errors.push({
						message: "Creator cannot post more content at this time",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Validate video duration if it's a video
				if (mediaCount > 0 && mediaArray[0].type === "video") {
					const maxDuration = creatorInfo.data.max_video_post_duration_sec;
					// TODO: Add video duration check once we have video metadata
				}

				// Validate media requirement
				if (mediaCount === 0) {
					errors.push({
						message: "TikTok requires at least one media item (photo or video)",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Get default privacy level from creator info
				const defaultPrivacyLevel =
					creatorInfo.data.privacy_level_options[0] ?? "PUBLIC_TO_EVERYONE";

				// Get privacy level from post options or use default
				const privacyLevel = post.privacy
					? {
							public: "PUBLIC_TO_EVERYONE",
							mutual: "MUTUAL_FOLLOW_FRIENDS",
							private: "SELF_ONLY",
						}[post.privacy]
					: defaultPrivacyLevel;

				// Check if privacy level is allowed
				if (!creatorInfo.data.privacy_level_options.includes(privacyLevel)) {
					errors.push({
						message: `Privacy level ${privacyLevel} is not allowed for this creator`,
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Handle commercial content settings
				const isCommercialContent =
					post.options?.promotion?.self_promotion ||
					post.options?.promotion?.is_branded_content;

				// Validate privacy level for commercial content
				if (isCommercialContent && privacyLevel === "SELF_ONLY") {
					errors.push({
						message: "Commercial content cannot be set to private visibility",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Get interaction settings from post options or creator info
				const disableComment =
					post.options?.safety?.allow_comments === false ||
					creatorInfo.data.comment_disabled;
				const disableDuet =
					post.options?.safety?.allow_duet === false ||
					creatorInfo.data.duet_disabled;
				const disableStitch =
					post.options?.safety?.allow_stitch === false ||
					creatorInfo.data.stitch_disabled;

				// Common post info for all types
				const postInfo = {
					title: post.text ?? "",
					privacy_level: privacyLevel,
					disable_comment: disableComment,
					disable_duet: disableDuet,
					disable_stitch: disableStitch,
				};

				let publishId: string | undefined;
				const mediaType = mediaArray[0]?.type;

				if (mediaType === "image") {
					// Photo post
					const response = await fetch(
						"https://open.tiktokapis.com/v2/post/publish/content/init/",
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${account.access_token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								post_info: postInfo,
								source_info: {
									source: "PULL_FROM_URL",
									photo_cover_index: 0,
									photo_images: mediaArray.map((media) => media.url),
								},
								post_mode: "DIRECT_POST",
								media_type: "PHOTO",
							}),
						},
					);

					if (!response.ok) {
						console.error(response.statusText);
						console.error(await response.json());
						errors.push({
							message: "Failed to create photo post",
							details: {
								account_id: account.id,
							},
						});
						continue;
					}

					const result = await response.json();
					publishId = result.data.publish_id;
				} else if (mediaType === "video") {
					// Video post
					const response = await fetch(
						"https://open.tiktokapis.com/v2/post/publish/video/init/",
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${account.access_token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								post_info: postInfo,
								source_info: {
									source: "PULL_FROM_URL",
									video_url: mediaArray[0].url,
								},
							}),
						},
					);

					if (!response.ok) {
						errors.push({
							message: "Failed to create video post",
							details: {
								account_id: account.id,
							},
						});
						continue;
					}

					const result = await response.json();
					publishId = result.data.publish_id;
				}

				if (!publishId) {
					errors.push({
						message: "Failed to get publish ID",
						details: {
							account_id: account.id,
						},
					});
					continue;
				}

				// Poll for status until complete
				let status = "PROCESSING";
				let attempts = 0;
				const maxAttempts = 30; // 5 minutes with 10-second intervals

				while (status === "PROCESSING" && attempts < maxAttempts) {
					await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
					attempts++;

					const statusResponse = await fetch(
						"https://open.tiktokapis.com/v2/post/publish/status/fetch/",
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${account.access_token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								publish_id: publishId,
							}),
						},
					);

					if (!statusResponse.ok) {
						continue;
					}

					const statusResult = await statusResponse.json();
					status = statusResult.data.status;
				}

				if (status !== "SUCCESS") {
					errors.push({
						message: "Failed to publish post",
						details: {
							account_id: account.id,
							status,
						},
					});
					continue;
				}

				data.push({
					success: true,
					post_id: publishId,
					account_id: account.id,
				});
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
}

export default TikTok;
