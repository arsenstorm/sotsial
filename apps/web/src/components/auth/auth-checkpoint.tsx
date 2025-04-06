import { Heading } from "@/components/ui/heading";
import { Loader2 } from "lucide-react";
import { Text } from "@/components/ui/text";

export function AuthCheckpointLoading() {
	return (
		<main className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black">
			<div className="max-w-lg mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full">
				<Heading>Security Checkpoint</Heading>
				<Text>
					We’re ensuring that you are permitted to access this resource.
				</Text>
				<div className="flex items-center justify-center w-full h-28">
					<Loader2 className="size-12 animate-spin text-black dark:text-white" />
				</div>
			</div>
			<footer className="absolute bottom-0 w-full h-16 flex items-center justify-center">
				<Text>Please wait while we authorise your request.</Text>
			</footer>
		</main>
	);
}

export function AuthCheckpointRedirecting() {
	return (
		<main className="flex flex-col items-center justify-center h-screen bg-white dark:bg-black">
			<div className="max-w-lg mx-auto border border-zinc-950/10 dark:border-white/10 px-4 py-6 rounded-lg w-full">
				<Heading>Security Checkpoint Redirect</Heading>
				<Text>Please wait while we redirect you to the next step.</Text>
			</div>
			<footer className="absolute bottom-0 w-full h-16 flex items-center justify-center">
				<Text>
					To prevent unauthorised access, we need to authenticate you.
				</Text>
			</footer>
		</main>
	);
}
