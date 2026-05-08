import { Button } from "@sotsial/ui/components/button";
import {
  IconMoonOutlineDuo18,
  IconSunOutlineDuo18,
} from "nucleo-ui-outline-duo-18";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? IconSunOutlineDuo18 : IconMoonOutlineDuo18;

  return (
    <Button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="size-8"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <Icon strokeWidth={2} />
    </Button>
  );
}
