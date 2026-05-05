"use client";

// Hooks
import { useClipboard } from "@mantine/hooks";
// React
import { useCallback, useEffect, useState } from "react";
// UI
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
// Config
import { platformDetails } from "@/config/platform-details";
// Icons
import {
  ChevronDownIcon,
  ClipboardIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  XMarkIcon,
} from "@/icons/ui";

export function ConnectionDropdown({
  connection,
  disconnect = () => {},
  onTagsUpdate = () => {},
}: Readonly<{
  connection: {
    id: string;
    platform: string;
    credential: string;
    account_id: string;
    tags: string[];
    expiry: string;
  };
  disconnect: () => void;
  onTagsUpdate: (updatedTags: string[]) => void;
}>) {
  const clipboard = useClipboard({ timeout: 500 });
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(connection.tags ?? []);
  const [newTag, setNewTag] = useState("");

  const handleCopyId = useCallback(() => {
    clipboard.copy(connection.id);
    toast.success("Copied connection ID to clipboard");
  }, [clipboard, connection.id]);

  const handleCopyCredential = useCallback(() => {
    clipboard.copy(connection.credential);
    toast.success("Copied credential ID to clipboard");
  }, [clipboard, connection.credential]);

  const handleCopyAccountId = useCallback(() => {
    clipboard.copy(connection.account_id);
    toast.success("Copied account ID to clipboard");
  }, [clipboard, connection.account_id]);

  const handleTagsEdit = useCallback(() => {
    setTags(connection.tags ?? []);
    setIsTagDialogOpen(true);
  }, [connection.tags]);

  const handleAddTag = useCallback(() => {
    if (!newTag.trim()) {
      return;
    }
    setTags((prev) => [...prev, newTag.trim()]);
    setNewTag("");
  }, [newTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleSaveTags = useCallback(async () => {
    async function update() {
      const response = await fetch("/v1/connections", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targets: [connection.id],
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tags");
      }

      onTagsUpdate(tags);
      setIsTagDialogOpen(false);
    }

    toast.promise(update(), {
      loading: "Updating tags...",
      success: "Tags updated successfully",
      error: "Failed to update tags",
    });
  }, [connection.id, tags, onTagsUpdate]);

  return (
    <>
      <Dropdown>
        <DropdownButton outline>
          Options
          <ChevronDownIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem onClick={handleCopyId}>
            <ClipboardIcon />
            Copy Connection ID
            <DropdownDescription>Copy the connection ID.</DropdownDescription>
          </DropdownItem>

          <DropdownItem onClick={handleCopyCredential}>
            <ClipboardIcon />
            Copy Credential ID
            <DropdownDescription>
              Copy the associated credential ID.
            </DropdownDescription>
          </DropdownItem>

          <DropdownItem onClick={handleCopyAccountId}>
            <ClipboardIcon />
            Copy Account ID
            <DropdownDescription>
              Copy the user‘s account ID.
            </DropdownDescription>
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem onClick={handleTagsEdit}>
            <TagIcon />
            Edit Tags
            <DropdownDescription>Edit the connection tags.</DropdownDescription>
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem onClick={disconnect}>
            Disconnect
            <TrashIcon />
            <DropdownDescription>Delete this connection.</DropdownDescription>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dialog onClose={() => setIsTagDialogOpen(false)} open={isTagDialogOpen}>
        <DialogTitle>Edit Tags</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge className="flex items-center gap-1" key={tag}>
                  {tag}
                  <button
                    className="ml-1 rounded-full p-1 hover:bg-destructive/20"
                    onClick={() => handleRemoveTag(tag)}
                    type="button"
                  >
                    <XMarkIcon className="size-3" />
                  </button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <Text className="text-muted-foreground">No tags added yet</Text>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Input
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag"
                value={newTag}
              />
              <Button onClick={handleAddTag} plain>
                <PlusIcon className="size-4" />
              </Button>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button onClick={() => setIsTagDialogOpen(false)} outline>
            Cancel
          </Button>
          <Button onClick={handleSaveTags}>Save Tags</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function ConnectionsList() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [data, setData] = useState<
    {
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
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/v1/connections");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }

      setData(data.data);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to fetch data on every render
  useEffect(() => {
    fetchData();
  }, []);

  const handleDisconnect = useCallback(
    async (id: string) => {
      async function disconnect() {
        await fetch(`/v1/connections?id=${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      toast.promise(disconnect(), {
        loading: "Disconnecting from connection...",
        success: "Disconnected from connection",
        error: "Failed to disconnect from connection",
      });

      // Refresh the data after disconnecting
      await fetchData();
    },
    [fetchData]
  );

  const handleTagsUpdate = useCallback(
    async (connectionId: string, updatedTags: string[]) => {
      // Update the local data without refetching
      setData((prevData) =>
        prevData.map((connection) =>
          connection.id === connectionId
            ? { ...connection, tags: updatedTags }
            : connection
        )
      );
    },
    []
  );

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Platform</TableHeader>
            <TableHeader>Account</TableHeader>
            <TableHeader>Tags</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader>Expiry</TableHeader>
            <TableHeader>
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((connection) => {
            const Logo =
              platformDetails[
                connection.platform as keyof typeof platformDetails
              ]?.logo ?? null;

            return (
              <TableRow key={connection.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    {Logo && <Logo className="size-6" />}
                    {platformDetails[
                      connection.platform as keyof typeof platformDetails
                    ]?.name ?? connection.platform}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      className="size-6"
                      initials={
                        connection.account?.avatar
                          ? undefined
                          : (connection.account?.username ?? "?").slice(0, 1)
                      }
                      square
                      src={connection.account?.avatar}
                    />
                    <Text>{connection.account?.username ?? "no username"}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {connection.tags.length > 0 ? (
                      connection.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))
                    ) : (
                      <Text className="text-muted-foreground">No tags</Text>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Text>
                    {new Date(connection.created_at).toLocaleString()}
                  </Text>
                </TableCell>
                <TableCell>
                  <Text>{new Date(connection.expiry).toLocaleString()}</Text>
                </TableCell>
                <TableCell className="text-right">
                  <ConnectionDropdown
                    connection={connection}
                    disconnect={() => handleDisconnect(connection.id)}
                    onTagsUpdate={(updatedTags) =>
                      handleTagsUpdate(connection.id, updatedTags)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
          {data.length === 0 && status === "success" && (
            <TableRow>
              <TableCell colSpan={6}>
                <Text>No connections found</Text>
              </TableCell>
            </TableRow>
          )}
          {status === "loading" && (
            <TableRow>
              <TableCell colSpan={6}>
                <Text>Loading...</Text>
              </TableCell>
            </TableRow>
          )}
          {status === "error" && (
            <TableRow>
              <TableCell colSpan={6}>
                <Text>Error loading connections</Text>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
