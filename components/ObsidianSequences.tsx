import type { CharacterSequences } from "@/lib/character-schema";

/**
 * Resonance Chain section — "aim-order rail" (Option A).
 *
 * Shows the pull_path stop points as an ordered rail of solid cards:
 * which sequence to aim for first, then next. The single best-value stop
 * carries the gold dot + the shared border-beam treatment (see og-pages.css).
 * All six nodes sit behind a collapsed "All six nodes" list with per-node
 * priority chips. Dark-only, solid surfaces, reduced-motion safe.
 */

const PRIORITY_LABEL: Record<string, string> = {
  key: "Key",
  value: "Value",
  comfort: "Comfort",
  skip: "Skip",
  whale: "Whale",
};

export default function ObsidianSequences({
  sequences,
}: {
  sequences: CharacterSequences;
}) {
  const bestIdx = sequences.pull_path.findIndex(
    (s) => s.tag === "Best value stop",
  );
  const underReview = sequences.status !== "verified";

  return (
    <div>
      <ol className="og-seq-rail" aria-label="Sequence aim order">
        {sequences.pull_path.map((stop, i) => (
          <li
            key={stop.stop}
            className={
              i === bestIdx ? "og-seq-stop og-seq-best" : "og-seq-stop"
            }
          >
            {i === bestIdx && (
              <span className="og-seq-golddot" aria-hidden="true" />
            )}
            <span className="og-seq-stopnum">{stop.stop}</span>
            <span className="og-seq-tag">{stop.tag}</span>
            <p className="og-seq-why">{stop.why}</p>
          </li>
        ))}
      </ol>

      <details className="og-showmore og-seq-all">
        <summary>All six nodes</summary>
        <ol className="og-seq-nodes">
          {sequences.nodes.map((node) => (
            <li key={node.n} className="og-seq-node">
              <span className="og-seq-n">S{node.n}</span>
              <div className="og-seq-node-main">
                <p className="og-seq-name">{node.name}</p>
                <p className="og-seq-effect">{node.effect}</p>
              </div>
              <span className={`og-prio og-prio-${node.priority}`}>
                {PRIORITY_LABEL[node.priority] ?? node.priority}
              </span>
            </li>
          ))}
        </ol>
      </details>

      <p className="og-seq-weapon">{sequences.weapon_vs_dupes}</p>
      {sequences.sources?.length > 0 && (
        <p className="og-seq-provenance">
          Sequence data via {sequences.sources.join(" + ")}.
        </p>
      )}
      {underReview && (
        <p className="og-caveat" role="note">
          Sequence data is still under review — priorities may change as more
          sources confirm them.
        </p>
      )}
    </div>
  );
}
