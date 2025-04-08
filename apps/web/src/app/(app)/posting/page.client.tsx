"use client";

// React
import { useState, useEffect, useMemo } from "react";

// UI
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

// Config
import { platformDetails } from "@/config/platform-details";

// Icons
import { ArrowTriangleLineLeftIcon } from "@/icons/ui";

// Components
import { AccountSelection } from "@/components/posting/account-selection";
import { MediaUpload } from "@/components/posting/media-upload";
import { PlatformSettings } from "@/components/posting/platform-settings";
import { PostPreview } from "@/components/posting/post-preview";

// Utils
import clsx from "clsx";
import { toast } from "sonner";

// Types
export type MediaItem = {
	type: "image" | "video";
	url: string;
	id: string;
};

export type Connection = {
	id: string;
	platform: string;
	credential: string;
	account_id: string;
	created_at: string;
	tags: string[];
	expiry: string;
	account: {
		avatar: string | null;
		username: string | null;
		name: string | null;
	} | null;
};

// Platform-specific form state
export type PlatformFormState = {
	// Instagram
	ig_type?: "feed" | "reel" | "story";

	// TikTok
	tk_type?: "video" | "image";
	tk_privacy?: "public" | "mutual" | "private";
	tk_safety?: {
		allow_comments?: boolean;
		allow_duet?: boolean;
		allow_stitch?: boolean;
	};
	tk_promotion?: {
		self_promotion: boolean;
		is_your_brand_content?: boolean;
		is_branded_content?: boolean;
	};

	// Facebook
	fb_type?: "feed" | "reel";
	fb_link?: string;
	fb_privacy?: "public";
	fb_options?: {
		publish_at?: Date;
		video?: {
			title?: string;
			description?: string;
		};
		reel?: {
			place_id?: string;
			collaborators?: string[];
		};
	};
};

export function PostingForm() {
	// Wizard state
	const [step, setStep] = useState<"accounts" | "content">("accounts");
	const [activePreviewTab, setActivePreviewTab] = useState<number>(0);

	// Account selection state
	const [connections, setConnections] = useState<Connection[]>([]);
	const [selectedConnections, setSelectedConnections] = useState<Connection[]>(
		[],
	);
	const [isLoadingConnections, setIsLoadingConnections] = useState(true);
	const [connectionsError, setConnectionsError] = useState<string | null>(null);

	// Post content state
	const [postText, setPostText] = useState("");
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	// Platform-specific form state
	const [platformFormState, setPlatformFormState] = useState<PlatformFormState>(
		{},
	);

	// Get unique platforms from selected connections
	const uniquePlatforms = useMemo(
		() => Array.from(new Set(selectedConnections.map((conn) => conn.platform))),
		[selectedConnections],
	);

	// Set default active preview tab whenever selected connections or platforms change
	useEffect(() => {
		if (uniquePlatforms.length > 0) {
			setActivePreviewTab(0);
		}
	}, [uniquePlatforms]);

	// Fetch connections
	useEffect(() => {
		async function fetchConnections() {
			try {
				setIsLoadingConnections(true);
				setConnectionsError(null);

				const response = await fetch("/v1/connections");
				const data = await response.json();

				if (!response.ok) {
					throw new Error("Failed to fetch connections");
				}

				setConnections(data.data);
			} catch (error) {
				console.error(error);
				setConnectionsError(
					error instanceof Error ? error.message : "Failed to load connections",
				);
			} finally {
				setIsLoadingConnections(false);
			}
		}

		fetchConnections();
	}, []);

	// Handle connection selection
	const handleConnectionToggle = (connection: Connection) => {
		setSelectedConnections((prev) => {
			const isSelected = prev.some((c) => c.id === connection.id);
			if (isSelected) {
				return prev.filter((c) => c.id !== connection.id);
			}

			// Initialize platform-specific defaults when adding a new connection
			const newConnections = [...prev, connection];

			// Check if this is the first connection for this platform
			const isNewPlatform = !prev.some(
				(c) => c.platform === connection.platform,
			);

			if (isNewPlatform) {
				// Initialize platform-specific form state with defaults
				setPlatformFormState((current) => {
					const updatedState = { ...current };

					// Set platform-specific defaults
					if (connection.platform === "tiktok") {
						updatedState.tk_type = updatedState.tk_type ?? "video";
						updatedState.tk_privacy = updatedState.tk_privacy ?? "public";
						updatedState.tk_safety = updatedState.tk_safety ?? {
							allow_comments: true,
							allow_duet: true,
							allow_stitch: true,
						};
						updatedState.tk_promotion = updatedState.tk_promotion ?? {
							self_promotion: false,
						};
					} else if (connection.platform === "instagram") {
						updatedState.ig_type = updatedState.ig_type ?? "feed";
					} else if (connection.platform === "facebook") {
						updatedState.fb_type = updatedState.fb_type ?? "feed";
					}

					return updatedState;
				});
			}

			return newConnections;
		});
	};

	// Platform-specific form handlers
	const handlePlatformFormChange = (
		platform: string,
		field: string,
		value: any,
	) => {
		setPlatformFormState((prev) => {
			const newState = { ...prev };

			if (field.includes(".")) {
				const [parent, child] = field.split(".");
				const parentKey = parent as keyof PlatformFormState;
				newState[parentKey] = {
					...((newState[parentKey] as any) ?? {}),
					[child]: value,
				};
			} else {
				const key = field as keyof PlatformFormState;
				newState[key] = value;
			}

			return newState;
		});
	};

	// Form validation
	const validateForm = () => {
		const errors: string[] = [];

		// Basic validation
		if (selectedConnections.length === 0) {
			errors.push("Please select at least one account to post to");
		}

		if (!postText && mediaItems.length === 0) {
			errors.push("Please enter post content or add media");
		}

		// Platform-specific validation
		for (const connection of selectedConnections) {
			switch (connection.platform) {
				case "tiktok":
					if (!platformFormState.tk_type) {
						errors.push("TikTok requires a post type");
					}
					if (!platformFormState.tk_privacy) {
						errors.push("TikTok requires a privacy setting");
					}
					if (mediaItems.length === 0) {
						errors.push("TikTok requires at least one media item");
					}
					break;
				case "instagram":
					if (!platformFormState.ig_type) {
						errors.push("Instagram requires a post type");
					}
					if (mediaItems.length === 0) {
						errors.push("Instagram requires at least one media item");
					}
					break;
				case "facebook":
					if (!platformFormState.fb_type) {
						errors.push("Facebook requires a post type");
					}
					break;
			}
		}

		return errors;
	};

	// Form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const errors = validateForm();
		if (errors.length > 0) {
			setError(errors.join(", "));
			return;
		}

		async function publish() {
			setIsSubmitting(true);
			setError(null);
			setSuccess(false);

			try {
				// Prepare targets based on selected connections
				const targets = selectedConnections.map(
					(conn) =>
						`${conn.platform}:${conn.account?.username ?? conn.account_id}`,
				);

				// Prepare platform-specific content
				const platformContent = selectedConnections.reduce(
					(acc, conn) => {
						switch (conn.platform) {
							case "tiktok":
								acc[conn.platform] = {
									text: postText,
									media: mediaItems,
									tk_type: platformFormState.tk_type,
									privacy: platformFormState.tk_privacy,
									options: {
										safety: platformFormState.tk_safety,
										promotion: platformFormState.tk_promotion,
									},
								};
								break;
							case "instagram":
								acc[conn.platform] = {
									text: postText,
									media: mediaItems,
									ig_type: platformFormState.ig_type,
								};
								break;
							case "facebook":
								acc[conn.platform] = {
									text: postText,
									media: mediaItems,
									fb_type: platformFormState.fb_type,
									link: platformFormState.fb_link,
									privacy: platformFormState.fb_privacy,
									options: platformFormState.fb_options,
								};
								break;
							default:
								acc[conn.platform] = {
									text: postText,
									media: mediaItems,
								};
						}
						return acc;
					},
					{} as Record<string, any>,
				);

				const response = await fetch("/v1/publish", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						targets,
						post: platformContent,
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data?.error?.message ?? "Failed to publish post");
				}

				setSuccess(true);
				setPostText("");
				setMediaItems([]);
				setPlatformFormState({});
				// Keep selected connections for convenience
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "An unknown error occurred",
				);
				throw err;
			} finally {
				setIsSubmitting(false);
			}
		}

		toast.promise(publish, {
			loading: "Publishing post...",
			success: "Post published successfully!",
			error: (err) => {
				return err instanceof Error ? err.message : "An unknown error occurred";
			},
		});
	};

	// Navigation between steps
	const goToContentStep = () => {
		if (selectedConnections.length === 0) {
			toast.error("Please select at least one account to post to");
			return;
		}
		setStep("content");
	};

	const goToAccountsStep = () => {
		setStep("accounts");
	};

	// Render account selection step
	if (step === "accounts") {
		return (
			<AccountSelection
				connections={connections}
				selectedConnections={selectedConnections}
				isLoading={isLoadingConnections}
				error={connectionsError}
				onToggleConnection={handleConnectionToggle}
				onContinue={goToContentStep}
			/>
		);
	}

	// Render content creation step with side-by-side preview
	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center justify-between">
				<Button type="button" onClick={goToAccountsStep} outline>
					<ArrowTriangleLineLeftIcon className="mr-1" />
					Back to accounts
				</Button>
				<Text className="font-medium">
					Posting to {selectedConnections.length} account
					{selectedConnections.length !== 1 ? "s" : ""}
				</Text>
			</div>

			{/* Selected accounts preview */}
			<div className="flex flex-wrap gap-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
				{selectedConnections.map((connection) => {
					const Logo =
						platformDetails[connection.platform as keyof typeof platformDetails]
							?.logo ?? null;

					return (
						<div
							key={connection.id}
							className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700"
						>
							{Logo && <Logo className="size-5" />}
							<Avatar
								src={connection.account?.avatar}
								className="size-6"
								initials={
									connection.account?.avatar
										? undefined
										: (connection.account?.username ?? "?").slice(0, 1)
								}
								square
							/>
							<Text className="text-sm">
								{connection.account?.username ?? "no username"}
							</Text>
						</div>
					);
				})}
			</div>

			{error && (
				<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
					<p className="text-red-700 dark:text-red-400">{error}</p>
				</div>
			)}

			{success && (
				<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
					<p className="text-green-700 dark:text-green-400">
						Post published successfully!
					</p>
				</div>
			)}

			{/* Split view layout */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* Left side - Content creation */}
				<div className="space-y-6">
					<Card>
						<div className="p-4">
							<Textarea
								value={postText}
								onChange={(e) => setPostText(e.target.value)}
								placeholder="What's on your mind?"
								rows={5}
								className="w-full mb-4"
							/>

							<MediaUpload
								mediaItems={mediaItems}
								onAddMedia={(items: MediaItem[]) =>
									setMediaItems((prev) => [...prev, ...items])
								}
								onRemoveMedia={(id: string) =>
									setMediaItems((prev) => prev.filter((item) => item.id !== id))
								}
								onClearAllMedia={() => setMediaItems([])}
							/>
						</div>
					</Card>

					{/* Platform-specific settings in cards */}
					{uniquePlatforms.map((platform) => (
						<PlatformSettings
							key={platform}
							platform={platform}
							formState={platformFormState}
							onChange={handlePlatformFormChange}
						/>
					))}
				</div>

				{/* Right side - Live preview */}
				<div className="space-y-6">
					<Card className="sticky top-4">
						<div className="p-4">
							<h3 className="text-base font-medium mb-4">Live Preview</h3>

							<TabGroup
								selectedIndex={activePreviewTab}
								onChange={setActivePreviewTab}
								as="div"
								className="relative"
							>
								{uniquePlatforms.length > 1 && (
									<TabList className="flex gap-2 mb-4 overflow-x-auto pb-1 relative">
										{uniquePlatforms.map((platform, index) => {
											const Logo =
												platformDetails[
													platform as keyof typeof platformDetails
												]?.logo ?? null;

											return (
												<Tab
													key={platform}
													className={clsx(
														"group relative flex items-center gap-2 rounded-full py-1.5 px-3 text-sm/6 font-medium focus:outline-none transition-all border",
														index === activePreviewTab
															? "bg-blue-50 text-blue-700 border-blue-500 shadow-sm dark:bg-blue-950 dark:text-white dark:border-blue-700"
															: "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800",
													)}
												>
													{Logo && (
														<Logo
															className={clsx(
																"size-4",
																index === activePreviewTab
																	? "text-blue-600 dark:text-white"
																	: "text-zinc-500 dark:text-zinc-400",
															)}
														/>
													)}
													<span>
														{platformDetails[
															platform as keyof typeof platformDetails
														]?.name ??
															platform.charAt(0).toUpperCase() +
																platform.slice(1)}
													</span>
												</Tab>
											);
										})}
									</TabList>
								)}

								<div className="border-b border-zinc-200 dark:border-zinc-700 mb-4" />

								<TabPanels>
									{uniquePlatforms.map((platform) => {
										// Use the first connection of this platform for preview
										const connectionForPreview =
											selectedConnections.find(
												(conn) => conn.platform === platform,
											) ?? selectedConnections[0];

										return (
											<TabPanel key={platform}>
												<PostPreview
													platform={platform}
													text={postText}
													media={mediaItems}
													connection={connectionForPreview}
													formState={platformFormState}
												/>
											</TabPanel>
										);
									})}
								</TabPanels>
							</TabGroup>
						</div>
					</Card>
				</div>
			</div>

			<div className="flex justify-end gap-4">
				<Button type="submit" color="blue" disabled={isSubmitting}>
					{isSubmitting ? "Publishing..." : "Publish Post"}
				</Button>
			</div>
		</form>
	);
}
