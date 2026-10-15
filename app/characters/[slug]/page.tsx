import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TeamCard from "@/components/TeamCard";
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
  };
}

const TIER_BADGE_CLASS: Record<string, string> = {
  SS: "tier-badge tier-ss",
  S: "tier-badge tier-s",
  A: "tier-badge tier-a",
  B: "tier-badge tier-b",
};

/** Small honest caveat for uncertain / pre-release sections. */
function Caveat({ children }: { children: ReactNode }) {
  return (
    <p className="char-caveat" role="note">
      {children}
    </p>
  );
}

function SectionHead({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <Reveal>
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {blurb && <p className="section-blurb">{blurb}</p>}
        </div>
      </div>
    </Reveal>
  );
}

function MaterialsSection({
  materials,
}: {
  materials: NonNullable<CharacterRecordLoose["materials"]>;
}) {
  const groups: { title: string; entries: { name: string; qty: string; farm: string }[] }[] = [
    { title: "Ascension 0 → 90", entries: materials.ascension },
    { title: "Forte — full tree", entries: materials.forte },
  ];
  return (
    <div className="char-materials">
      {groups.map((g) => (
        <div key={g.title} className="char-materials-group">
          <h3>{g.title}</h3>
          <ol className="char-materials-list">
            {g.entries.map((m) => (
              <li key={m.name} className="char-material">
                <span className="char-material-name">{m.name}</span>
                <span className="char-material-qty">×{m.qty}</span>
                {m.farm !== "—" && <span className="char-material-farm">{m.farm}</span>}
              </li>
            ))}
          </ol>
        </div>
      ))}
      {materials.note && <Caveat>{materials.note}</Caveat>}
    </div>
  );
}

function WeaponPlate({ weapon, bis }: { weapon: RankedWeapon; bis: boolean }) {
  return (
    <li className={bis ? "char-weapon char-weapon-bis" : "char-weapon"}>
      <span className="char-weapon-head">
        {weapon.icon && (
          <Image
            src={weapon.icon}
            alt={`${weapon.name} icon`}
            width={44}
            height={44}
            className="char-weapon-icon"
            loading="lazy"
          />
        )}
        <span className="char-weapon-name">
          {weapon.name}
          {weapon.signature && <span className="char-sig">Signature</span>}
        </span>
        <span className="stars" aria-label={`${weapon.rarity} star`}>
          {"★".repeat(weapon.rarity)}
        </span>
      </span>
      <p className="char-weapon-note">{weapon.note}</p>
    </li>
  );
}

function EchoPlate({ set }: { set: EchoSetLoose }) {
  const bis = set.usage === "best-in-slot";
  return (
    <div className={bis ? "echo-plate echo-plate-bis" : "echo-plate"}>
      <div className="echo-plate-head">
        <span className="echo-plate-name">{set.name}</span>
        <span className="echo-plate-cost">{set.pieces}</span>
      </div>
      <p className="echo-usage">
        <span className={bis ? "badge gold" : "badge dim"}>{set.usage}</span>
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
        <Link href="/characters" className="char-back">
          ← Characters
        </Link>
        <h1>Character not found</h1>
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

  const heroStyle = { "--el": el } as CSSProperties;
  const kicker = `${p.element} · ${p.weapon_type} · ${"★".repeat(p.rarity)}`.toUpperCase();

  const visibleWeapons = build.ranked_weapons.slice(0, 4);
  const extraWeapons = build.ranked_weapons.slice(4);

  return (
    <>
      <Link href="/characters" className="char-back">
        ← Characters
      </Link>

      {/* Hero: 4-step cascade (portrait → kicker/title → badges → verdict). */}
      <header className="char-hero" style={heroStyle}>
        <Reveal>
          <div className="char-hero-art">
            <Image
              src={p.portrait_url}
              alt={`${char.name} portrait`}
              width={352}
              height={352}
              priority
              decoding="async"
            />
          </div>
        </Reveal>
        <div>
          <Reveal delay={60}>
            <p className="char-kicker">{kicker}</p>
            <h1>{char.name}</h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="char-badges">
              {showTierBadge ? (
                <span className={TIER_BADGE_CLASS[tier.tier] ?? "tier-badge"}>
                  {tier.tier}
                </span>
              ) : (
                <span className="badge dim">Pre-release · Not ranked</span>
              )}
              {showTierBadge && <span className="badge">{tier.label}</span>}
              <span className="badge">{p.role}</span>
              <span className="badge">
                <span className="element-dot" style={{ background: el }} aria-hidden="true" />{" "}
                {p.element}
              </span>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <p className="char-verdict-line">{char.pull_verdict.verdict_label}</p>
            {p.role_note && <p className="char-verdict-line updated">{p.role_note}</p>}
            {tier?.uncertain_or_prerelease && !preRelease && (
              <Caveat>Tier sources disagree — treat this placement as approximate.</Caveat>
            )}
          </Reveal>
        </div>
      </header>

      {preRelease && (
        <Reveal>
          <div className="char-prerelease" role="note">
            <p>
              <strong>Pre-release data.</strong> {char.name} hasn&apos;t launched
              yet (Phase 2) — builds, teams, and verdicts below are theorycraft
              and may change at launch.
            </p>
          </div>
        </Reveal>
      )}

      {/* Build */}
      <SectionHead
        title="Build"
        blurb={build.fast_path}
      />
      <div className="char-build">
        {build.uncertain_or_prerelease && !preRelease && (
          <Caveat>Some build details are uncertain — check the source guides.</Caveat>
        )}

        <Reveal>
          <h3>Weapons</h3>
          <ol className="char-weapons">
            {visibleWeapons.map((w) => (
              <WeaponPlate key={w.rank} weapon={w} bis={w.rank === 1} />
            ))}
          </ol>
          {extraWeapons.length > 0 && (
            <details className="char-showmore">
              <summary>Show all {build.ranked_weapons.length} ranked weapons</summary>
              <ol className="char-weapons">
                {extraWeapons.map((w) => (
                  <WeaponPlate key={w.rank} weapon={w} bis={false} />
                ))}
              </ol>
            </details>
          )}
        </Reveal>

        <Reveal>
          <h3>Echo sets</h3>
          <p className="updated mono">Cost layout: {build.cost_layout}</p>
          <div
            className={
              build.echo_sets.length > 1 ? "echo-plates echo-plates-2" : "echo-plates"
            }
          >
            {build.echo_sets.map((s) => (
              <EchoPlate key={s.name} set={s} />
            ))}
          </div>
        </Reveal>

        <Reveal>
          <h3>Stat priorities</h3>
          <ul className="stat-bars">
            {build.stat_priorities.map((sp, i) => (
              <li key={sp.piece}>
                <div className="stat-bar-head">
                  <span className="stat-bar-label">
                    <span className="stat-piece">{sp.piece}</span> · {sp.main_stat}
                  </span>
                  <span className="stat-bar-rank">Priority {i + 1}</span>
                </div>
                <div className="stat-track" aria-hidden="true">
                  <div
                    className="stat-fill"
                    style={{ "--w": `${BAR_WIDTHS[i] ?? 28}%` } as CSSProperties}
                  />
                </div>
                {(sp.alternates?.length || sp.note) && (
                  <p className="stat-bar-note">
                    {sp.alternates?.length ? (
                      <>
                        Also: <span className="stat-alt">{sp.alternates.join(" / ")}</span>
                        {sp.note ? " — " : ""}
                      </>
                    ) : null}
                    {sp.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3>Substats</h3>
          <ol className="char-substats">
            {build.substat_priority.map((s, i) => (
              <li key={s} className="char-substat">
                <span className="sub-rank">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="char-er">
            Energy Regen target: <strong>{build.energy_regen_target}</strong>
          </p>
        </Reveal>
      </div>

      {/* Pre-farm materials */}
      {char.materials && (
        <>
          <SectionHead
            title="Pre-farm materials"
            blurb="Ascension + forte costs with farm locations."
          />
          <Reveal>
            <MaterialsSection materials={char.materials} />
          </Reveal>
        </>
      )}

      {/* Teams */}
      <SectionHead title="Teams" blurb="Tested comps with rotations." />
      {char.teams.map((team) => (
        <Reveal key={team.name}>
          <TeamCard team={team} />
        </Reveal>
      ))}
      <div className="char-teams-note">
        {char.teams_meta.note && <Caveat>{char.teams_meta.note}</Caveat>}
        {char.teams_meta.uncertain_or_prerelease && !preRelease && !char.teams_meta.note && (
          <Caveat>Team data is provisional — sources differ on the best comps.</Caveat>
        )}
        {preRelease && (
          <Caveat>Team comps are pre-release theorycraft — unconfirmed until launch.</Caveat>
        )}
      </div>

      {/* Pull verdict */}
      <SectionHead title="Pull verdict" />
      <Reveal>
        <div className="char-verdict">
          <p className="char-verdict-kicker">Pull verdict</p>
          <span className="badge gold verdict-label">{char.pull_verdict.verdict_label}</span>
          <p className="char-verdict-text">{char.pull_verdict.verdict}</p>
          <p className="char-verdict-meta">
            Banner {char.pull_verdict.banner_id} · Published {char.pull_verdict.published_at}
          </p>
          {char.pull_verdict.uncertain_or_prerelease && !preRelease && (
            <Caveat>This verdict is based on uncertain or incomplete data.</Caveat>
          )}
        </div>
      </Reveal>

      <p className="char-version-note">
        Data current as of game version {char.game_version}.
      </p>

      {/* Prev / next */}
      <nav className="char-prevnext" aria-label="More characters">
        {prev ? (
          <Link href={`/characters/${prev.slug}`}>
            <span className="pn-dir" aria-hidden="true">‹</span>
            <Image
              src={prev.profile.portrait_url}
              alt=""
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
            <span>
              <span className="pn-label">Previous</span>
              <span className="pn-name">{prev.name}</span>
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" style={{ flex: "1 1 0" }} />
        )}
        {next ? (
          <Link href={`/characters/${next.slug}`} className="pn-next">
            <span>
              <span className="pn-label">Next</span>
              <span className="pn-name">{next.name}</span>
            </span>
            <Image
              src={next.profile.portrait_url}
              alt=""
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
            />
            <span className="pn-dir" aria-hidden="true">›</span>
          </Link>
        ) : (
          <span aria-hidden="true" style={{ flex: "1 1 0" }} />
        )}
      </nav>
    </>
  );
}
