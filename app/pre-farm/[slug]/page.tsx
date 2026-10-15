import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaterialTable, {
  MaterialIcon,
  TierChips,
  parseTiers,
} from "@/components/MaterialTable";
import type { MaterialEntry } from "@/lib/character-schema";
import {
  getCharacter,
  type CharacterRecordLoose,
} from "@/lib/characters";
import {
  getPrefarmGuide,
  prefarmSlugs,
  type PrefarmGuide,
} from "@/lib/prefarm";
import { elementColor } from "@/lib/elements";

export const dynamicParams = false;

export function generateStaticParams() {
  return prefarmSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getPrefarmGuide(slug);
  if (!guide) return { title: "Pre-farm guide not found" };
  return {
    title: `${guide.character} Pre-Farm Guide — Materials & Farming Routes | WuWa Today`,
    description: guide.description,
  };
}

function Caveat({ children }: { children: ReactNode }) {
  return (
    <p className="og-caveat" role="note">
      {children}
    </p>
  );
}

function SectionHead({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <Reveal>
      <div>
        <h2 className="og-section-h">{title}</h2>
        {blurb && <p className="og-section-blurb">{blurb}</p>}
      </div>
    </Reveal>
  );
}

/** Merge ascension + forte quantities into one shopping list. Tier strings
 *  ("4 / 12 / 12 / 4") sum element-wise; single numbers (Shell Credits) sum
 *  numerically. */
function combinedTotals(
  materials: NonNullable<CharacterRecordLoose["materials"]>
): MaterialEntry[] {
  const tiers = new Map<string, { qty: number[]; farm: string }>();
  const add = (e: MaterialEntry) => {
    const q = e.qty
      .split("/")
      .map((t) => parseInt(t.replace(/,/g, "").trim(), 10))
      .filter((n) => !Number.isNaN(n));
    const cur = tiers.get(e.name);
    if (cur) {
      cur.qty = cur.qty.map((v, i) => v + (q[i] ?? 0));
    } else {
      tiers.set(e.name, { qty: q, farm: e.farm });
    }
  };
  materials.ascension.forEach(add);
  materials.forte.forEach(add);
  return [...tiers.entries()].map(([name, v]) => ({
    name,
    qty:
      v.qty.length > 1
        ? v.qty.join(" / ")
        : v.qty[0].toLocaleString("en-US"),
    farm: v.farm,
  }));
}

function ReadyList({
  title,
  names,
  materials,
}: {
  title: string;
  names: string[];
  materials: NonNullable<CharacterRecordLoose["materials"]>;
}) {
  const all = [...materials.ascension, ...materials.forte];
  const items = names
    .map((n) => all.find((e) => e.name === n))
    .filter((e): e is MaterialEntry => Boolean(e));
  return (
    <div className="og-notice" role="note">
      <p>
        <strong>{title}</strong>
      </p>
      <ul className="og-ready-list">
        {items.map((m) => {
          const t = parseTiers(m.name, m.qty);
          return (
            <li key={m.name}>
              <div className="og-ready-top">
                <MaterialIcon name={t ? t.base : m.name} />
                <span>{t ? t.base : m.name}</span>
                <span className="og-material-qty">×{t ? t.total : m.qty}</span>
              </div>
              {t && <TierChips tiers={t.tiers} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function PrefarmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide: PrefarmGuide | undefined = getPrefarmGuide(slug);
  const char = getCharacter(slug);
  if (!guide || !char?.materials) {
    return (
      <>
        <Link href="/characters" className="og-back">
          ← Characters
        </Link>
        <h1 className="og-display">Pre-farm guide not found</h1>
      </>
    );
  }

  const p = char.profile;
  const el = elementColor(p.element);
  const materials = char.materials;
  const totals = combinedTotals(materials);
  const kicker = `Pre-farm guide · ${p.element} · ${p.weapon_type} · ${"★".repeat(p.rarity)}`;

  return (
    <>
      <Link href="/characters" className="og-back">
        ← Characters
      </Link>

      {/* Hero */}
      <header className="og-char-hero" style={{ "--el": el } as CSSProperties}>
        <Reveal>
          <div className="og-char-art">
            <Image
              src={p.portrait_url}
              alt={`${char.name} portrait`}
              width={600}
              height={600}
              priority
              decoding="async"
            />
          </div>
        </Reveal>
        <div>
          <Reveal delay={60}>
            <p className="og-char-kicker">{kicker}</p>
            <h1 className="og-char-name og-display">
              {guide.character} pre-farm
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="og-char-badges">
              <span className="og-char-badge">{p.role}</span>
              <span className="og-char-badge">
                <span
                  className="element-dot"
                  style={{ background: el }}
                  aria-hidden="true"
                />{" "}
                {p.element}
              </span>
              {guide.prerelease && (
                <span className="og-char-badge og-char-badge-dim">
                  Pre-release
                </span>
              )}
            </div>
          </Reveal>
          <Reveal delay={180}>
            <p className="og-hero-note">{guide.banner}</p>
            <p className="og-hero-note og-muted">
              Published {guide.publishedAt} · every material verified against
              two or more independent sources.
            </p>
          </Reveal>
        </div>
      </header>

      {guide.prerelease && (
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Pre-release data.</strong> {guide.character} hasn&apos;t
              launched yet — quantities below were verified against multiple
              pre-release sources but may still change on patch day. This guide
              is updated if anything moves.
            </p>
          </div>
        </Reveal>
      )}

      {/* Start here: farm now vs wait */}
      <section className="og-section" aria-label="Where to start">
        <SectionHead
          title="Start here"
          blurb="What you can stockpile today, and what unlocks with the patch."
        />
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          <Reveal>
            <ReadyList
              title="Farm right now"
              names={guide.farmNow}
              materials={materials}
            />
          </Reveal>
          {guide.waitForLaunch.length > 0 && (
            <Reveal delay={80}>
              <ReadyList
                title="Wait for launch"
                names={guide.waitForLaunch}
                materials={materials}
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* Full checklist — the main shopping list */}
      <section className="og-section" aria-label="Full checklist">
        <SectionHead
          title="Full checklist"
          blurb="Ascension + forte combined — everything you need, with per-tier totals."
        />
        <Reveal>
          <MaterialTable entries={totals} />
        </Reveal>
        {materials.note && <Caveat>{materials.note}</Caveat>}
      </section>

      {/* Breakdown — per-phase detail, tucked into accordions */}
      <section className="og-section" aria-label="Material breakdown">
        <SectionHead
          title="Breakdown"
          blurb="Per-phase costs, if you want the detail."
        />
        <Reveal>
          <details className="og-breakdown">
            <summary>Ascension 0 → 90</summary>
            <MaterialTable entries={materials.ascension} />
          </details>
        </Reveal>
        <Reveal>
          <details className="og-breakdown">
            <summary>Forte — full tree</summary>
            <MaterialTable entries={materials.forte} />
          </details>
        </Reveal>
      </section>

      {/* Farming priorities */}
      <section className="og-section" aria-label="Farming priorities">
        <SectionHead
          title="Farming priorities"
          blurb="How to spend your Waveplates and time before the banner."
        />
        {guide.tips.map((tip, i) => (
          <Reveal key={tip.heading} delay={Math.min(i * 60, 240)}>
            <h3 className="og-sub-h">{tip.heading}</h3>
            <p className="og-section-blurb" style={{ maxWidth: "65ch" }}>
              {tip.body}
            </p>
          </Reveal>
        ))}
      </section>

      {/* Sources */}
      <section className="og-section" aria-label="Sources">
        <SectionHead title="Sources" blurb="Every number verified twice." />
        <Reveal>
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {guide.sources.map((s) => (
              <li key={s.url} style={{ margin: "0.35rem 0" }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="og-muted"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <p className="og-version-note">
        Data current as of game version {char.game_version}.
      </p>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <Link href={`/characters/${char.slug}`} className="og-chip">
          Full {char.name} build guide →
        </Link>
        <Link href="/pull-planner" className="og-chip">
          Still deciding? See the Pull Planner
        </Link>
      </div>
    </>
  );
}
