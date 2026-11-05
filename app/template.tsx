import type { ReactNode } from "react";

/**
 * Route-change transition: App Router remounts the template on
 * every navigation, which replays the .page-in animation — a soft
 * fade + rise in the site's ease. Pure CSS, no JS, and the
 * reduced-motion block in style.css turns it off.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-in">{children}</div>;
}
