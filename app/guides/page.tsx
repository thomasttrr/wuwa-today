import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import { guides } from "../../lib/guides";

export const metadata: Metadata = {
  title: "Wuthering Waves Guides — Pull Guides, Builds & Teams",
  description:
    "Honest, no-hype Wuthering Waves guides: pull verdicts for every banner, character builds, and team compositions.",
};

export default function GuidesPage() {
  return (
    <>
      <h1>Guides</h1>
      <p className="lede">
        Pull verdicts for every featured 5-star, plus build guides and team
        compositions — verdict first, no hype.
      </p>
      <div className="grid grid-2 guides-grid">
        {guides.map((g, i) => (
          <Reveal key={g.slug} delay={i * 70}>
            <article className="card">
              <span className="badge gold">{g.verdictLabel}</span>
              <h3 className="guide-card-title">
                <Link href={`/guides/${g.slug}`}>{g.title}</Link>
              </h3>
              <p className="code-meta">{g.description}</p>
              <p className="updated">Published {g.publishedAt}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </>
  );
}
