import { Delete02Icon, Upload04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { Input } from "@sotsial/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
}

interface UploadResponse {
  size: number;
  type: "image" | "video";
  url: string;
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const VIDEO_EXT = /\.(mp4|mov|quicktime)$/i;

function guessType(url: string): "image" | "video" | null {
  if (IMAGE_EXT.test(url)) {
    return "image";
  }
  if (VIDEO_EXT.test(url)) {
    return "video";
  }
  return null;
}

export function MediaUpload({
  items,
  onChange,
}: {
  items: MediaItem[];
  onChange: (next: MediaItem[]) => void;
}) {
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/v1/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? "Upload failed");
      }
      return (await res.json()) as UploadResponse;
    },
    onSuccess: (data) => {
      onChange([
        ...items,
        { id: crypto.randomUUID(), url: data.url, type: data.type },
      ]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const addFromUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }
    const type = guessType(trimmed);
    if (!type) {
      toast.error("Unsupported media URL (expect jpg/png/webp/gif/mp4/mov)");
      return;
    }
    onChange([...items, { id: crypto.randomUUID(), url: trimmed, type }]);
    setUrl("");
  };

  const remove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          disabled={uploadMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <HugeiconsIcon icon={Upload04Icon} />
          {uploadMutation.isPending ? "Uploading…" : "Upload file"}
        </Button>
        <input
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadMutation.mutate(file);
              e.target.value = "";
            }
          }}
          ref={fileInputRef}
          type="file"
        />
        <Field className="flex-1">
          <FieldLabel className="sr-only" htmlFor="media-url">
            Media URL
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              id="media-url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="…or paste an https URL"
              value={url}
            />
            <Button
              disabled={!url.trim()}
              onClick={addFromUrl}
              type="button"
              variant="outline"
            >
              Add
            </Button>
          </div>
        </Field>
      </div>

      {items.length > 0 ? (
        <ul className="grid @3xl:grid-cols-4 @xl:grid-cols-3 grid-cols-2 gap-2">
          {items.map((item) => (
            <li
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              key={item.id}
            >
              {item.type === "image" ? (
                // biome-ignore lint/correctness/useImageSize: user-supplied URL, intrinsic dims unknown
                <img
                  alt="media preview"
                  className="size-full object-cover"
                  src={item.url}
                />
              ) : (
                <video className="size-full object-cover" muted src={item.url}>
                  <track kind="captions" />
                </video>
              )}
              <Button
                aria-label="Remove media"
                className="absolute top-1.5 right-1.5 size-7 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
                onClick={() => remove(item.id)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
