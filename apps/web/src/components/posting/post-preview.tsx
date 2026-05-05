import {
  FacebookFreeIcons,
  GoogleFreeIcons,
  InstagramFreeIcons,
  LinkedinIcon,
  ThreadsFreeIcons,
  TiktokIcon,
  TwitterFreeIcons,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sotsial/ui/components/tabs";
import type { MediaItem } from "@/components/posting/media-upload";

type ProviderIcon = Parameters<typeof HugeiconsIcon>[0]["icon"];

const PLATFORM_ICONS: Record<string, ProviderIcon> = {
  facebook: FacebookFreeIcons,
  google: GoogleFreeIcons,
  instagram: InstagramFreeIcons,
  linkedin: LinkedinIcon,
  threads: ThreadsFreeIcons,
  tiktok: TiktokIcon,
  twitter: TwitterFreeIcons,
  youtube: YoutubeIcon,
};

export function PostPreview({
  platforms,
  text,
  media,
}: {
  platforms: string[];
  text: string;
  media: MediaItem[];
}) {
  if (platforms.length === 0) {
    return (
      <div className="rounded-xl border border-border border-dashed bg-card/40 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Select at least one account to preview.
        </p>
      </div>
    );
  }

  return (
    <Tabs defaultValue={platforms[0]}>
      <TabsList className="flex w-full flex-wrap gap-1">
        {platforms.map((platform) => (
          <TabsTrigger key={platform} value={platform}>
            <HugeiconsIcon
              className="size-3.5"
              icon={PLATFORM_ICONS[platform] ?? TwitterFreeIcons}
            />
            <span className="capitalize">{platform}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {platforms.map((platform) => (
        <TabsContent className="mt-4" key={platform} value={platform}>
          <PreviewCard media={media} platform={platform} text={text} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PreviewCard({
  platform,
  text,
  media,
}: {
  platform: string;
  text: string;
  media: MediaItem[];
}) {
  const firstMedia = media[0];

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center gap-2 border-border/70 border-b px-4 py-3">
        <HugeiconsIcon
          className="size-4 text-muted-foreground"
          icon={PLATFORM_ICONS[platform] ?? TwitterFreeIcons}
        />
        <p className="font-medium text-sm capitalize">{platform} preview</p>
      </header>
      <div className="space-y-3 p-4">
        {text ? (
          <p className="whitespace-pre-wrap text-pretty text-sm leading-6">
            {text}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            Nothing to say yet.
          </p>
        )}
        {firstMedia ? (
          <div className="overflow-hidden rounded-lg border border-border">
            {firstMedia.type === "image" ? (
              // biome-ignore lint/correctness/useImageSize: user-supplied URL, intrinsic dims unknown
              <img
                alt="preview"
                className="aspect-video w-full object-cover"
                src={firstMedia.url}
              />
            ) : (
              // biome-ignore lint/a11y/useMediaCaption: preview only
              <video
                className="aspect-video w-full object-cover"
                controls
                src={firstMedia.url}
              />
            )}
            {media.length > 1 ? (
              <p className="bg-muted px-3 py-1.5 text-muted-foreground text-xs">
                +{media.length - 1} more item{media.length > 2 ? "s" : ""}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
