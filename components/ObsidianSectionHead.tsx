import Link from "next/link";

/**
 * Canonical section head (P-6): flex-row head with hairline divider,
 * optional anchor id, blurb, and "view all" link. Every page uses this —
 * section heads must look identical everywhere.
 */
export default function ObsidianSectionHead({
  id,
  title,
  blurb,
  linkHref,
  linkText,
}: {
  id?: string;
  title: string;
  blurb?: string;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <div className="og-section-head" id={id}>
      <div>
        <h2 className="og-h2">{title}</h2>
        {blurb ? <p className="og-section-blurb">{blurb}</p> : null}
      </div>
      {linkHref && linkText ? (
        <Link className="og-section-link" href={linkHref}>
          {linkText} →
        </Link>
      ) : null}
    </div>
  );
}
