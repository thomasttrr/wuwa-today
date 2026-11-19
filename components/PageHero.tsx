import type { ReactNode } from "react";

/**
 * Standard page header: kicker, display title, lede, and an optional meta row
 * (freshness stamp, page-level actions). One implementation for every section
 * page, see DESIGN.md. The homepage masthead and the character hero are
 * deliberately different.
 */
export default function PageHero({
  kicker,
  title,
  meta,
  children,
}: {
  kicker: ReactNode;
  title: string;
  /** Freshness stamp / page actions, shown under the lede. */
  meta?: ReactNode;
  /** The lede. */
  children?: ReactNode;
}) {
  return (
    <header className="rs-page-hero">
      <p className="rs-kicker">{kicker}</p>
      {/* Long titles step down a size so they stay at two lines. */}
      <h1 className={title.length > 22 ? "rs-page-title rs-page-title-long" : "rs-page-title"}>{title}</h1>
      {children && <p className="rs-page-lede">{children}</p>}
      {meta ? <div className="rs-page-meta">{meta}</div> : null}
    </header>
  );
}
