import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@sotsial/ui/components/tabs";
import {
  IconFacebook,
  IconGoogle,
  IconInstagram,
  IconLinkedin,
  IconThreads,
  IconTikTok,
  IconXTwitter,
  IconYoutube,
} from "nucleo-social-media";
import type { MediaItem } from "@/components/posting/media-upload";

type PlatformIcon = React.ComponentType<{ className?: string }>;

const PLATFORM_ICONS: Record<string, PlatformIcon> = {
  facebook: IconFacebook,
  google: IconGoogle,
  instagram: IconInstagram,
  linkedin: IconLinkedin,
  threads: IconThreads,
  tiktok: IconTikTok,
  twitter: IconXTwitter,
  youtube: IconYoutube,
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
        {platforms.map((platform) => {
          const Icon = PLATFORM_ICONS[platform] ?? IconXTwitter;
          return (
            <TabsTrigger key={platform} value={platform}>
              <Icon className="size-3.5" />
              <span className="capitalize">{platform}</span>
            </TabsTrigger>
          );
        })}
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
  const Icon = PLATFORM_ICONS[platform] ?? IconXTwitter;
  const firstMedia = media[0];

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-center gap-2 border-border/70 border-b px-4 py-3">
        <Icon className="size-4 text-muted-foreground" />
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
