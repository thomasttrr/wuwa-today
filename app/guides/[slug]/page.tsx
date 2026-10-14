import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuide, guides, renderBody } from "../../../lib/guides";

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

  return (
    <article className="guide-body">
      <span className="badge gold">{guide.verdictLabel}</span>
      <h1>{guide.title}</h1>
      <p className="updated">
        Published {guide.publishedAt} · {guide.authorNote}
      </p>

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
        <a href="/guides">← All pull guides</a>
      </p>
    </article>
  );
}
