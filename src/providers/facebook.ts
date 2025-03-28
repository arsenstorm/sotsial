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
import type { FacebookConfig, FacebookPage } from "@/types/providers";
import type { ErrorResponse } from "@/types/error";

// Security
import { timestamp } from "@/utils/timestamp";

// Helper types for the Facebook provider
type MediaItem = {
	type: string;
	url: string;
};

type PublishResult = {
	success: boolean;
	post_id: string;
	account_id: string;
} | null;

export class Facebook extends Provider<FacebookConfig, Account> {
	private version: "v21.0" | "v22.0" = "v22.0";

	constructor({
		config,
		accounts,
	}: Readonly<{
		config: FacebookConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"pages_show_list",
					"publish_video",
					"pages_manage_posts",
					// Required to publish to pages
					"pages_read_engagement",
					// Required to retrieve the list of pages the account is connected to
					"business_management",
				],
			},
			accounts,
		});

		this.version = config.version ?? "v22.0";
	}

	/**
	 * Returns a URL that the user can be redirected to in order to grant
	 * access to their Facebook account.
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
			base: `https://www.facebook.com/${this.version}/dialog/oauth`,
			scopes,
		});
	}

	/**
	 * Validates a Facebook access token against the required scopes.
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
	 * Exchanges a Facebook code for useful tokens.
	 *
	 * @param code - The code to exchange
	 * @param csrf_token - The CSRF token
	 *
	 * @returns An array of refresh token, long-lived access token, account ID, and expiry date for each page
	 */
	async exchange({
		code,
		csrf_token,
	}: Omit<
		ExchangeProps,
		"client_id" | "client_secret" | "redirect_uri"
	>): Promise<Response<ExchangeResponse[] | null>> {
		try {
			if (!this.config.redirectUri) {
				throw new Error("Redirect URI is required");
			}

			const baseUrl = `https://graph.facebook.com/${this.version}`;
			const params = new URLSearchParams({
				client_id: this.config.clientId,
				client_secret: this.config.clientSecret,
				grant_type: "authorization_code",
				redirect_uri: this.config.redirectUri,
				code,
				...(csrf_token ? { code_verifier: csrf_token } : {}),
			});

			const accessTokenResponse = await fetch(`${baseUrl}/oauth/access_token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: params,
			});

			if (!accessTokenResponse.ok) {
				const error = await accessTokenResponse.text();
				throw new Error(`Failed to exchange Facebook code: ${error}`);
			}

			const { access_token } = await accessTokenResponse.json();

			const pagesResponse = await fetch(
				`${baseUrl}/me/accounts?fields=id,access_token,name,picture,page_token`,
				{
					headers: { Authorization: `Bearer ${access_token}` },
				},
			);

			if (!pagesResponse.ok) {
				const error = await pagesResponse.text();
				throw new Error(`Failed to get Facebook pages: ${error}`);
			}

			const pages: FacebookPage = await pagesResponse.json();

			return {
				data: pages.data.map((page) => ({
					access_token: page.access_token,
					refresh_token: undefined,
					account_id: page.id,
					expiry: timestamp(90 * 24 * 60 * 60),
					details: {
						name: page.name,
						username: page.page_token, // This is actually the username of the page
						avatar_url: page.picture.data.url,
					},
				})),
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Failed to exchange Facebook code",
				},
			};
		}
	}

	/**
	 * Refreshes a Facebook access token or refresh token.
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
		return {
			data: {
				token: "",
				expires_in: 0,
			},
			error: null,
		};
	}

	/**
	 * Helper function to handle API errors
	 */
	private handleApiError(error: any, action: string): Response<null> {
		const errorMessage = error?.error?.message ?? JSON.stringify(error);
		return {
			data: null,
			error: {
				message: `Failed to ${action}: ${errorMessage}`,
			},
		};
	}

	/**
	 * Uploads a file to Facebook's servers.
	 *
	 * @param file_url - The URL of the file to upload
	 * @param access_token - The access token to use
	 *
	 * @returns The uploaded file handle
	 */
	private async uploadFileToFacebook(
		file_url: string,
		access_token: string,
	): Promise<Response<string | null>> {
		try {
			// Fetch file metadata
			const fileResponse = await fetch(file_url, { method: "HEAD" });
			if (!fileResponse.ok) {
				return {
					data: null,
					error: { message: `Failed to fetch file metadata from ${file_url}` },
				};
			}

			const contentType =
				fileResponse.headers.get("content-type") ?? "video/mp4";
			const contentLength = fileResponse.headers.get("content-length") ?? "0";
			const fileSize = Number.parseInt(contentLength, 10);

			if (!fileSize) {
				return {
					data: null,
					error: { message: "Could not determine file size" },
				};
			}

			const urlParts = file_url.split("/");
			let fileName = urlParts[urlParts.length - 1] ?? "video.mp4";

			try {
				fileName = decodeURIComponent(fileName);
			} catch (e) {
				console.warn("Failed to decode filename", e);
			}

			fileName = fileName
				.replace(/[\\/<@%:?&#=+,;*^|"'\s]/g, "_")
				.replace(/[^\w.-]/g, "_");

			if (/^[.-]/.test(fileName)) {
				fileName = `f${fileName}`;
			}

			// Step 1: Start upload session
			const sessionResponse = await fetch(
				`https://graph.facebook.com/${this.version}/${this.config.clientId}/uploads?${new URLSearchParams(
					{
						file_name: fileName,
						file_length: fileSize.toString(),
						file_type: contentType,
						access_token,
					},
				).toString()}`,
				{ method: "POST" },
			);

			if (!sessionResponse.ok) {
				const error = await sessionResponse.json();
				console.error("Facebook upload session error:", error);
				return this.handleApiError(error, "start upload session");
			}

			const sessionData = await sessionResponse.json();
			const uploadSessionId = sessionData.id.replace("upload:", "");

			// Step 2: Upload the file using file_url parameter as header
			const uploadResponse = await fetch(
				`https://graph.facebook.com/${this.version}/upload:${uploadSessionId}`,
				{
					method: "POST",
					headers: {
						Authorization: `OAuth ${access_token}`,
						file_offset: "0",
						file_url: file_url,
					},
				},
			);

			if (!uploadResponse.ok) {
				const error = await uploadResponse.json();
				console.error("Facebook file upload error:", error);
				return this.handleApiError(error, "upload file");
			}

			const uploadData = await uploadResponse.json();
			return {
				data: uploadData.h, // The file handle
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Unknown error during file upload",
				},
			};
		}
	}

	/**
	 * Initializes a reel upload session.
	 *
	 * @param page_id - The ID of the Facebook page
	 * @param access_token - The access token to use
	 *
	 * @returns The video ID and upload URL
	 */
	private async initializeReelUpload(
		page_id: string,
		access_token: string,
	): Promise<Response<{ video_id: string; upload_url: string } | null>> {
		try {
			const url = `https://graph.facebook.com/${this.version}/${page_id}/video_reels`;
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					upload_phase: "start",
					access_token: access_token,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				return this.handleApiError(error, "initialize reel upload");
			}

			const data = await response.json();
			return {
				data: {
					video_id: data.video_id,
					upload_url: data.upload_url,
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
							: "Unknown error during reel initialization",
				},
			};
		}
	}

	/**
	 * Uploads a video file for a reel.
	 *
	 * @param upload_url - The upload URL
	 * @param video_url - The URL of the video file
	 * @param access_token - The access token to use
	 *
	 * @returns Success status
	 */
	private async uploadReelVideo(
		upload_url: string,
		video_url: string,
		access_token: string,
	): Promise<Response<boolean | null>> {
		try {
			const response = await fetch(upload_url, {
				method: "POST",
				headers: {
					Authorization: `OAuth ${access_token}`,
					file_url: video_url,
				},
			});

			if (!response.ok) {
				const error = await response.json();
				return this.handleApiError(error, "upload reel video");
			}

			const data = await response.json();
			return {
				data: data.success ?? false,
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Unknown error during reel video upload",
				},
			};
		}
	}

	/**
	 * Publishes a reel to Facebook.
	 *
	 * @param page_id - The ID of the Facebook page
	 * @param video_id - The ID of the video
	 * @param access_token - The access token to use
	 * @param description - The description of the reel
	 * @param place_id - Optional place ID to tag
	 *
	 * @returns Success status and post ID
	 */
	private async publishReel(
		page_id: string,
		video_id: string,
		access_token: string,
		description?: string,
		place_id?: string,
	): Promise<Response<{ success: boolean; post_id: string } | null>> {
		try {
			const url = `https://graph.facebook.com/${this.version}/${page_id}/video_reels`;

			const params = new URLSearchParams({
				access_token,
				video_id,
				upload_phase: "finish",
				video_state: "PUBLISHED",
			});

			if (description) params.append("description", description);
			if (place_id) params.append("place", place_id);

			const response = await fetch(`${url}?${params.toString()}`, {
				method: "POST",
			});

			if (!response.ok) {
				const error = await response.json();
				return this.handleApiError(error, "publish reel");
			}

			const data = await response.json();
			return {
				data: {
					success: data.success ?? false,
					post_id: video_id, // Using video_id as post_id
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
							: "Unknown error during reel publishing",
				},
			};
		}
	}

	/**
	 * Publishes a post to Facebook.
	 *
	 * @param post - The post to publish
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"facebook">, "account">): Promise<
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
			const results: {
				success: boolean;
				post_id: string;
				account_id: string;
			}[] = [];
			const errors: ErrorResponse[] = [];

			// Convert media to array format for easier processing
			const mediaArray: MediaItem[] = Array.isArray(post?.media)
				? post.media
				: post?.media
					? [post.media]
					: [];

			for (const page of this.accounts) {
				try {
					let result: PublishResult;

					// Handle different post types
					if (post.fb_type === "reel") {
						result = await this.handleReelPost(page, post, mediaArray, errors);
					} else if (
						mediaArray.length === 1 &&
						mediaArray[0]?.type === "video"
					) {
						result = await this.handleVideoPost(
							page,
							post,
							mediaArray[0].url,
							errors,
						);
					} else {
						result = await this.handleRegularPost(
							page,
							post,
							mediaArray,
							errors,
						);
					}

					if (result) results.push(result);
				} catch (error) {
					errors.push({
						message:
							error instanceof Error
								? error.message
								: "Failed to publish to page",
						details: { account_id: page.id },
					});
				}
			}

			return {
				data: results.length > 0 ? results : null,
				error:
					errors.length > 0
						? {
								message: "Failed to publish to some or all pages",
								details: errors,
							}
						: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error ? error.message : "Failed to publish post",
					hint: "Please check your credentials and try again",
				},
			};
		}
	}

	/**
	 * Handles publishing a reel post
	 */
	private async handleReelPost(
		page: Account,
		post: PublishProps<"facebook">["post"],
		mediaArray: MediaItem[],
		errors: ErrorResponse[],
	): Promise<PublishResult> {
		// Reels require video
		if (mediaArray.length === 0 || mediaArray[0]?.type !== "video") {
			errors.push({
				message: "Facebook reels require a video",
				details: { account_id: page.id },
			});
			return null;
		}

		const videoUrl = mediaArray[0]?.url;

		// Initialize reel upload
		const initReelResult = await this.initializeReelUpload(
			page.id,
			page.access_token,
		);
		if (initReelResult.error) {
			errors.push({
				message: initReelResult.error.message,
				details: { account_id: page.id },
			});
			return null;
		}

		const { video_id, upload_url } = initReelResult.data!;

		// Upload video for reel
		const uploadResult = await this.uploadReelVideo(
			upload_url,
			videoUrl,
			page.access_token,
		);
		if (uploadResult.error) {
			errors.push({
				message: uploadResult.error.message,
				details: { account_id: page.id },
			});
			return null;
		}

		// Publish the reel
		const publishResult = await this.publishReel(
			page.id,
			video_id,
			page.access_token,
			post.text,
			post.options?.reel?.place_id,
		);

		if (publishResult.error) {
			errors.push({
				message: publishResult.error.message,
				details: { account_id: page.id },
			});
			return null;
		}

		// Invite collaborators if specified
		if (post.options?.reel?.collaborators?.length) {
			for (const collaboratorId of post.options.reel.collaborators) {
				await this.inviteReelCollaborator(
					video_id,
					collaboratorId,
					page.access_token,
				);
				// We don't fail if collaborator invites fail
			}
		}

		return {
			success: true,
			post_id: publishResult.data!.post_id,
			account_id: page.id,
		};
	}

	/**
	 * Handles publishing a video post
	 */
	private async handleVideoPost(
		page: Account,
		post: PublishProps<"facebook">["post"],
		videoUrl: string,
		errors: ErrorResponse[],
	): Promise<PublishResult> {
		// Upload the video file to get the file handle
		const uploadResult = await this.uploadFileToFacebook(
			videoUrl,
			page.access_token,
		);
		if (uploadResult.error) {
			errors.push({
				message: uploadResult.error.message,
				details: { account_id: page.id },
			});
			return null;
		}

		const fileHandle = uploadResult.data!;

		// Prepare parameters for video publishing
		const params = new URLSearchParams({
			access_token: page.access_token,
			fbuploader_video_file_chunk: fileHandle,
		});

		if (post.text) params.append("description", post.text);
		if (post.options?.video?.title)
			params.append("title", post.options.video.title);
		if (post.options?.video?.description)
			params.append("description", post.options.video.description);

		if (post.options?.publish_at) {
			const publishTime = Math.floor(
				new Date(post.options.publish_at).getTime() / 1000,
			);
			params.append("scheduled_publish_time", publishTime.toString());
			params.append("published", "false");
		}

		// Publish the video using graph.facebook.com (not graph-video as it's deprecated)
		const publishUrl = `https://graph.facebook.com/${this.version}/${page.id}/videos`;
		console.log("Publishing video to Facebook:", {
			url: publishUrl,
			page_id: page.id,
			has_file_handle: Boolean(fileHandle),
		});

		const publishResponse = await fetch(publishUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		});

		if (!publishResponse.ok) {
			const error = await publishResponse.json();
			console.error("Facebook video publish error:", error);
			throw new Error(
				`Failed to publish video: ${error?.error?.message ?? JSON.stringify(error)}`,
			);
		}

		const publishResult = await publishResponse.json();

		return {
			success: true,
			post_id: publishResult.id,
			account_id: page.id,
		};
	}

	/**
	 * Handles publishing a regular post (text-only or with images)
	 */
	private async handleRegularPost(
		page: Account,
		post: PublishProps<"facebook">["post"],
		mediaArray: MediaItem[],
		errors: ErrorResponse[],
	): Promise<PublishResult> {
		const attachedMedia: { media_fbid: string }[] = [];

		// Upload images if any
		if (mediaArray.length > 0) {
			for (const media of mediaArray) {
				if (media.type === "video") {
					errors.push({
						message:
							"For multiple videos, please upload them one at a time or use a reel",
						details: { account_id: page.id },
					});
					continue;
				}

				const uploadUrl = new URL(
					`https://graph.facebook.com/${this.version}/${page.id}/photos`,
				);

				const uploadBody = {
					url: media.url,
					published: false,
					access_token: page.access_token,
					...(post.options?.publish_at ? { temporary: true } : {}),
				};

				const uploadResponse = await fetch(uploadUrl.toString(), {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(uploadBody),
				});

				if (!uploadResponse.ok) {
					const error = await uploadResponse.json();
					throw new Error(
						`Failed to upload media: ${error?.error?.message ?? "Unknown error"}`,
					);
				}

				const { id } = await uploadResponse.json();
				attachedMedia.push({ media_fbid: id });
			}
		}

		// Build the post body
		const postBody: Record<string, any> = {
			message: post.text ?? "",
			access_token: page.access_token,
			published: true,
			...(post.link ? { link: post.link } : {}),
			...(attachedMedia.length > 0 ? { attached_media: attachedMedia } : {}),
		};

		// Handle scheduled posts
		if (post.options?.publish_at) {
			const publishTime = Math.floor(
				new Date(post.options.publish_at).getTime() / 1000,
			);
			Object.assign(postBody, {
				scheduled_publish_time: publishTime,
				published: false,
				...(attachedMedia.length > 0
					? { unpublished_content_type: "SCHEDULED" }
					: {}),
			});
		}

		const publishUrl = new URL(
			`https://graph.facebook.com/${this.version}/${page.id}/feed`,
		);
		const publishResponse = await fetch(publishUrl.toString(), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(postBody),
		});

		if (!publishResponse.ok) {
			const error = await publishResponse.json();
			throw new Error(
				`Failed to publish post: ${error?.error?.message ?? "Unknown error"}`,
			);
		}

		const publishResult = await publishResponse.json();

		return {
			success: true,
			post_id: publishResult.id,
			account_id: page.id,
		};
	}

	/**
	 * Invites collaborators for a reel.
	 *
	 * @param video_id - The ID of the video
	 * @param collaborator_id - The ID of the collaborator's Facebook page
	 * @param access_token - The access token to use
	 *
	 * @returns Success status
	 */
	private async inviteReelCollaborator(
		video_id: string,
		collaborator_id: string,
		access_token: string,
	): Promise<Response<boolean | null>> {
		try {
			const url = `https://graph.facebook.com/${this.version}/${video_id}/collaborators`;
			const params = new URLSearchParams({
				target_id: collaborator_id,
				access_token,
			});

			const response = await fetch(`${url}?${params.toString()}`, {
				method: "POST",
			});

			if (!response.ok) {
				const error = await response.json();
				return this.handleApiError(error, "invite collaborator");
			}

			const data = await response.json();
			return {
				data: data.success ?? false,
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Unknown error during collaborator invitation",
				},
			};
		}
	}
}

export default Facebook;
