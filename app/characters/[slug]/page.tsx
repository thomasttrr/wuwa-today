import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ObsidianTeamCard from "@/components/ObsidianTeamCard";
import { MaterialRows } from "@/components/MaterialTable";
import type { MaterialEntry } from "@/lib/character-schema";
import {
  characterSlugs,
  getCharacter,
  isPreRelease,
  prevNextCharacter,
  type CharacterRecordLoose,
  type EchoSetLoose,
  type RankedWeapon,
} from "@/lib/characters";
import { elementColor } from "@/lib/elements";
import { getPrefarmGuide } from "@/lib/prefarm";

export const dynamicParams = false;

export function generateStaticParams() {
  return characterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const char = getCharacter(slug);
  if (!char) return { title: "Character not found" };
  const p = char.profile;
  return {
    title: `${char.name} Build Guide — Best Weapons, Echoes & Teams`,
    description:
      `${char.name} (${p.element} ${p.weapon_type}) build guide for version ${char.game_version}: ` +
      `${char.pull_verdict.verdict_label}. Ranked weapons, echo sets, stat priorities, and team comps.`,
    alternates: { canonical: `/characters/${slug}` },
  };
}

/** Small honest caveat for uncertain / pre-release sections. */
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

function MaterialsSection({
  materials,
}: {
  materials: NonNullable<CharacterRecordLoose["materials"]>;
}) {
  const groups: { title: string; entries: MaterialEntry[] }[] = [
    { title: "Ascension 0 → 90", entries: materials.ascension },
    { title: "Forte — full tree", entries: materials.forte },
  ];
  return (
    <div className="og-materials">
      {groups.map((g) => (
        <div key={g.title} className="og-materials-group">
          <h3>{g.title}</h3>
          <ol className="og-materials-list">
            <MaterialRows entries={g.entries} />
          </ol>
        </div>
      ))}
      {materials.note && <Caveat>{materials.note}</Caveat>}
    </div>
  );
}

function WeaponPlate({ weapon, bis }: { weapon: RankedWeapon; bis: boolean }) {
  return (
    <li className={bis ? "og-weapon og-weapon-bis" : "og-weapon"}>
      <span className="og-weapon-rank" aria-label={`Rank ${weapon.rank}`}>
        {String(weapon.rank).padStart(2, "0")}
      </span>
      {weapon.icon ? (
        <Image
          src={weapon.icon}
          alt={`${weapon.name} icon`}
          width={64}
          height={64}
          className="og-weapon-icon"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="og-weapon-icon" aria-hidden="true" />
      )}
      <div className="og-weapon-main">
        <div className="og-weapon-head">
          <span className="og-weapon-name">{weapon.name}</span>
          {bis && <span className="og-bis-pill">BiS</span>}
          {weapon.signature && <span className="og-sig">Signature</span>}
          <span className="og-stars" aria-label={`${weapon.rarity} star`}>
            {"★".repeat(weapon.rarity)}
          </span>
        </div>
        <p className="og-weapon-note">{weapon.note}</p>
      </div>
    </li>
  );
}

function EchoPlate({ set }: { set: EchoSetLoose }) {
  const bis = set.usage === "best-in-slot";
  return (
    <div className={bis ? "og-echo-plate og-echo-plate-bis" : "og-echo-plate"}>
      <div className="og-echo-head">
        <span className="og-echo-name">{set.name}</span>
        <span className="og-echo-cost">{set.pieces}</span>
      </div>
      <p className="og-echo-usage">
        <span className={bis ? "og-usage-pill og-usage-bis" : "og-usage-pill og-usage-alt"}>
          {set.usage}
        </span>
      </p>
      {set.main_echo ? (
        <p>
          <strong>Main Echo:</strong> {set.main_echo}
        </p>
      ) : null}
      <p>{set.note}</p>
    </div>
  );
}

/** Honest ordinal ranks — fixed widths, never fake percentages. */
const BAR_WIDTHS = [100, 82, 64, 46, 28];

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const char = getCharacter(slug);
  if (!char) {
    return (
      <>
        <Link href="/characters" className="og-back">
          ← Characters
        </Link>
        <h1 className="og-display">Character not found</h1>
      </>
    );
  }

  const p = char.profile;
  const build = char.build;
  const el = elementColor(p.element);
  const preRelease = isPreRelease(char);
  const tier = char.tier_badge;
  const showTierBadge = tier !== null && tier.tier !== "UNKNOWN";
  const { prev, next } = prevNextCharacter(slug);

  const kicker = `${p.element} · ${p.weapon_type} · ${"★".repeat(p.rarity)}`;

  const visibleWeapons = build.ranked_weapons.slice(0, 4);
  const extraWeapons = build.ranked_weapons.slice(4);

  return (
    <>
      <Link href="/characters" className="og-back">
        ← Characters
      </Link>

      {/* Hero: portrait plate, kicker/title, badges, verdict. */}
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
            <h1 className="og-char-name og-display">{char.name}</h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="og-char-badges">
              {showTierBadge ? (
                <span className={`og-tier-badge tier-${tier.tier}`}>
                  {tier.tier}
                </span>
              ) : (
                <span className="og-char-badge og-char-badge-dim">Pre-release · Not ranked</span>
              )}
              {showTierBadge && <span className="og-char-badge">{tier.label}</span>}
              <span className="og-char-badge">{p.role}</span>
              <span className="og-char-badge">
                <span className="element-dot" style={{ background: el }} aria-hidden="true" />{" "}
                {p.element}
              </span>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <p className="og-hero-verdict">{char.pull_verdict.verdict_label}</p>
            {p.role_note && <p className="og-hero-note">{p.role_note}</p>}
            {tier?.uncertain_or_prerelease && !preRelease && (
              <Caveat>Tier sources disagree — treat this placement as approximate.</Caveat>
            )}
          </Reveal>
        </div>
      </header>

      {preRelease && (
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Pre-release data.</strong> {char.name} hasn&apos;t launched
              yet — anything below is based on pre-release information and may
              change at launch.
            </p>
          </div>
        </Reveal>
      )}

      {/* Build */}
      <section className="og-section" aria-label="Build">
        <SectionHead title="Build" blurb={build.fast_path} />
        <div>
          {build.uncertain_or_prerelease && !preRelease && (
            <Caveat>Some build details are uncertain — check the source guides.</Caveat>
          )}

          <Reveal>
            <h3 className="og-sub-h">Weapons</h3>
            <ol className="og-weapons">
              {visibleWeapons.map((w) => (
                <WeaponPlate key={w.rank} weapon={w} bis={w.rank === 1} />
              ))}
            </ol>
            {extraWeapons.length > 0 && (
              <details className="og-showmore">
                <summary>Show all {build.ranked_weapons.length} ranked weapons</summary>
                <ol className="og-weapons">
                  {extraWeapons.map((w) => (
                    <WeaponPlate key={w.rank} weapon={w} bis={false} />
                  ))}
                </ol>
              </details>
            )}
          </Reveal>

          <Reveal>
            <h3 className="og-sub-h">Echo sets</h3>
            <p className="og-mono-line">Cost layout: {build.cost_layout}</p>
            <div className="og-echo-plates">
              {build.echo_sets.map((s) => (
                <EchoPlate key={s.name} set={s} />
              ))}
            </div>
          </Reveal>

          <Reveal>
            <h3 className="og-sub-h">Stat priorities</h3>
            <div className="og-stat-panel">
              <ul className="og-stat-bars">
                {build.stat_priorities.map((sp, i) => (
                  <li key={sp.piece}>
                    <div className="og-stat-head">
                      <span className="og-stat-label">
                        <strong>{sp.piece}</strong> · {sp.main_stat}
                      </span>
                      <span className="og-stat-rank">Priority {i + 1}</span>
                    </div>
                    <div className="og-stat-track" aria-hidden="true">
                      <div
                        className="og-stat-fill"
                        style={{ "--w": `${BAR_WIDTHS[i] ?? 28}%` } as CSSProperties}
                      />
                    </div>
                    {(sp.alternates?.length || sp.note) && (
                      <p className="og-stat-note">
                        {sp.alternates?.length ? (
                          <>
                            Also: <span className="og-stat-alt">{sp.alternates.join(" / ")}</span>
                            {sp.note ? " — " : ""}
                          </>
                        ) : null}
                        {sp.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <h3 className="og-sub-h">Substats</h3>
            <ol className="og-substats">
              {build.substat_priority.map((s, i) => (
                <li key={s} className="og-substat">
                  <span className="og-sub-rank">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="og-er">
              Energy Regen target: <strong>{build.energy_regen_target}</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pre-farm materials */}
      {char.materials && (
        <section className="og-section" aria-label="Pre-farm materials">
          <SectionHead
            title="Pre-farm materials"
            blurb="Ascension + forte costs with farm locations."
          />
          <Reveal>
            <MaterialsSection materials={char.materials} />
            {getPrefarmGuide(slug) && (
              <p style={{ marginTop: "1rem" }}>
                <Link href={`/pre-farm/${slug}`} className="og-chip">
                  Full pre-farm guide with farming priorities →
                </Link>
              </p>
            )}
          </Reveal>
        </section>
      )}

      {/* Teams */}
      <section className="og-section" aria-label="Teams">
        <SectionHead title="Teams" blurb="Tested comps with rotations." />
        {char.teams.map((team) => (
          <Reveal key={team.name}>
            <ObsidianTeamCard team={team} />
          </Reveal>
        ))}
        <div>
          {char.teams_meta.note && <Caveat>{char.teams_meta.note}</Caveat>}
          {char.teams_meta.uncertain_or_prerelease && !preRelease && !char.teams_meta.note && (
            <Caveat>Team data is provisional — sources differ on the best comps.</Caveat>
          )}
          {preRelease && (
            <Caveat>Team comps are pre-release theorycraft — unconfirmed until launch.</Caveat>
          )}
        </div>
      </section>

      {/* Pull verdict */}
      <section className="og-section" aria-label="Pull verdict">
        <SectionHead title="Pull verdict" />
        <Reveal>
          <div className="og-verdict-card">
            <p className="og-verdict-kicker">Pull verdict</p>
            <span className="og-verdict-label">{char.pull_verdict.verdict_label}</span>
            <p className="og-verdict-text">{char.pull_verdict.verdict}</p>
            <p className="og-verdict-meta">
              Banner {char.pull_verdict.banner_id} · Published {char.pull_verdict.published_at}
            </p>
            {char.pull_verdict.uncertain_or_prerelease && !preRelease && (
              <Caveat>This verdict is based on uncertain or incomplete data.</Caveat>
            )}
          </div>
        </Reveal>
      </section>

      <p className="og-version-note">
        Data current as of game version {char.game_version}.
      </p>

      {/* Prev / next */}
      <nav className="og-prevnext" aria-label="More characters">
        {prev ? (
          <Link href={`/characters/${prev.slug}`}>
            <span className="og-pn-dir" aria-hidden="true">‹</span>
            <Image
              src={prev.profile.portrait_url}
              alt={`${prev.name} portrait`}
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
            />
            <span className="og-pn-text">
              <span className="og-pn-label">Previous</span>
              <span className="og-pn-name">{prev.name}</span>
            </span>
          </Link>
        ) : (
          <span className="og-pn-spacer" aria-hidden="true" />
        )}
        {next ? (
          <Link href={`/characters/${next.slug}`} className="og-pn-next">
            <span className="og-pn-text">
              <span className="og-pn-label">Next</span>
              <span className="og-pn-name">{next.name}</span>
            </span>
            <Image
              src={next.profile.portrait_url}
              alt={`${next.name} portrait`}
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
            />
            <span className="og-pn-dir" aria-hidden="true">›</span>
          </Link>
        ) : (
          <span className="og-pn-spacer" aria-hidden="true" />
        )}
      </nav>
    </>
  );
}
