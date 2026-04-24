import clsx from "clsx";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import type { MediaItem } from "@/app/(app)/posting/page.client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Listbox, ListboxOption } from "@/components/ui/listbox";
import { Text } from "@/components/ui/text";
import { PlusIcon, XMarkIcon } from "@/icons/ui";

interface MediaUploadProps {
  mediaItems: MediaItem[];
  onAddMedia: (items: MediaItem[]) => void;
  onClearAllMedia: () => void;
  onRemoveMedia: (id: string) => void;
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
    if (!mediaUrl) {
      return;
    }

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
          "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragActive
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <PlusIcon className="mb-2 h-8 w-8 text-zinc-400 dark:text-zinc-500" />
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Drag & drop images or videos here, or click to select files
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            Supported formats: JPG, PNG, MP4, MOV
          </p>
        </div>
      </div>

      {/* URL-based media option */}
      <div className="mt-4">
        <Text className="mb-2 font-medium">Or add media via URL</Text>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Enter media URL"
              type="url"
              value={mediaUrl}
            />
          </div>
          <div className="w-28">
            <Listbox onChange={setMediaType} value={mediaType}>
              <ListboxOption value="image">Image</ListboxOption>
              <ListboxOption value="video">Video</ListboxOption>
            </Listbox>
          </div>
          <Button onClick={addMediaFromUrl} type="button">
            Add
          </Button>
        </div>
      </div>

      {/* Attached media preview */}
      {mediaItems.length > 0 && (
        <div className="mt-4 border-zinc-200 border-t pt-4 dark:border-zinc-800">
          <div className="mb-2 flex items-center justify-between">
            <Text className="font-medium">Attached Media</Text>
            <Button
              className="text-red-500 text-sm"
              onClick={onClearAllMedia}
              plain
            >
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mediaItems.map((item) => (
              <div className="group relative" key={item.id}>
                <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {item.type === "image" ? (
                    <img
                      alt=""
                      className="h-full w-full object-cover"
                      src={item.url}
                    />
                  ) : (
                    <video
                      className="h-full w-full object-cover"
                      src={item.url}
                    >
                      <track kind="captions" label="English captions" />
                    </video>
                  )}
                </div>
                <button
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => onRemoveMedia(item.id)}
                  type="button"
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
