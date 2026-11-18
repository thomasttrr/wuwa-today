/**
 * Appearance mode: "resonance" (default: character pages take their element
 * colour) or "dark" (shown as "Gold only": element tinting off). The stored
 * value stays "dark" so choices saved before the Aftermath redesign still work. Stored per device; applied to
 * <html data-theme> by an inline head script before first paint, so there
 * is no flash of the wrong theme.
 */
export type ThemeMode = "resonance" | "dark";
export const THEME_KEY = "wuwa-today:theme";
export const THEME_EVENT = "wuwa-today:theme";

export const themeBootScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export function getThemeMode(): ThemeMode {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "resonance";
}

export function setThemeMode(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.dataset.theme = "dark";
  else delete root.dataset.theme;
  try {
    if (mode === "dark") localStorage.setItem(THEME_KEY, "dark");
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // storage unavailable: the choice lasts for this visit only
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: mode }));
}
