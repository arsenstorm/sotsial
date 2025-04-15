// Types
import type { Account } from "@/types/auth";
import type { Response } from "@/types/response";
import type { PublishProps } from "@/types/publish";

// Google
import { Google } from "@/providers/google";
import type { GoogleConfig } from "@/types/providers";

export class YouTube extends Google {
	constructor({
		config,
		accounts,
	}: Readonly<{
		config: GoogleConfig;
		accounts?: Account | Account[];
	}>) {
		super({
			config: {
				...config,
				scopes: config.scopes ?? [
					"https://www.googleapis.com/auth/youtube.force-ssl",
					"https://www.googleapis.com/auth/youtube.upload",
					"https://www.googleapis.com/auth/youtube.readonly",
					"https://www.googleapis.com/auth/youtube",
				],
			},
			accounts,
		});
	}

	/**
	 * Publishes a video to YouTube.
	 *
	 * @param post - The post to publish
	 * @param account - The account to publish the post to
	 *
	 * @returns The response from the publish request
	 */
	async publish({ post }: Omit<PublishProps<"youtube">, "account">): Promise<
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
			throw new Error("YouTube accounts not found");
		}

		try {
			if (!post.text) {
				throw new Error("Video title is required");
			}

			if (!post.media) {
				throw new Error("Video media is required");
			}

			const mediaItems = Array.isArray(post.media) ? post.media : [post.media];

			if (mediaItems.length === 0) {
				throw new Error("At least one video is required");
			}

			const videoMedia = mediaItems[0];
			if (videoMedia.type !== "video") {
				throw new Error("Media must be a video");
			}

			if (!videoMedia.url) {
				throw new Error("Video URL is required");
			}

			const videoResponse = await fetch(videoMedia.url);
			if (!videoResponse.ok) {
				throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
			}

			const videoBlob = await videoResponse.blob();
			const formData = new FormData();

			const metadata = {
				snippet: {
					title: post.text,
					description: post.description ?? "",
					tags: post.options?.tags ?? [],
					categoryId: post.options?.category_id,
				},
				status: {
					privacyStatus: post.privacy ?? "public",
					selfDeclaredMadeForKids: post.options?.made_for_kids ?? false,
				},
			};

			if (post.options?.yt_type === "short") {
				if (!metadata.snippet.title.toLowerCase().includes("#shorts")) {
					metadata.snippet.title = `${metadata.snippet.title} #Shorts`;
				}

				if (!metadata.snippet.description.toLowerCase().includes("#shorts")) {
					metadata.snippet.description = `${metadata.snippet.description ? `${metadata.snippet.description}\n\n` : ""}#Shorts`;
				}

				if (
					!metadata.snippet.tags.includes("shorts") &&
					!metadata.snippet.tags.includes("Shorts")
				) {
					metadata.snippet.tags.push("Shorts");
				}
			}

			// Append metadata as a JSON blob
			formData.append(
				"metadata",
				new Blob([JSON.stringify(metadata)], { type: "application/json" }),
			);

			// Append video file with correct mime type
			formData.append("media", videoBlob, "video.mp4");

			const responseData: {
				success: boolean;
				post_id: string;
				account_id: string;
			}[] = [];

			for (const account of this.accounts) {
				// Make the API request
				const uploadResponse = await fetch(
					"https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${account.access_token}`,
						},
						body: formData,
					},
				);

				if (!uploadResponse.ok) {
					const errorData = await uploadResponse.json();
					throw new Error(
						`Failed to upload video: ${JSON.stringify(errorData)}`,
					);
				}

				const response = await uploadResponse.json();
				responseData.push({
					success: true,
					post_id: response.id,
					account_id: account.id,
				});
			}

			return {
				data: responseData,
				error: null,
			};
		} catch (error) {
			return {
				data: null,
				error: {
					message:
						error instanceof Error
							? error.message
							: "Failed to publish to YouTube",
				},
			};
		}
	}
}

export default YouTube;
