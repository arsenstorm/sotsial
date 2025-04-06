import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Listbox, ListboxOption } from "@/components/ui/listbox";
import { Text } from "@/components/ui/text";
import { PlusIcon, XMarkIcon } from "@/icons/ui";
import type { MediaItem } from "@/app/(app)/posting/page.client";
import clsx from "clsx";

interface MediaUploadProps {
	mediaItems: MediaItem[];
	onAddMedia: (items: MediaItem[]) => void;
	onRemoveMedia: (id: string) => void;
	onClearAllMedia: () => void;
}

export function MediaUpload({
	mediaItems,
	onAddMedia,
	onRemoveMedia,
	onClearAllMedia,
}: MediaUploadProps) {
	const [mediaUrl, setMediaUrl] = useState("");
	const [mediaType, setMediaType] = useState<"image" | "video">("image");

	// File upload handling
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			"image/*": [],
			"video/*": [],
		},
		maxFiles: 10,
		onDrop: (acceptedFiles: File[]) => {
			// TODO: Upload files to server and get back URLs
			const newMediaItems = acceptedFiles.map((file: File) => ({
				type: file.type.startsWith("image/")
					? ("image" as const)
					: ("video" as const),
				url: URL.createObjectURL(file),
				id: `${file.name}-${Date.now()}`,
			}));

			onAddMedia(newMediaItems);
		},
	});

	// Add media from URL
	const addMediaFromUrl = () => {
		if (!mediaUrl) return;

		onAddMedia([
			{
				type: mediaType,
				url: mediaUrl,
				id: `${mediaType}-${mediaUrl}-${Date.now()}`,
			},
		]);
		setMediaUrl("");
	};

	return (
		<div>
			{/* Modern file dropzone */}
			<div
				{...getRootProps()}
				className={clsx(
					"border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
					isDragActive
						? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
						: "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600",
				)}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center">
					<PlusIcon className="h-8 w-8 text-zinc-400 dark:text-zinc-500 mb-2" />
					<p className="text-base text-zinc-600 dark:text-zinc-400">
						Drag & drop images or videos here, or click to select files
					</p>
					<p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
						Supported formats: JPG, PNG, MP4, MOV
					</p>
				</div>
			</div>

			{/* URL-based media option */}
			<div className="mt-4">
				<Text className="font-medium mb-2">Or add media via URL</Text>
				<div className="flex gap-2">
					<div className="flex-1">
						<Input
							type="url"
							value={mediaUrl}
							onChange={(e) => setMediaUrl(e.target.value)}
							placeholder="Enter media URL"
						/>
					</div>
					<div className="w-28">
						<Listbox value={mediaType} onChange={setMediaType}>
							<ListboxOption value="image">Image</ListboxOption>
							<ListboxOption value="video">Video</ListboxOption>
						</Listbox>
					</div>
					<Button type="button" onClick={addMediaFromUrl}>
						Add
					</Button>
				</div>
			</div>

			{/* Attached media preview */}
			{mediaItems.length > 0 && (
				<div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
					<div className="flex justify-between items-center mb-2">
						<Text className="font-medium">Attached Media</Text>
						<Button
							plain
							onClick={onClearAllMedia}
							className="text-red-500 text-sm"
						>
							Clear All
						</Button>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
						{mediaItems.map((item) => (
							<div key={item.id} className="relative group">
								<div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
									{item.type === "image" ? (
										<img
											src={item.url}
											alt=""
											className="w-full h-full object-cover"
										/>
									) : (
										<video
											src={item.url}
											className="w-full h-full object-cover"
										>
											<track kind="captions" label="English captions" />
										</video>
									)}
								</div>
								<button
									type="button"
									onClick={() => onRemoveMedia(item.id)}
									className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<XMarkIcon className="size-4" />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
