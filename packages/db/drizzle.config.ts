import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path:
    process.env.NODE_ENV === "production"
      ? "../../.env.production"
      : "../../.env",
  override: true,
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run drizzle-kit");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/*.ts",
  out: "./migrations",
  dbCredentials: {
    url: databaseUrl,
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
