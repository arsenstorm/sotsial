import type { client } from "./client";

export type AuthContext = typeof client.$Infer.Session;
export type Session = AuthContext["session"];
export type User = AuthContext["user"];

export interface AuthEnv {
  APP_BASE_URL: string;
  AUTH_SECRET: string;
  AUTH_URL: string;
  DATABASE: Hyperdrive;
  ENVIRONMENT: "production" | "development";
}
