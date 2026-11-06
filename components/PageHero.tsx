import type { ReactNode } from "react";

/**
 * Standard page header: kicker, display title, lede. One implementation for
 * every section page (Teams, Tier List, Pull Planner, Events…), see DESIGN.md.
 * The homepage masthead and the character hero are deliberately different.
 */
export default function PageHero({
  kicker,
  title,
  children,
}: {
  kicker: ReactNode;
  title: string;
  /** The lede. */
  children?: ReactNode;
}) {
  return (
    <header className="rs-page-hero">
      <p className="rs-kicker">{kicker}</p>
      <h1 className="rs-page-title">{title}</h1>
      {children && <p className="rs-page-lede">{children}</p>}
    </header>
  );
}
