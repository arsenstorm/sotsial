// Types

// Google
import { Google } from "@/providers/google";
import type { Account } from "@/types/auth";
import type { GoogleConfig } from "@/types/providers";
import type { PublishProps } from "@/types/publish";
import type { Response } from "@/types/response";

interface VideoMetadata {
  snippet: {
    title: string;
    description: string;
    tags: string[];
    categoryId?: string;
  };
  status: {
    privacyStatus: string;
    selfDeclaredMadeForKids: boolean;
  };
}

function applyShortsMetadata(metadata: VideoMetadata): VideoMetadata {
  const next: VideoMetadata = {
    snippet: { ...metadata.snippet, tags: [...metadata.snippet.tags] },
    status: { ...metadata.status },
  };

  if (!next.snippet.title.toLowerCase().includes("#shorts")) {
    next.snippet.title = `${next.snippet.title} #Shorts`;
  }

  if (!next.snippet.description.toLowerCase().includes("#shorts")) {
    next.snippet.description = next.snippet.description
      ? `${next.snippet.description}\n\n#Shorts`
      : "#Shorts";
  }

  const hasShortsTag =
    next.snippet.tags.includes("shorts") ||
    next.snippet.tags.includes("Shorts");

  if (!hasShortsTag) {
    next.snippet.tags.push("Shorts");
  }

  return next;
}

function buildVideoMetadata(
  post: PublishProps<"youtube">["post"]
): VideoMetadata {
  const metadata: VideoMetadata = {
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
    return applyShortsMetadata(metadata);
  }

  return metadata;
}

function selectVideoMedia(post: PublishProps<"youtube">["post"]): {
  url: string;
} {
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

  return { url: videoMedia.url };
}

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
      const { url } = selectVideoMedia(post);

      const videoResponse = await fetch(url);
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
      }

      const videoBlob = await videoResponse.blob();
      const metadata = buildVideoMetadata(post);

      const formData = new FormData();
      formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      formData.append("media", videoBlob, "video.mp4");

      const responseData: {
        success: boolean;
        post_id: string;
        account_id: string;
      }[] = [];

      for (const account of this.accounts) {
        const uploadResponse = await fetch(
          "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${account.access_token}` },
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(
            `Failed to upload video: ${JSON.stringify(errorData)}`
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
