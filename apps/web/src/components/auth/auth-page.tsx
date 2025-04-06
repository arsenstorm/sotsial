"use client";

// Better Auth
import { auth } from "@/utils/auth/client";

// React
import { useCallback } from "react";

// UI
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export function AuthPage() {
	const signInWithGitHub = useCallback(async () => {
		await auth.signIn.social({
			provider: "github",
			callbackURL: "/continue",
		});
	}, []);

	return (
		<div className="flex flex-col items-start justify-center min-h-screen max-w-2xl text-balance gap-y-4">
			<Heading className="text-7xl font-bold">
				Continue to Sotsial with{" "}
				<span className="underline underline-offset-4">GitHub</span>
			</Heading>
			<Text className="text-lg max-w-lg">
				Cross-platform social media automation built for fast development.
			</Text>
			<div className="flex flex-row gap-x-4">
				<Button onClick={signInWithGitHub} type="button" color="dark/white">
					Sign in with GitHub &rarr;
				</Button>
				<Button plain href="/">
					Take me back
				</Button>
			</div>
		</div>
	);
}
