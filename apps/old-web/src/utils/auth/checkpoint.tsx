"use client";

import { useTransitionRouter } from "next-view-transitions";
import { useEffect } from "react";
import {
  AuthCheckpointLoading,
  AuthCheckpointRedirecting,
} from "@/components/auth/auth-checkpoint";
import { useAuth } from "./provider";

export default function AuthCheckpoint({
  children,
  ifAuthenticated,
  ifUnauthenticated,
}: Readonly<{
  children: React.ReactNode;
  ifAuthenticated?: string;
  ifUnauthenticated?: string;
}>) {
  const router = useTransitionRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && ifAuthenticated) {
      router.push(ifAuthenticated);
    }

    if (status === "unauthenticated" && ifUnauthenticated) {
      router.push(ifUnauthenticated);
    }
  }, [status, ifAuthenticated, ifUnauthenticated, router]);

  if (status === "loading") {
    return <AuthCheckpointLoading />;
  }

  if (status === "authenticated" && ifAuthenticated) {
    return <AuthCheckpointRedirecting />;
  }

  if (status === "unauthenticated" && ifUnauthenticated) {
    return <AuthCheckpointRedirecting />;
  }

  return children;
}
