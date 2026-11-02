export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint. The server renders `class="dark"` (dark is the
 * default), so the only job here is switching to light when the user chose it.
 */
export const themeInitScript = `try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="light")document.documentElement.classList.remove("dark")}catch(e){}`;
