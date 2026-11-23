/**
 * The current URL hash as a decoded id, or "" when there is none.
 * A malformed escape (e.g. "#%E0%A4%A" from a mangled shared link) makes
 * decodeURIComponent throw; treat it as no hash instead of crashing the page.
 * Client-only: call from effects and event handlers, never during render.
 */
export function hashId(): string {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return "";
  }
}
