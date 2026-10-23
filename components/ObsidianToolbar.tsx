import type { ReactNode } from "react";

/**
 * ObsidianToolbar — in-flow glass toolbar (chrome, not content).
 * Quick anchor jumps within a data page. The visible `label` ("On this
 * page", "Banner sections", ...) makes it unmistakably in-page so it is
 * never confused with the main page nav. Every glass element carries the
 * specular top-edge glint via .og-toolbar::before, and it degrades to
 * solid #101014 under prefers-reduced-transparency.
 */
export default function ObsidianToolbar({
  items,
  label,
}: {
  items: { href: string; label: ReactNode }[];
  label: string;
}) {
  return (
    <nav className="og-toolbar" aria-label={label}>
      {/* aria-hidden: the nav's aria-label already announces it. */}
      <span className="og-toolbar-label" aria-hidden="true">
        {label}
      </span>
      <div className="og-toolbar-links">
        {items.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
