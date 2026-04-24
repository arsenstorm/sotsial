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
import { Button } from "@sotsial/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sotsial/ui/components/card";
import { PageHeading } from "@sotsial/ui/components/page-heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const Route = createFileRoute("/(app)/integrations")({
  component: IntegrationsPage,
});

const PROVIDERS = [
  { id: "facebook", name: "Facebook", icon: FacebookFreeIcons },
  { id: "instagram", name: "Instagram", icon: InstagramFreeIcons },
  { id: "threads", name: "Threads", icon: ThreadsFreeIcons },
  { id: "tiktok", name: "TikTok", icon: TiktokIcon },
  { id: "twitter", name: "Twitter", icon: TwitterFreeIcons },
  { id: "linkedin", name: "LinkedIn", icon: LinkedinIcon },
  { id: "google", name: "Google", icon: GoogleFreeIcons },
  { id: "youtube", name: "YouTube", icon: YoutubeIcon },
] as const;

function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeading
        description="Connect social accounts to publish through Sotsial."
        title="Integrations"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}

function ProviderCard({
  provider,
}: {
  provider: { id: string; name: string; icon: unknown };
}) {
  const queryClient = useQueryClient();
  const popupRef = useRef<Window | null>(null);

  useEffect(() => () => popupRef.current?.close(), []);

  const pollVerify = async (grantId: string) => {
    const started = Date.now();
    const timeout = 5 * 60 * 1000;

    while (Date.now() - started < timeout) {
      await new Promise((r) => setTimeout(r, 2000));

      const res = await api.v1.connections.verify.$get({
        query: { id: grantId },
      });

      if (!res.ok) {
        continue;
      }

      const json = (await res.json()) as {
        status?: "pending" | "success" | "failed";
      };

      if (json.status === "success") {
        return "success" as const;
      }
      if (json.status === "failed") {
        return "failed" as const;
      }
    }

    return "timeout" as const;
  };

  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await api.v1.connections.$post({
        query: { platform: provider.id, redirect: "close" },
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to start grant");
      }
      return (await res.json()) as { url: string; token: string };
    },
    onSuccess: async ({ url, token }) => {
      popupRef.current = window.open(
        url,
        `connect-${provider.id}`,
        "width=540,height=720"
      );
      const [grantId] = token.split("|");
      const outcome = await pollVerify(grantId);
      popupRef.current?.close();
      if (outcome === "success") {
        toast.success(`${provider.name} connected`);
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      } else if (outcome === "failed") {
        toast.error(`${provider.name} authorization failed`);
      } else {
        toast.error(`${provider.name} authorization timed out`);
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HugeiconsIcon
            className="size-5"
            icon={provider.icon as Parameters<typeof HugeiconsIcon>[0]["icon"]}
          />
          {provider.name}
        </CardTitle>
        <CardDescription>Connect a {provider.name} account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={startMutation.isPending}
          onClick={() => startMutation.mutate()}
        >
          {startMutation.isPending ? "Connecting…" : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}
