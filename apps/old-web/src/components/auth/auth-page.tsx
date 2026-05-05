"use client";

import { Link } from "next-view-transitions";

// React
import { useCallback } from "react";

// UI
import { Button } from "@/components/ui/button";
// Better Auth
import { auth } from "@/utils/auth/client";

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
        <h1 className="text-balance font-medium text-4xl">
          Continue to Sotsial with <span className="font-bold">GitHub</span>
        </h1>

        <p className="text-balance text-black/70 text-lg">
          Cross-platform social media automation built for fast development.
        </p>
      </div>

      <hr className="my-6 border-black/10 border-dashed" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-balance font-medium text-2xl">
            Sign in to get started
          </h2>
          <p className="text-balance text-base text-black/70">
            We&apos;ll automatically create an account if you don&apos;t have
            one yet.
          </p>
        </div>

        <div className="mt-2 flex flex-row gap-4">
          <Button
            className="flex items-center"
            color="dark"
            onClick={signInWithGitHub}
            type="button"
          >
            Sign in with GitHub &rarr;
          </Button>
          <Link
            className="flex items-center text-black/70 text-sm hover:text-black"
            href="/"
          >
            Take me back
          </Link>
        </div>
      </div>
    </div>
  );
}
