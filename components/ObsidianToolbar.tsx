import type { ReactNode } from "react";

/**
 * ObsidianToolbar — floating GLASS toolbar (chrome, not content).
 * Quick anchor jumps within a data page. Every glass element carries the
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
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
