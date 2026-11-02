import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/shared/theme/theme";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const readTheme = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

/** The <html> class is the source of truth; localStorage only remembers the choice. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => "dark");

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode, sandboxed iframe): the theme still applies for this visit.
    }
    listeners.forEach((listener) => listener());
  }, []);

  return { theme, toggle };
}
