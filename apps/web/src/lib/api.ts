import type { AppType } from "api/types";
import { hc } from "hono/client";

// Same-origin: apps/web entrypoint forwards /v1/* to the api worker via service binding.
export const api = hc<AppType>("/");
