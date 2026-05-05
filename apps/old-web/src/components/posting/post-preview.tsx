import clsx from "clsx";
import type {
  Connection,
  MediaItem,
  PlatformFormState,
} from "@/app/(app)/posting/page.client";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { platformDetails } from "@/config/platform-details";

/**
 * Threads preview component
 * @param text - The text of the post
 * @param media - The media of the post
 * @param connection - The connection of the post
 * @returns The Threads preview component
 */
function ThreadsPreview({
  text,
  media,
  connection,
}: {
  text: string;
  media: MediaItem[];
  connection: Connection;
}) {
  // Function to handle video playback toggle
  const toggleVideoPlayback = (
    event:
      | React.MouseEvent<HTMLVideoElement>
      | React.KeyboardEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      video.pause();
    }
  };

  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-lg border",
        "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      )}
    >
      {/* Header with user info */}
      <div className="flex w-full flex-col items-start gap-3 px-4 pt-4">
        <div className="w-full flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Avatar
                className="size-10"
                initials={
                  connection.account?.avatar
                    ? undefined
                    : (connection.account?.username ?? "?").slice(0, 1)
                }
                src={connection.account?.avatar}
              />
              <Text className="!text-black dark:!text-white !font-semibold ml-1.5 text-sm">
                {connection.account?.username ?? "no_username"}
              </Text>
              <Text className="!text-zinc-500 text-sm">10h</Text>
            </div>
            <button
              aria-label="More options"
              className="text-zinc-500"
              type="button"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>More options</title>
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>

          {/* Post content */}
          <Text className="!text-black dark:!text-white my-3 whitespace-pre-wrap text-base">
            {text || "This is some preview text."}
          </Text>

          {/* Media grid */}
          {media.length > 0 && (
            <div
              className={clsx(
                "mt-3 overflow-hidden",
                media.length === 1
                  ? ""
                  : "grid grid-cols-2 gap-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800"
              )}
            >
              {media.map((item, index) => {
                // Only show up to 4 media items
                if (index >= 4) {
                  return null;
                }

                // If there are more than 4, show a +X indicator on the 4th
                const showMoreIndicator = index === 3 && media.length > 4;

                return (
                  <div
                    className={clsx(
                      "relative overflow-hidden",
                      media.length === 1
                        ? "max-h-[400px]"
                        : "aspect-square bg-zinc-100 dark:bg-zinc-800"
                    )}
                    key={item.id}
                  >
                    {item.type === "image" ? (
                      <img
                        alt=""
                        className={clsx(
                          media.length === 1
                            ? "max-h-[400px] max-w-full rounded-xl object-contain"
                            : "h-full w-full object-cover"
                        )}
                        src={item.url}
                      />
                    ) : (
                      <div
                        className={clsx(
                          "relative",
                          media.length === 1 ? "flex w-full" : "h-full w-full"
                        )}
                      >
                        <video
                          autoPlay
                          className={clsx(
                            media.length === 1
                              ? "max-h-[400px] max-w-full cursor-pointer rounded-xl object-contain"
                              : "h-full w-full cursor-pointer object-cover"
                          )}
                          loop
                          muted
                          onClick={toggleVideoPlayback}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              toggleVideoPlayback(e);
                            }
                          }}
                          playsInline
                          preload="metadata"
                          src={item.url}
                          tabIndex={0}
                        >
                          <track kind="captions" label="English captions" />
                        </video>
                      </div>
                    )}

                    {showMoreIndicator && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Text className="font-bold text-white text-xl">
                          +{media.length - 3}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Engagement metrics */}
          <div className="mt-4 flex items-center gap-6 text-zinc-500">
            <div className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Like</title>
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="text-xs">9.3K</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Comment</title>
                <path
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="text-xs">5K</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Repost</title>
                <path
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <span className="text-xs">134</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                role="img"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Share</title>
                <path
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Replies section */}
        <div className="flex w-full justify-between border-zinc-100 border-t py-2 pb-3 dark:border-zinc-800">
          <Text className="!text-black dark:!text-white !font-semibold text-sm">
            Replies
          </Text>
          <Text className="!text-zinc-500 flex items-center text-sm">
            View activity
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>View activity</title>
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </Text>
        </div>
      </div>
    </div>
  );
}

/**
 * Instagram preview component
 * @param text - The text of the post
 * @param media - The media of the post
 * @param options - Additional options for the post preview
 * @param connection - The connection of the post
 * @returns The Instagram preview component
 */
function InstagramPreview({
  text,
  media,
  options = {},
  connection,
}: {
  text: string;
  media: MediaItem[];
  options?: any;
  connection: Connection;
}) {
  // Function to handle video playback toggle
  const toggleVideoPlayback = (
    event:
      | React.MouseEvent<HTMLVideoElement>
      | React.KeyboardEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;
    if (video.paused) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    } else {
      video.pause();
    }
  };

  if (options.type === "reel") {
    // TODO: Implement reel preview
    return (
      <div
        className={clsx(
          "rounded-lg border p-4",
          "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        )}
      >
        <Text className="text-zinc-400 italic dark:text-zinc-500">
          Preview not available for Instagram Reels.
        </Text>
      </div>
    );
  }

  if (options.type === "story") {
    // TODO: Implement story preview
    return (
      <div
        className={clsx(
          "rounded-lg border p-4",
          "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        )}
      >
        <Text className="text-zinc-400 italic dark:text-zinc-500">
          Preview not available for Instagram Stories.
        </Text>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "w-full overflow-hidden rounded-lg border",
        "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      )}
    >
      {/* Header with user info */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Avatar
            className="size-8"
            initials={
              connection.account?.avatar
                ? undefined
                : (connection.account?.username ?? "?").slice(0, 1)
            }
            src={connection.account?.avatar}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Text className="!text-black dark:!text-white !font-semibold text-sm">
                {connection.account?.username ?? "no_username"}
              </Text>
              <Text>•</Text>
              <Text>1w</Text>
            </div>
            <Text className="!text-xs !text-black dark:!text-white -mt-1.5">
              Somewhere in the world
            </Text>
          </div>
        </div>
        <button
          aria-label="More options"
          className="text-zinc-500"
          type="button"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>More options</title>
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* Media content */}
      <div className="relative">
        {media.length > 0 ? (
          <div className="group relative">
            {media[0].type === "image" ? (
              <img
                alt=""
                className="aspect-square w-full object-cover"
                src={media[0].url}
              />
            ) : (
              <video
                autoPlay
                className="aspect-square w-full cursor-pointer object-cover"
                loop
                muted
                onClick={toggleVideoPlayback}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleVideoPlayback(e);
                  }
                }}
                playsInline
                preload="metadata"
                src={media[0].url}
                tabIndex={0}
              >
                <track kind="captions" label="English captions" />
              </video>
            )}

            {/* Multi-image indicator */}
            {media.length > 1 && (
              <div className="absolute top-2 right-2">
                <svg
                  aria-label="Multiple images"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Multiple images</title>
                  <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                </svg>
              </div>
            )}

            {/* Navigation for multi-image posts */}
            {media.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/70 p-1 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/50"
                  type="button"
                >
                  <svg
                    aria-label="Previous"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Previous</title>
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                </button>
                <button
                  aria-label="Next image"
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/70 p-1 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-black/50"
                  type="button"
                >
                  <svg
                    aria-label="Next"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Next</title>
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </button>
              </>
            )}

            {/* Image indicator dots */}
            {media.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {media.map((item, i) => (
                  <div
                    className={clsx(
                      "h-1.5 w-1.5 rounded-full",
                      i === 0 ? "bg-blue-500" : "bg-white/70"
                    )}
                    key={`image-indicator-${item.id}-${i}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <Text className="text-balance text-center text-zinc-400">
              Instagram requires you to upload at least one image.
            </Text>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Like"
              className="text-black dark:text-white"
              type="button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Like</title>
                <path
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <button
              aria-label="Comment"
              className="text-black dark:text-white"
              type="button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Comment</title>
                <path
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <button
              aria-label="Share"
              className="text-black dark:text-white"
              type="button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Share</title>
                <path
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
          <button
            aria-label="Save"
            className="text-black dark:text-white"
            type="button"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Save</title>
              <path
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        {/* Likes */}
        <Text className="!text-black dark:!text-white !font-semibold text-sm">
          Liked by others
        </Text>

        {/* Caption */}
        {text && (
          <div className="mt-1">
            <Text className="!text-black dark:!text-white text-sm">
              <span className="font-semibold">
                {connection.account?.username ?? "no_username"}
              </span>
              {text}
            </Text>
          </div>
        )}

        {/* View all comments */}
        <Text className="!text-zinc-500 mt-1 text-sm">
          View all {options.commentCount ?? 14} comments
        </Text>
      </div>
    </div>
  );
}

/**
 * Post preview component
 * @param platform - The platform of the post
 * @param text - The text of the post
 * @param media - The media of the post
 * @param options - Additional options for the post preview
 */
export function PostPreview({
  platform,
  text,
  media,
  connection,
  formState,
}: {
  platform: string;
  text: string;
  media: MediaItem[];
  connection: Connection;
  formState: PlatformFormState;
}) {
  const PlatformLogo =
    platformDetails[platform as keyof typeof platformDetails]?.logo;
  const platformName =
    platformDetails[platform as keyof typeof platformDetails]?.name ??
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div>
      <div
        className={clsx(
          "mb-3 flex items-center gap-2 rounded-lg border p-2",
          "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
        )}
      >
        {PlatformLogo && (
          <PlatformLogo className="size-5 text-zinc-600 dark:text-zinc-400" />
        )}
        <Text className="font-medium text-zinc-700 dark:text-zinc-300">
          Previewing {platformName}
        </Text>
      </div>

      {platform === "threads" && (
        <ThreadsPreview connection={connection} media={media} text={text} />
      )}
      {platform === "instagram" && (
        <InstagramPreview
          connection={connection}
          media={media}
          options={{
            type: formState.ig_type,
          }}
          text={text}
        />
      )}
    </div>
  );
}
