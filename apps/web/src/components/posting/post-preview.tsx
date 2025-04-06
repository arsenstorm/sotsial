import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { platformDetails } from "@/config/platform-details";
import clsx from "clsx";
import type {
	Connection,
	MediaItem,
	PlatformFormState,
} from "@/app/(app)/posting/page.client";

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
			| React.KeyboardEvent<HTMLVideoElement>,
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
				"w-full rounded-lg border overflow-hidden",
				"bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800",
			)}
		>
			{/* Header with user info */}
			<div className="flex flex-col w-full items-start gap-3 px-4 pt-4">
				<div className="flex-1 w-full">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<Avatar
								src={connection.account?.avatar}
								className="size-10"
								initials={
									connection.account?.avatar
										? undefined
										: (connection.account?.username ?? "?").slice(0, 1)
								}
							/>
							<Text className="ml-1.5 text-sm !text-black dark:!text-white !font-semibold">
								{connection.account?.username ?? "no_username"}
							</Text>
							<Text className="text-sm !text-zinc-500">10h</Text>
						</div>
						<button
							type="button"
							aria-label="More options"
							className="text-zinc-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>More options</title>
								<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
							</svg>
						</button>
					</div>

					{/* Post content */}
					<Text className="whitespace-pre-wrap text-base my-3 !text-black dark:!text-white">
						{text || "This is some preview text."}
					</Text>

					{/* Media grid */}
					{media.length > 0 && (
						<div
							className={clsx(
								"overflow-hidden mt-3",
								media.length === 1
									? ""
									: "rounded-xl grid grid-cols-2 gap-0.5 border border-zinc-200 dark:border-zinc-800",
							)}
						>
							{media.map((item, index) => {
								// Only show up to 4 media items
								if (index >= 4) return null;

								// If there are more than 4, show a +X indicator on the 4th
								const showMoreIndicator = index === 3 && media.length > 4;

								return (
									<div
										key={item.id}
										className={clsx(
											"relative overflow-hidden",
											media.length === 1
												? "max-h-[400px]"
												: "aspect-square bg-zinc-100 dark:bg-zinc-800",
										)}
									>
										{item.type === "image" ? (
											<img
												src={item.url}
												alt=""
												className={clsx(
													media.length === 1
														? "rounded-xl max-w-full max-h-[400px] object-contain"
														: "w-full h-full object-cover",
												)}
											/>
										) : (
											<div
												className={clsx(
													"relative",
													media.length === 1 ? "w-full flex" : "w-full h-full",
												)}
											>
												<video
													src={item.url}
													className={clsx(
														media.length === 1
															? "rounded-xl max-w-full max-h-[400px] object-contain cursor-pointer"
															: "w-full h-full object-cover cursor-pointer",
													)}
													autoPlay
													playsInline
													muted
													loop
													preload="metadata"
													onClick={toggleVideoPlayback}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															toggleVideoPlayback(e);
														}
													}}
													tabIndex={0}
												>
													<track kind="captions" label="English captions" />
												</video>
											</div>
										)}

										{showMoreIndicator && (
											<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
												<Text className="text-white text-xl font-bold">
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
					<div className="flex items-center gap-6 mt-4 text-zinc-500">
						<div className="flex items-center gap-1">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
								role="img"
							>
								<title>Like</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
							<span className="text-xs">9.3K</span>
						</div>
						<div className="flex items-center gap-1">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
								role="img"
							>
								<title>Comment</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
							<span className="text-xs">5K</span>
						</div>
						<div className="flex items-center gap-1">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
								role="img"
							>
								<title>Repost</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
								/>
							</svg>
							<span className="text-xs">134</span>
						</div>
						<div className="flex items-center gap-1">
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
								role="img"
							>
								<title>Share</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Replies section */}
				<div className="py-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between w-full pb-3">
					<Text className="text-sm !text-black dark:!text-white !font-semibold">
						Replies
					</Text>
					<Text className="text-sm !text-zinc-500 flex items-center">
						View activity
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 ml-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>View activity</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
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
			| React.KeyboardEvent<HTMLVideoElement>,
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
					"rounded-lg p-4 border",
					"bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800",
				)}
			>
				<Text className="text-zinc-400 dark:text-zinc-500 italic">
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
					"rounded-lg p-4 border",
					"bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800",
				)}
			>
				<Text className="text-zinc-400 dark:text-zinc-500 italic">
					Preview not available for Instagram Stories.
				</Text>
			</div>
		);
	}

	return (
		<div
			className={clsx(
				"w-full rounded-lg border overflow-hidden",
				"bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800",
			)}
		>
			{/* Header with user info */}
			<div className="flex items-center justify-between p-3">
				<div className="flex items-center gap-2">
					<Avatar
						src={connection.account?.avatar}
						className="size-8"
						initials={
							connection.account?.avatar
								? undefined
								: (connection.account?.username ?? "?").slice(0, 1)
						}
					/>
					<div className="flex flex-col">
						<div className="flex items-center gap-1">
							<Text className="text-sm !text-black dark:!text-white !font-semibold">
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
					type="button"
					aria-label="More options"
					className="text-zinc-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<title>More options</title>
						<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
					</svg>
				</button>
			</div>

			{/* Media content */}
			<div className="relative">
				{media.length > 0 ? (
					<div className="relative group">
						{media[0].type === "image" ? (
							<img
								src={media[0].url}
								alt=""
								className="w-full aspect-square object-cover"
							/>
						) : (
							<video
								src={media[0].url}
								className="w-full aspect-square object-cover cursor-pointer"
								autoPlay
								playsInline
								muted
								loop
								preload="metadata"
								onClick={toggleVideoPlayback}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										toggleVideoPlayback(e);
									}
								}}
								tabIndex={0}
							>
								<track kind="captions" label="English captions" />
							</video>
						)}

						{/* Multi-image indicator */}
						{media.length > 1 && (
							<div className="absolute top-2 right-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-5 h-5 text-white"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-label="Multiple images"
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
									type="button"
									className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
									aria-label="Previous image"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-label="Previous"
									>
										<title>Previous</title>
										<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
									</svg>
								</button>
								<button
									type="button"
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
									aria-label="Next image"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-label="Next"
									>
										<title>Next</title>
										<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
									</svg>
								</button>
							</>
						)}

						{/* Image indicator dots */}
						{media.length > 1 && (
							<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
								{media.map((item, i) => (
									<div
										key={`image-indicator-${item.id}-${i}`}
										className={clsx(
											"w-1.5 h-1.5 rounded-full",
											i === 0 ? "bg-blue-500" : "bg-white/70",
										)}
									/>
								))}
							</div>
						)}
					</div>
				) : (
					<div className="w-full aspect-square bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
						<Text className="text-zinc-400 text-center text-balance">
							Instagram requires you to upload at least one image.
						</Text>
					</div>
				)}
			</div>

			{/* Action buttons */}
			<div className="p-3">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						<button
							type="button"
							className="text-black dark:text-white"
							aria-label="Like"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Like</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</button>
						<button
							type="button"
							className="text-black dark:text-white"
							aria-label="Comment"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Comment</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</button>
						<button
							type="button"
							className="text-black dark:text-white"
							aria-label="Share"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Share</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
								/>
							</svg>
						</button>
					</div>
					<button
						type="button"
						className="text-black dark:text-white"
						aria-label="Save"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-6 h-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Save</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
							/>
						</svg>
					</button>
				</div>

				{/* Likes */}
				<Text className="text-sm !text-black dark:!text-white !font-semibold">
					Liked by others
				</Text>

				{/* Caption */}
				{text && (
					<div className="mt-1">
						<Text className="text-sm !text-black dark:!text-white">
							<span className="font-semibold">
								{connection.account?.username ?? "no_username"}
							</span>
							{text}
						</Text>
					</div>
				)}

				{/* View all comments */}
				<Text className="text-sm !text-zinc-500 mt-1">
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
					"flex items-center gap-2 mb-3 p-2 rounded-lg border",
					"bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
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
				<ThreadsPreview text={text} media={media} connection={connection} />
			)}
			{platform === "instagram" && (
				<InstagramPreview
					text={text}
					media={media}
					options={{
						type: formState.ig_type,
					}}
					connection={connection}
				/>
			)}
		</div>
	);
}
