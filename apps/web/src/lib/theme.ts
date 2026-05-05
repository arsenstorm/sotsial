import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type Theme = "light" | "dark";

const COOKIE_NAME = "theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

export const getThemeServerFn = createServerFn().handler(() => {
  const raw = getCookie(COOKIE_NAME);
  return (isTheme(raw) ? raw : "light") satisfies Theme;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
  .inputValidator((value: unknown): Theme => {
    if (!isTheme(value)) {
      throw new Error("Invalid theme");
    }
    return value;
  })
  .handler(({ data }: { data: Theme }) => {
    setCookie(COOKIE_NAME, data, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
  });
