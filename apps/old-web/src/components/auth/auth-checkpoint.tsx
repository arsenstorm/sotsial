import { Loader2 } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function AuthCheckpointLoading() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-lg rounded-lg border border-zinc-950/10 px-4 py-6 dark:border-white/10">
        <Heading>Security Checkpoint</Heading>
        <Text>
          We’re ensuring that you are permitted to access this resource.
        </Text>
        <div className="flex h-28 w-full items-center justify-center">
          <Loader2 className="size-12 animate-spin text-black dark:text-white" />
        </div>
      </div>
      <footer className="absolute bottom-0 flex h-16 w-full items-center justify-center">
        <Text>Please wait while we authorise your request.</Text>
      </footer>
    </main>
  );
}

export function AuthCheckpointRedirecting() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto w-full max-w-lg rounded-lg border border-zinc-950/10 px-4 py-6 dark:border-white/10">
        <Heading>Security Checkpoint Redirect</Heading>
        <Text>Please wait while we redirect you to the next step.</Text>
      </div>
      <footer className="absolute bottom-0 flex h-16 w-full items-center justify-center">
        <Text>
          To prevent unauthorised access, we need to authenticate you.
        </Text>
      </footer>
    </main>
  );
}
