"use client";

import { useEffect } from "react";
import { useAuth } from "./provider";
import { useTransitionRouter } from "next-view-transitions";
import {
	AuthCheckpointRedirecting,
	AuthCheckpointLoading,
} from "@/components/auth/auth-checkpoint";

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
		if (status === "loading") return;

		if (status === "authenticated") {
			if (ifAuthenticated) router.push(ifAuthenticated);
		}

		if (status === "unauthenticated") {
			if (ifUnauthenticated) router.push(ifUnauthenticated);
		}
	}, [status, ifAuthenticated, ifUnauthenticated, router]);

	if (status === "loading") return <AuthCheckpointLoading />;

	if (status === "authenticated" && ifAuthenticated) {
		return <AuthCheckpointRedirecting />;
	}

	if (status === "unauthenticated" && ifUnauthenticated) {
		return <AuthCheckpointRedirecting />;
	}

	return children;
}
