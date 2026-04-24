"use client";

// Hooks
import { useMounted } from "@mantine/hooks";
// Utils
import clsx from "clsx";
// React
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
// UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
// Nuqs
import { useConnectionStates } from "@/config/connection-states";
// Config
import { platformDetails } from "@/config/platform-details";
import type { SupportedPlatforms } from "@/config/platforms";
import { ChevronDownIcon } from "@/icons/ui";
// SWR
import fetcher from "@/utils/data/fetcher";

type StepType = "selecting" | "creating" | "waiting" | "connected";

const steps: StepType[] = ["selecting", "creating", "waiting", "connected"];

export default function ConnectAccount({
  showButton = false,
}: Readonly<{
  showButton?: boolean;
}>) {
  const mounted = useMounted();
  const [id, setId] = useState<string | null>(null);
  const [connections, setConnections] = useConnectionStates();

  const {
    data: { status = "pending" },
  } = useSWR(id ? `/v1/connections/verify?id=${id}` : null, {
    fetcher,
    errorRetryCount: 0,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    refreshInterval: 1000,
    fallbackData: { status: "pending" },
  });

  const createConnection = useCallback(() => {
    setConnections({ connection: "selecting" });
  }, [setConnections]);

  const backStep = useCallback(() => {
    const currentIndex = steps.indexOf(connections.connection as StepType);

    if (currentIndex <= 0) {
      closeConnection();
      return;
    }

    setConnections({ connection: steps[currentIndex - 1] });
  }, [setConnections, connections.connection]);

  const selectPlatform = useCallback(
    (platform: SupportedPlatforms) => {
      setConnections({ platform, connection: "creating" });
    },
    [setConnections]
  );

  const handleConnect = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const response = await fetch(
      `/v1/connections?platform=${connections.platform}&redirect=close`, // Close the tab after the user has authorized the app
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await response.json();

    const { url, token } = data;

    if (!(url && token)) {
      toast.error("Couldn't create a connection to this platform.");
      return;
    }

    window.open(url, "_blank");
    setConnections({ connection: "waiting" });
    setId(token?.split("|")[0]); // the id is the first part of the token
  }, [setConnections, connections.platform]);

  const closeConnection = useCallback(() => {
    setConnections({ open: false });
  }, [setConnections]);

  useEffect(() => {
    // once the token no longer exists in the database,
    // either it is because it had expired or the user
    // closed the tab without completing the connection
    // either way, we can just say that the connection
    // is complete
    if (status === "success") {
      setConnections({ connection: "connected" });
      setId(null);
    }
  }, [status, setConnections]);

  if (!mounted) {
    return null;
  }

  const renderContent = () => {
    switch (connections.connection) {
      case "selecting":
        return (
          <>
            <DialogTitle>Connect a platform</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Select a social media platform to connect with your account
            </DialogDescription>
            <DialogBody>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(platformDetails)
                  .filter(([_, platform]) => platform.supported)
                  .map(([key, platform]) => (
                    <button
                      className="group flex items-center rounded-xl border border-zinc-200 bg-white p-3 text-left transition hover:border-zinc-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-offset-zinc-900 dark:hover:border-zinc-700"
                      key={key}
                      onClick={() => selectPlatform(key as SupportedPlatforms)}
                      type="button"
                    >
                      <div
                        className={clsx(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                          "bg-zinc-900 text-white dark:bg-zinc-700"
                        )}
                      >
                        <platform.logo className="h-5 w-5" />
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="truncate font-medium text-zinc-900 dark:text-white">
                          {platform.name}
                        </div>
                      </div>
                      <div className="ml-2">
                        <ChevronDownIcon className="size-4 -rotate-90" />
                      </div>
                    </button>
                  ))}
              </div>

              {Object.entries(platformDetails).some(
                ([_, p]) => !p.supported
              ) && (
                <div className="mt-8">
                  <h3 className="font-medium text-sm text-zinc-600 dark:text-zinc-400">
                    Coming soon
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {Object.entries(platformDetails)
                      .filter(([_, platform]) => !platform.supported)
                      .map(([key, platform]) => (
                        <div
                          className="flex flex-col items-center rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
                          key={key}
                        >
                          <div
                            className={clsx(
                              "mb-2 flex h-8 w-8 items-center justify-center rounded-full",
                              "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                            )}
                          >
                            <platform.logo className="h-4 w-4" />
                          </div>
                          <span className="text-center font-medium text-xs text-zinc-500">
                            {platform.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </DialogBody>
            <DialogActions>
              <Button onClick={closeConnection} plain>
                Cancel
              </Button>
            </DialogActions>
          </>
        );

      case "creating":
        return (
          <>
            <DialogTitle>
              Connect{" "}
              {
                platformDetails[connections.platform as SupportedPlatforms]
                  ?.name
              }
            </DialogTitle>
            <DialogDescription>
              Click connect to authorize your account. This will open in a new
              tab.
            </DialogDescription>
            <DialogActions>
              <Button onClick={backStep} plain>
                Back
              </Button>
              <Button onClick={handleConnect}>Connect</Button>
            </DialogActions>
          </>
        );

      case "waiting":
        return (
          <>
            <DialogTitle>Waiting for authorization</DialogTitle>
            <DialogDescription>
              Please authorize the connection in the new tab.
            </DialogDescription>
            <DialogBody className="flex justify-center py-8">
              <div className="size-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-800" />
            </DialogBody>
            <DialogActions>
              <Button onClick={closeConnection} plain>
                Cancel
              </Button>
            </DialogActions>
          </>
        );

      case "connected":
        return (
          <>
            <DialogTitle>Successfully Connected!</DialogTitle>
            <DialogDescription>
              Your{" "}
              {
                platformDetails[connections.platform as SupportedPlatforms]
                  ?.name
              }{" "}
              account is now connected.
            </DialogDescription>
            <DialogActions>
              <Button onClick={closeConnection}>Done</Button>
            </DialogActions>
          </>
        );
    }
  };

  return (
    <div>
      {showButton && (
        <Button color="dark/white" onClick={createConnection}>
          Connect an account
        </Button>
      )}
      <Dialog onClose={closeConnection} open={connections?.open}>
        {renderContent()}
      </Dialog>
    </div>
  );
}

export function ConnectAccountButton({
  platform,
  className,
  disabled,
  ...props
}: {
  readonly platform: SupportedPlatforms;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly props?: any;
}) {
  const [_, setConnections] = useConnectionStates();

  const selectPlatform = useCallback(
    (platform: SupportedPlatforms) => {
      setConnections({ platform, connection: "creating", open: true });
    },
    [setConnections]
  );

  return (
    <Button
      className={className}
      disabled={disabled}
      onClick={() => selectPlatform(platform)}
      {...props}
    >
      Connect to {platformDetails[platform].name}
    </Button>
  );
}
