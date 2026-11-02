import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { IconButton } from "@/shared/ui/IconButton";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <IconButton label={isDark ? "حالت روشن" : "حالت تاریک"} onClick={toggle}>
      {isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </IconButton>
  );
}
