import type { CSSProperties } from "react";
import Link from "next/link";
import selector from "../data/selector.json";
import { getCharacterByName } from "../lib/characters";
import { elementColor } from "../lib/elements";
import { formatServerDate } from "../lib/dates";
import { thumbFor } from "../lib/renders";
import { CharPoster } from "./CharThumb";

/*
 * The two Reverb selector convenes (data/selector.json; pool and mechanics
 * verified against Game8's dedicated banner pages + FandomWire, Nov 2026).
 * They run the whole version beside the featured banners, so they get their
 * own section on /banners: pool posters first, then the pick advice —
 * written as "if you own X, target Y", because every unit in the pool is a
 * partner or a carry, never a flat ranking. Tom's call, 2026-11-08.
 */

function PoolPoster({ name, label, sub }: { name: string; label: string; sub: string }) {
  const rec = getCharacterByName(name);
  const inner = (
    <>
      <CharPoster
        thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null}
        name={name}
        rarity={5}
        hideName
      />
      <span className="bn-sel-pool-name">{label}</span>
      <span className="bn-sel-pool-sub">{sub}</span>
    </>
  );
  const style = rec ? ({ "--c": elementColor(rec.profile.element) } as CSSProperties) : undefined;
  return rec ? (
    <Link href={`/characters/${rec.slug}`} className="bn-sel-pool-item" style={style}>
      {inner}
    </Link>
  ) : (
    <span className="bn-sel-pool-item" style={style}>
      {inner}
    </span>
  );
}

export default function SelectorConvenes() {
  const r = selector.resonator;
  const w = selector.weapon;
  const dates = `${formatServerDate(selector.startsAt)} → ${formatServerDate(selector.endsAt)} · server time (UTC+8)`;

  return (
    <section className="bn-section" aria-labelledby="bn-selector-h">
      <header className="bn-section-head">
        <h2 id="bn-selector-h">Selector convenes</h2>
        <p>
          Two special convenes run all of Version {selector.version} ({dates}). You choose
          the featured 5★ from a small pool — and you can change your pick at any time.
        </p>
      </header>

      <div className="bn-sel-grid">
        <article className="bn-sel-card rs-spot">
          <header className="bn-sel-head">
            <h3 className="bn-sel-name">{r.name}</h3>
            <span className="bn-sel-tag">Selector</span>
          </header>
          <p className="bn-sel-tagline">{r.tagline}</p>
          <div className="bn-sel-pool">
            {r.pool.map((p) => {
              const rec = getCharacterByName(p.name);
              return (
                <PoolPoster
                  key={p.name}
                  name={p.name}
                  label={p.name}
                  sub={rec ? `${rec.profile.element} · ${rec.profile.role}` : ""}
                />
              );
            })}
          </div>
          <p className="bn-sel-picks-h">Who to target</p>
          <ul className="bn-sel-picks">
            {r.pool.map((p) => (
              <li key={p.name}>
                <strong>
                  If {p.ifYouOwn} — {p.name}.
                </strong>{" "}
                {p.reason}
              </li>
            ))}
          </ul>
          <p className="bn-sel-note">{r.honest}</p>
          <p className="bn-sel-mech">{r.mechanics}</p>
        </article>

        <article className="bn-sel-card rs-spot">
          <header className="bn-sel-head">
            <h3 className="bn-sel-name">{w.name}</h3>
            <span className="bn-sel-tag">Selector</span>
          </header>
          <p className="bn-sel-tagline">{w.tagline}</p>
          <div className="bn-sel-pool">
            {w.pool.map((p) => (
              <PoolPoster key={p.weapon} name={p.for} label={p.weapon} sub={`for ${p.for}`} />
            ))}
          </div>
          <p className="bn-sel-picks-h">The rule</p>
          <p className="bn-sel-note">{w.honest}</p>
          <p className="bn-sel-mech">{w.mechanics}</p>
        </article>
      </div>
    </section>
  );
}
