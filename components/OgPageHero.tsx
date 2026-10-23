import type { ReactNode } from "react";

/**
 * Canonical index-page hero (P-5): kicker + display title + lede, with an
 * optional meta-row slot so every hub answers
 * "is this fresh?".
 *
 * Direction A contained-panel rule: guide heroes are text-only and stay
 * inside the 1080px content measure (no viewport breakout, no art). The
 * homepage hero is the contained .og-hero panel; detail pages keep
 * og-char-hero (250px portrait box).
 */
export default function OgPageHero({
  kicker,
  title,
  lede,
  meta,
}: {
  kicker: ReactNode;
  title: string;
  lede: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="og-page-hero">
      <p className="og-page-kicker">{kicker}</p>
      <h1 className="og-page-title og-display">{title}</h1>
      <p className="og-page-lede">{lede}</p>
      {meta ? <div className="og-meta-row">{meta}</div> : null}
    </header>
  );
}
