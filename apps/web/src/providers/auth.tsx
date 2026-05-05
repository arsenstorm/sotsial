"use client";

import { client } from "@sotsial/auth/client";
import { createContext, useContext } from "react";

type AuthSession = typeof client.$Infer.Session;
type SessionState = ReturnType<typeof client.useSession>;

interface AuthContextValue {
  authClient: typeof client;
  data: AuthSession | null;
  error: SessionState["error"];
  isAuthenticated: boolean;
  isPending: boolean;
  isRefetching: boolean;
  refetch: SessionState["refetch"];
  session: AuthSession["session"] | null;
  user: AuthSession["user"] | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const { data, error, isPending, isRefetching, refetch } = client.useSession();

  return (
    <AuthContext.Provider
      value={{
        authClient: client,
        data: data ?? null,
        error,
        isAuthenticated: Boolean(data?.session && data?.user),
        isPending,
        isRefetching,
        refetch,
        session: data?.session ?? null,
        user: data?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
