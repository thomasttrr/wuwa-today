import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide, guides, renderBody } from "../../../lib/guides";
import { banners } from "../../../lib/data";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.description,
  };
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  // Stage 3: small header thumb of the guide's subject character, resolved
  // data-driven from the guide's own bannerId + character fields. Only
  // renders when the banner data carries a verified sprite path.
  const banner = banners.find((b) => b.id === guide.bannerId);
  const subject = banner?.characters.find((c) => c.name === guide.character);
  const thumb = subject?.sprite;

  return (
    <article className="guide-body">
      <header className="guide-head">
        {thumb && (
          <img
            src={thumb}
            alt={`${guide.character} official character art`}
            className="guide-thumb"
            width={184}
            height={184}
          />
        )}
        <div className="guide-head-text">
          <span className="badge gold">{guide.verdictLabel}</span>
          <h1>{guide.title}</h1>
          <p className="updated">
            Published {guide.publishedAt} · {guide.authorNote}
          </p>
        </div>
      </header>

      <section className="card" aria-label="Verdict">
        <h2 className="verdict-title">Verdict</h2>
        <p className="verdict-text">{guide.verdict}</p>
      </section>

      {guide.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: renderBody(s.body) }} />
        </section>
      ))}

      <p className="guide-back">
        <Link href="/guides">← All pull guides</Link>
      </p>
    </article>
  );
}
