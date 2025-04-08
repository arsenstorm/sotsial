"use client";

// Better Auth
import { auth } from "@/utils/auth/client";

// React
import { useCallback } from "react";

// UI
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";

export function AuthPage() {
	const signInWithGitHub = useCallback(async () => {
		await auth.signIn.social({
			provider: "github",
			callbackURL: "/continue",
		});
	}, []);

	return (
		<div className="flex flex-col bg-white text-black">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-medium text-balance">
					Continue to Sotsial with <span className="font-bold">GitHub</span>
				</h1>

				<p className="text-lg text-balance text-black/70">
					Cross-platform social media automation built for fast development.
				</p>
			</div>

			<hr className="my-6 border-dashed border-black/10" />

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-medium text-balance">
						Sign in to get started
					</h2>
					<p className="text-base text-balance text-black/70">
						We&apos;ll automatically create an account if you don&apos;t have
						one yet.
					</p>
				</div>

				<div className="flex flex-row gap-4 mt-2">
					<Button
						onClick={signInWithGitHub}
						type="button"
						color="dark"
						className="flex items-center"
					>
						Sign in with GitHub &rarr;
					</Button>
					<Link
						href="/"
						className="text-sm text-black/70 hover:text-black flex items-center"
					>
						Take me back
					</Link>
				</div>
			</div>
		</div>
	);
}
