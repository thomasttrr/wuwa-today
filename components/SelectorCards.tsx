import type { CSSProperties } from "react";
import Link from "next/link";
import { selectors, formatServerDate, type SelectorConvene } from "../lib/data";
import { getCharacterByName } from "../lib/characters";
import { elementColor } from "../lib/elements";
import { thumbFor } from "../lib/renders";
import { CharPoster } from "./CharThumb";
import Reveal from "./Reveal";

/*
 * The Reverb selector convenes (data/banners.json → selectors). Kept out of
 * the banners array on purpose: they run the whole version and are not
 * phases. The resonator card answers "who do I pick" the roster-aware way —
 * one line per pool member, keyed to what the reader already owns. The
 * section hides itself once every selector has ended.
 */

function ResonatorCard({ s }: { s: SelectorConvene }) {
  return (
    <article className="bn-sel-card rs-spot">
      <header className="bn-sel-head">
        <p className="bn-card-kicker">
          <span className="bn-status bn-status-selector">Selector</span>
          {s.conveneLabel}
        </p>
        <h3 className="bn-sel-name">{s.name}</h3>
        <p className="bn-sel-dates">
          {formatServerDate(s.startsAt)} → {formatServerDate(s.endsAt)} · runs all of 3.8 · server time (UTC+8)
        </p>
      </header>
      <ul className="bn-sel-pool">
        {s.pool.map((p) => {
          const rec = getCharacterByName(p.name);
          const inner = (
            <>
              <CharPoster thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null} name={p.name} rarity={5} hideName />
              <span className="bn-sel-pool-name">{p.name}</span>
              {rec && <span className="bn-sel-pool-meta">{rec.profile.element} · {rec.profile.role}</span>}
            </>
          );
          return (
            <li key={p.name} style={rec ? ({ "--c": elementColor(rec.profile.element) } as CSSProperties) : undefined}>
              {rec ? <Link href={`/characters/${rec.slug}`}>{inner}</Link> : <span>{inner}</span>}
            </li>
          );
        })}
      </ul>
      <ul className="bn-sel-picks">
        {s.pool.map((p) => (
          <li key={p.name}>
            <strong>
              Pick {p.name} if {p.pickIf}:
            </strong>{" "}
            {p.reason}
          </li>
        ))}
      </ul>
      <p className="bn-sel-note">{s.note}</p>
    </article>
  );
}

/** Where the weapon sits in each official convene splash, so the tile
 *  crop frames the weapon itself rather than the title text. */
const SPLASH_POS: Record<string, string> = {
  "red-spring": "72% 50%",
  tragicomedy: "82% 50%",
  "luminous-hymn": "50% 50%",
  "unflickering-valor": "74% 50%",
};

function WeaponCard({ s }: { s: SelectorConvene }) {
  return (
    <article className="bn-sel-card rs-spot">
      <header className="bn-sel-head">
        <p className="bn-card-kicker">
          <span className="bn-status bn-status-selector">Selector</span>
          {s.conveneLabel}
        </p>
        <h3 className="bn-sel-name">{s.name}</h3>
        <p className="bn-sel-dates">
          {formatServerDate(s.startsAt)} → {formatServerDate(s.endsAt)} · runs all of 3.8 · server time (UTC+8)
        </p>
      </header>
      {s.rule && <p className="bn-sel-rule">{s.rule}</p>}
      <ul className="bn-sel-wtiles">
        {s.pool.map((p, i) => {
          const rec = p.forCharacter ? getCharacterByName(p.forCharacter) : undefined;
          const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const icon = `/images/weapons/${slug}-splash.jpg`;
          const pos = SPLASH_POS[slug] ?? "65% 50%";
          const inner = (
            <>
              <span className="bn-sel-wtile-art">
                {/* eslint-disable-next-line @next/next/no-img-element -- static export is unoptimized. */}
                <img
                  className="bn-sel-wtile-img"
                  src={icon}
                  alt={`${p.name} weapon artwork`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: pos, animationDelay: `${i * 0.9}s` }}
                />
              </span>
              <span className="bn-sel-wtile-body">
                <span className="bn-sel-weapon-name">{p.name}</span>
                {p.forCharacter && (
                  <span className="bn-sel-weapon-for">
                    {p.forCharacter}&apos;s signature{rec ? " →" : ""}
                  </span>
                )}
                {p.note && <span className="bn-sel-weapon-note">{p.note}</span>}
              </span>
            </>
          );
          return (
            <li
              key={p.name}
              className="bn-sel-wtile"
              style={rec ? ({ "--c": elementColor(rec.profile.element) } as CSSProperties) : undefined}
            >
              {rec ? (
                <Link href={`/characters/${rec.slug}`}>{inner}</Link>
              ) : (
                <span className="bn-sel-wtile-in">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="bn-sel-note">{s.note}</p>
    </article>
  );
}

export default function SelectorCards() {
  const now = Date.now();
  const live = selectors.filter((s) => Date.parse(s.endsAt) > now);
  if (!live.length) return null;
  return (
    <section className="bn-section" aria-labelledby="bn-sel-h">
      <header className="bn-section-head">
        <h2 id="bn-sel-h">Selector convenes — all of 3.8</h2>
        <p>
          Two Reverb convenes run the whole version. You choose the rate-up yourself, and you can
          change your mind at any time — here is who is worth choosing.
        </p>
      </header>
      <div className="bn-sel-grid">
        {live.map((s, i) => (
          <Reveal key={s.id} delay={i * 70}>
            {s.kind === "resonator" ? <ResonatorCard s={s} /> : <WeaponCard s={s} />}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
