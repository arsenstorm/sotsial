"use client";

// Next
import { useTransitionRouter } from "next-view-transitions";
// React
import { useCallback, useState } from "react";
import { toast } from "sonner";
// UI
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Label } from "@/components/ui/fieldset";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";

export function KeyCreateDialog() {
  const router = useTransitionRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [key, setKey] = useState<string | null>(null);

  const openCreateKeyDialog = useCallback(() => setIsOpen(true), []);

  const closeCreateKeyDialog = useCallback(() => {
    setIsOpen(false);
    setName("");
    setKey(null);
    router.refresh();
  }, [router]);

  const setKeyName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    []
  );

  const createKey = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch("/v1/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      toast.error("Failed to create key.");
      setIsLoading(false);
      closeCreateKeyDialog();
      return;
    }

    const data = await response.json();

    if (!data?.key) {
      toast.error("Failed to create key.");
      setIsLoading(false);
      closeCreateKeyDialog();
      return;
    }

    setKey(data?.key);
    setIsLoading(false);

    toast.success("Key created successfully!");
  }, [name, closeCreateKeyDialog]);

  return (
    <div>
      <PageHeading description="Manage your API keys." title="API Keys">
        <Button color="dark/white" onClick={openCreateKeyDialog}>
          Create Key
        </Button>
      </PageHeading>
      <Dialog onClose={setIsOpen} open={isOpen}>
        {key ? (
          <>
            <DialogTitle>Your API Key</DialogTitle>
            <DialogDescription>
              Below is your new API Key. Keep it safe as you can only view it
              once.
            </DialogDescription>
            <DialogBody>
              <Field>
                <Label>Key</Label>
                <Input disabled name="key" readOnly value={key} />
              </Field>
            </DialogBody>
            <DialogActions>
              <Button color="dark/white" onClick={closeCreateKeyDialog}>
                I‘ve saved my key and I want to close this dialog.
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Create Key</DialogTitle>
            <DialogDescription>Create a new API key.</DialogDescription>
            <DialogBody>
              <Field>
                <Label>Name</Label>
                <Input
                  name="name"
                  onChange={setKeyName}
                  placeholder="My Key"
                  value={name}
                />
              </Field>
            </DialogBody>
            <DialogActions>
              <Button onClick={closeCreateKeyDialog} plain>
                Cancel
              </Button>
              <Button
                color="dark/white"
                disabled={!name.length || isLoading}
                onClick={createKey}
              >
                {isLoading ? "Creating..." : "Create Key"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
