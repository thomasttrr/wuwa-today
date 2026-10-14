import type { Metadata } from "next";
import { guides } from "../../lib/guides";

export const metadata: Metadata = {
  title: "Wuthering Waves Pull Guides — Is X Worth Pulling?",
  description:
    "Honest, no-hype pull guides for every Wuthering Waves banner: verdicts, who should pull, team notes, and the Astrite math.",
};

export default function GuidesPage() {
  return (
    <>
      <h1>Pull guides</h1>
      <p className="lede">
        One evergreen page per featured 5-star: a clear verdict, who should
        pull, and the honest math. Editorial opinion, clearly labeled — your
        account, your call.
      </p>
      <div className="grid grid-2 guides-grid">
        {guides.map((g) => (
          <article className="card" key={g.slug}>
            <span className="badge gold">{g.verdictLabel}</span>
            <h3 className="guide-card-title">
              <a href={`/guides/${g.slug}`}>{g.title}</a>
            </h3>
            <p className="code-meta">{g.description}</p>
            <p className="updated">Published {g.publishedAt}</p>
          </article>
        ))}
      </div>
    </>
  );
}
