import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "sidebar_state";

export const getSidebarStateServerFn = createServerFn().handler(() => {
  // Default to open; only persist an explicit `"false"` value.
  // The Sidebar component writes this cookie itself on every toggle.
  return getCookie(COOKIE_NAME) !== "false";
});
