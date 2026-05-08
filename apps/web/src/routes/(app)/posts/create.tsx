import { Button } from "@sotsial/ui/components/button";
import { Field, FieldLabel } from "@sotsial/ui/components/field";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { Skeleton } from "@sotsial/ui/components/skeleton";
import { Textarea } from "@sotsial/ui/components/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { IconArrowLeftOutlineDuo18 } from "nucleo-ui-outline-duo-18";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AccountSelection,
  type ConnectionOption,
} from "@/components/posting/account-selection";
import { type MediaItem, MediaUpload } from "@/components/posting/media-upload";
import type { PathState } from "@/components/posting/path-state";
import { PlatformSettings } from "@/components/posting/platform-settings";
import { PostPreview } from "@/components/posting/post-preview";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/posts/create")({
  component: CreatePostPage,
});

interface PublishResult {
  error?: { message?: string } | null;
  platform?: string;
  success?: boolean;
}

function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<"accounts" | "compose">("accounts");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [platformState, setPlatformState] = useState<Record<string, PathState>>(
    {}
  );

  const { data: connections = [], isLoading: connectionsLoading } = useQuery({
    queryKey: ["connections", "all"],
    queryFn: async () => {
      const res = await api.v1.connections.$get({
        query: { page: 1, limit: 100 },
      });
      if (!res.ok) {
        throw new Error("Failed to load connections");
      }
      const json = (await res.json()) as { data: ConnectionOption[] };
      return json.data;
    },
  });

  const selectedConnections = useMemo(
    () => connections.filter((c) => selectedIds.has(c.id)),
    [connections, selectedIds]
  );

  const uniquePlatforms = useMemo(
    () =>
      Array.from(
        new Set(selectedConnections.map((c) => c.platform).filter(Boolean))
      ),
    [selectedConnections]
  );

  const publishMutation = useMutation({
    mutationFn: async () => {
      const targets = selectedConnections.map(
        (c) => `${c.platform}:${c.account?.username ?? c.account_id}`
      );

      const mediaPayload = media.map(({ url, type }) => ({ url, type }));

      const post = {
        text,
        ...(mediaPayload.length > 0 ? { media: mediaPayload } : {}),
        ...buildPlatformOverrides(uniquePlatforms, platformState),
      };

      const res = await api.v1.publish.$post({
        json: { targets, post },
      });
      const json = (await res.json()) as
        | { id: string; results: PublishResult[] }
        | { error?: { message?: string } };

      if (!res.ok) {
        const err = (json as { error?: { message?: string } }).error;
        throw new Error(err?.message ?? "Publish failed");
      }
      return json as { id: string; results: PublishResult[] };
    },
    onSuccess: () => {
      toast.success("Post published");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.navigate({ to: "/posts" });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const canPublish =
    selectedIds.size > 0 &&
    text.trim().length > 0 &&
    !publishMutation.isPending;

  if (step === "accounts") {
    return (
      <div className="space-y-6">
        <PageHeading
          description="Choose which connected accounts should receive this post."
          title="New post"
        />

        {connectionsLoading ? (
          <div className="grid @3xl:grid-cols-3 @xl:grid-cols-2 grid-cols-1 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: placeholders
              <Skeleton className="h-16 w-full rounded-xl" key={i} />
            ))}
          </div>
        ) : (
          <AccountSelection
            connections={connections}
            onToggle={toggle}
            selectedIds={selectedIds}
          />
        )}

        <footer className="flex items-center justify-between border-border/60 border-t pt-4">
          <p className="text-muted-foreground text-sm">
            {selectedIds.size} account{selectedIds.size === 1 ? "" : "s"}{" "}
            selected
          </p>
          <Button
            disabled={selectedIds.size === 0}
            onClick={() => setStep("compose")}
          >
            Continue
          </Button>
        </footer>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        actions={
          <Button
            disabled={publishMutation.isPending}
            onClick={() => setStep("accounts")}
            size="sm"
            variant="outline"
          >
            <IconArrowLeftOutlineDuo18 strokeWidth={2} />
            Back
          </Button>
        }
        description="Write once, publish everywhere you've connected."
        title="New post"
      />

      <div className="grid @4xl:grid-cols-[3fr_2fr] grid-cols-1 gap-6">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            publishMutation.mutate();
          }}
        >
          <Field>
            <FieldLabel htmlFor="text">Text</FieldLabel>
            <Textarea
              id="text"
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind?"
              rows={6}
              value={text}
            />
          </Field>

          <Field>
            <FieldLabel>Media</FieldLabel>
            <MediaUpload items={media} onChange={setMedia} />
          </Field>

          <PlatformSettings
            onChange={setPlatformState}
            platforms={uniquePlatforms}
            state={platformState}
          />

          <div className="flex items-center justify-between border-border/60 border-t pt-4">
            <p className="text-muted-foreground text-xs">
              Publishing to {selectedIds.size} account
              {selectedIds.size === 1 ? "" : "s"} across{" "}
              {uniquePlatforms.length} platform
              {uniquePlatforms.length === 1 ? "" : "s"}.
            </p>
            <Button disabled={!canPublish} type="submit">
              {publishMutation.isPending ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </form>

        <div className="@4xl:sticky @4xl:top-[calc(var(--header-height)+1.5rem)] @4xl:self-start">
          <PostPreview media={media} platforms={uniquePlatforms} text={text} />
        </div>
      </div>
    </div>
  );
}

/**
 * Lift the flat `tk_*`/`ig_*`/`fb_*`/`yt_*` field state into the nested shape
 * the publish endpoint expects under each platform key.
 */
function buildPlatformOverrides(
  platforms: string[],
  state: Record<string, PathState>
): Record<string, unknown> {
  const overrides: Record<string, unknown> = {};

  for (const platform of platforms) {
    const slice = state[platform];
    if (!slice) {
      continue;
    }
    const payload = platformPayload(platform, slice);
    if (payload && Object.keys(payload).length > 0) {
      overrides[platform] = payload;
    }
  }

  return overrides;
}

function platformPayload(
  platform: string,
  slice: PathState
): Record<string, unknown> | null {
  if (platform === "tiktok") {
    return tiktokPayload(slice);
  }
  if (platform === "instagram") {
    return slice.ig_type ? { ig_type: slice.ig_type } : {};
  }
  if (platform === "facebook") {
    return facebookPayload(slice);
  }
  if (platform === "youtube") {
    return youtubePayload(slice);
  }
  return null;
}

function tiktokPayload(slice: PathState): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (slice.tk_type) {
    out.tk_type = slice.tk_type;
  }
  if (slice.tk_privacy) {
    out.privacy = slice.tk_privacy;
  }
  const safety = slice.tk_safety as Record<string, unknown> | undefined;
  const promotion = slice.tk_promotion as Record<string, unknown> | undefined;
  if (safety || promotion) {
    out.options = {
      ...(safety ? { safety } : {}),
      ...(promotion ? { promotion } : {}),
    };
  }
  return out;
}

function facebookPayload(slice: PathState): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (slice.fb_type) {
    out.fb_type = slice.fb_type;
  }
  if (slice.fb_link) {
    out.link = slice.fb_link;
  }
  if (slice.fb_options) {
    out.options = slice.fb_options;
  }
  return out;
}

function youtubePayload(slice: PathState): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (slice.yt_description) {
    out.description = slice.yt_description;
  }
  const options = youtubeOptions(slice);
  if (Object.keys(options).length > 0) {
    out.options = options;
  }
  return out;
}

function youtubeOptions(slice: PathState): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  if (slice.yt_type) {
    options.yt_type = slice.yt_type;
  }
  if (slice.yt_tags) {
    options.tags = String(slice.yt_tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (slice.yt_category_id) {
    options.category_id = slice.yt_category_id;
  }
  const ytOptions = slice.yt_options as Record<string, unknown> | undefined;
  if (ytOptions) {
    Object.assign(options, ytOptions);
  }
  return options;
}
