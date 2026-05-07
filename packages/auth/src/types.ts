import type { client } from "./client";

export type AuthContext = typeof client.$Infer.Session;
export type Session = AuthContext["session"];
export type User = AuthContext["user"];

export interface AuthEnv {
  APP_BASE_URL: string;
  AUTH_SECRET: string;
  DATABASE: Hyperdrive;
  ENVIRONMENT: "production" | "development";
  STRIPE_PRICE_ENTERPRISE?: string;
  STRIPE_PRICE_TEAM?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}
