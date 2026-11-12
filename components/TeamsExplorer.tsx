"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import { CharPoster } from "./CharThumb";
import { elementColor } from "@/lib/elements";
import type { Team, TeamMember, TeamsModel } from "@/lib/teams";

/* Shared with the Tier List: marking a Resonator as owned on either page
   carries over to the other. */
const ROSTER_KEY = "wuwa-today:roster";

const ELEMENT_ORDER = ["Fusion", "Glacio", "Aero", "Electro", "Havoc", "Spectro"];

const SECTIONS = [
  { id: "best", label: "Best teams", short: "Best" },
  { id: "variants", label: "Variants", short: "Variants" },
  { id: "tower", label: "Tower of Adversity", short: "Tower" },
  { id: "wastes", label: "Whimpering Wastes", short: "Wastes" },
  { id: "budget", label: "F2P & budget", short: "F2P" },
  { id: "index", label: "Character index", short: "Index" },
] as const;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-12" + "2026-11-09" -> "Oct 12 – Nov 9, 2026" (no Date, no TZ drift). */
/**
 * Shown once a reset date baked into teams.json has passed. The 28-day
 * rotations bring new enemy lineups, so we never guess the next window —
 * we just say the picks below belong to the previous rotation.
 */
function RotationEndedNote({ target }: { target: string }) {
  const now = useNow(60_000);
  if (!now || now.getTime() < Date.parse(target)) return null;
  return (
    <p className="tm-hint" role="status">
      This rotation has reset. The teams below are from the previous rotation
      until the next data update.
    </p>
  );
}

function dateRange(start: string, end: string): string {
  const [, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  return `${MONTHS[sm - 1]} ${sd} – ${MONTHS[em - 1]} ${ed}, ${ey}`;
}

const elStyle = (element: string) => ({ "--c": elementColor(element) }) as CSSProperties;

interface Filter {
  focus: string | null;
  fieldable: boolean;
  owned: Set<string>;
}

function visible(team: Team, f: Filter): boolean {
  if (f.focus && !team.members.some((m) => m.slug === f.focus)) return false;
  if (f.fieldable && !team.members.every((m) => f.owned.has(m.slug))) return false;
  return true;
}

function openHashedTeam() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (el instanceof HTMLDetailsElement) {
    el.open = true;
    el.closest("article")?.scrollIntoView({ block: "start" });
  }
}

export default function TeamsExplorer({ model }: { model: TeamsModel }) {
  /* Live-aware section kickers: once a rotation's reset instant passes, its
     section must stop calling itself the current reset (the data farm that
     replaces the picks lands after the reset, not at it). */
  const clock = useNow(60_000);
  const resetKicker = (start: string, end: string, nextReset: string) =>
    `${clock && clock.getTime() >= Date.parse(nextReset) ? "Last" : "Current"} reset · ${dateRange(start, end)}`;
  useEffect(() => {
    openHashedTeam();
    window.addEventListener("hashchange", openHashedTeam);
    return () => window.removeEventListener("hashchange", openHashedTeam);
  }, []);
  const [focus, setFocus] = useState<string | null>(null);
  const [owned, setOwned] = useState<Set<string>>(() => new Set());
  const [fieldable, setFieldable] = useState(false);
  const [editRoster, setEditRoster] = useState(false);
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ROSTER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration restore of the visitor's saved roster; the server render never reads localStorage.
      if (saved) setOwned(new Set(JSON.parse(saved) as string[]));
    } catch {
      // storage unavailable: roster stays session-only
    }
  }, []);

  // Highlight the section currently in view in the jump bar.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const toggleOwned = (slug: string) => {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try {
        window.localStorage.setItem(ROSTER_KEY, JSON.stringify([...next]));
      } catch {
        // storage unavailable: roster stays session-only
      }
      return next;
    });
  };

  const filter: Filter = { focus, fieldable, owned };
  const filtering = focus !== null || fieldable;
  const focusChar = focus ? model.characters.find((c) => c.slug === focus) ?? null : null;
  // Only roster members this page knows about count toward "owned".
  const ownedHere = model.characters.filter((c) => owned.has(c.slug)).length;

  const show = (teams: Team[]) => teams.filter((t) => visible(t, filter));
  const counts = useMemo(() => {
    const f: Filter = { focus, fieldable, owned };
    const n = (teams: Team[]) => teams.filter((t) => visible(t, f)).length;
    return {
      best: n(model.general),
      variants: n(model.variants),
      tower: n(model.tower.towers.flatMap((t) => t.teams)),
      wastes: n(model.wastes.halves.flatMap((h) => h.teams)),
      budget: n(model.budget),
      index: model.characters.length,
    } as Record<(typeof SECTIONS)[number]["id"], number>;
  }, [model, focus, fieldable, owned]);

  // How many distinct trios on the page the saved roster covers. The same
  // trio can sit in several sections, so count each member set once.
  const fieldableCount = useMemo(() => {
    const all = [
      ...model.general,
      ...model.variants,
      ...model.tower.towers.flatMap((t) => t.teams),
      ...model.wastes.halves.flatMap((h) => h.teams),
      ...model.budget,
    ];
    const trios = new Set(
      all.filter((t) => t.members.every((m) => owned.has(m.slug))).map((t) => t.members.map((m) => m.slug).sort().join("/"))
    );
    return trios.size;
  }, [model, owned]);

  const startRoster = () => {
    setEditRoster(true);
    document.getElementById("index")?.scrollIntoView({ behavior: "smooth" });
  };

  const cardProps = { focus, owned, showOwned: ownedHere > 0 };

  const byElement = ELEMENT_ORDER.map((el) => ({
    el,
    chars: model.characters.filter((c) => c.element === el).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.chars.length > 0);

  return (
    <div className="tm">
      {/* --- sticky jump bar + active filters --- */}
      <div className="tm-bar">
        <nav className="tm-jump" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              <span className="tm-long">{s.label}</span>
              <span className="tm-short">{s.short}</span>
              {s.id !== "index" && <span className="tm-jump-n">{counts[s.id]}</span>}
            </a>
          ))}
        </nav>
        <div className="tm-filters">
          {focusChar ? (
            <span className="tm-focus" style={elStyle(focusChar.element)}>
              <span className="tm-dot" aria-hidden="true" />
              Teams with <strong>{focusChar.name}</strong>
              <button type="button" onClick={() => setFocus(null)} aria-label={`Stop showing only teams with ${focusChar.name}`}>
                ✕
              </button>
            </span>
          ) : (
            <span className="tm-hint">
              <a href="#index">Pick a Resonator</a> to see only their teams
            </span>
          )}
          {ownedHere === 0 ? (
            /* No roster yet: a count of 0 would read as "you can field
               nothing", so offer the first step instead. */
            <span className="tm-roster-cta">
              <button type="button" className="tm-pill" onClick={startRoster}>
                Teams I can field
              </button>
              <span className="tm-hint">
                <button type="button" className="tm-link" onClick={startRoster}>
                  Mark your roster
                </button>{" "}
                in the index first
              </span>
            </span>
          ) : (
            <button
              type="button"
              className="tm-pill"
              aria-pressed={fieldable}
              onClick={() => setFieldable((v) => !v)}
              aria-label={`Teams I can field: ${fieldableCount} from the ${ownedHere} Resonators in your roster`}
            >
              Teams I can field <span className="tm-pill-n">{fieldableCount}</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Best teams --- */}
      <Section id="best" title="Best teams" blurb="The strongest teams in 3.8 for general play. T0 is the top of the meta; T0.5 sits just under it.">
        <TeamGrid teams={show(model.general)} {...cardProps} filtering={filtering} />
      </Section>

      {/* --- Variants --- */}
      <Section id="variants" title="Team variants" blurb="Swaps for when you're missing a member, or want a different shape for the same core.">
        <TeamGrid teams={show(model.variants)} {...cardProps} filtering={filtering} />
      </Section>

      {/* --- Tower of Adversity --- */}
      <Section
        id="tower"
        title="Tower of Adversity"
        kicker={resetKicker(model.tower.resetStart, model.tower.resetEnd, model.tower.nextReset)}
        blurb="Which teams to send up which tower this reset."
        aside={<RollingCountdown target={model.tower.nextReset} label="Hazard Zone resets in · America server" size="md" />}
      >
        <div className="tm-notes">
          <RotationEndedNote target={model.tower.nextReset} />
          <p>{model.tower.resetLine}</p>
          {model.tower.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>

        <div className="tm-towers">
          {model.tower.towers.map((tw) => (
            <section key={tw.id} className="tm-tower" aria-labelledby={`tw-${tw.id}`}>
              <header className="tm-tower-head">
                <p className="tm-tower-pos">{tw.position}</p>
                <h3 id={`tw-${tw.id}`} className="tm-tower-name">
                  {tw.name}
                  {tw.floors && <span className="tm-tower-floors"> · {tw.floors}</span>}
                </h3>
              </header>
              <div className="tm-tower-info">
                <div>
                  <h4 className="tm-label">Tower effects</h4>
                  <ul className="tm-effects">
                    {tw.effects.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="tm-label">Boss resists</h4>
                  <ul className="tm-resist">
                    {tw.resist.map((r) => (
                      <li key={r.label}>
                        <span className="tm-resist-k">{r.label}</span>
                        {r.elements.map((el) => (
                          <span key={el} className="tm-el" style={elStyle(el)}>
                            <span className="tm-dot" aria-hidden="true" />
                            {el}
                          </span>
                        ))}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <TeamGrid teams={show(tw.teams)} {...cardProps} filtering={filtering} compact />
            </section>
          ))}
        </div>

        <section className="tm-keepout" aria-labelledby="tm-keepout-h">
          <h3 id="tm-keepout-h" className="tm-sub-h">Keep out this reset</h3>
          <ul>
            {model.tower.keepOut.map((k) => (
              <li
                key={k.element}
                style={elStyle(k.element)}
                data-match={focusChar?.element === k.element ? "" : undefined}
              >
                <span className="tm-el">
                  <span className="tm-dot" aria-hidden="true" />
                  {k.element} teams
                </span>
                <p>{k.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </Section>

      {/* --- Whimpering Wastes --- */}
      <Section
        id="wastes"
        title="Whimpering Wastes"
        kicker={resetKicker(model.wastes.resetStart, model.wastes.resetEnd, model.wastes.nextReset)}
        blurb={model.wastes.teamsLine}
        aside={<RollingCountdown target={model.wastes.nextReset} label="Respawning Waters resets in · America server" size="md" />}
      >
        <div className="tm-notes">
          <RotationEndedNote target={model.wastes.nextReset} />
          <p>{model.wastes.resetLine}</p>
        </div>

        <h3 className="tm-sub-h">This reset&apos;s big buffs</h3>
        <ul className="tm-tokens">
          {model.wastes.tokens.map((t) => (
            <li key={t.name} className="tm-token">
              <p className="tm-token-k">Golden Token</p>
              <p className="tm-token-name">{t.name}</p>
              <p>{t.text}</p>
            </li>
          ))}
          <li className="tm-token tm-token-stage">
            <p className="tm-token-k">Stage effect</p>
            <p className="tm-token-name">Infinite Torrents</p>
            <p>{model.wastes.stageEffect}</p>
          </li>
        </ul>

        <div className="tm-warn" role="note">
          <span className="tm-warn-k">Harder this reset</span>
          <span className="tm-warn-els">
            {model.wastes.harder.elements.map((el) => (
              <span key={el} className="tm-el" style={elStyle(el)}>
                <span className="tm-dot" aria-hidden="true" />
                {el}
              </span>
            ))}
          </span>
          <p>{model.wastes.harder.text}</p>
        </div>

        <div className="tm-halves">
          {model.wastes.halves.map((h) => (
            <section key={h.name} className="tm-half" aria-label={h.name}>
              <h3 className="tm-half-h">
                {h.name}
                <span className="rs-count">{show(h.teams).length}</span>
              </h3>
              <TeamGrid teams={show(h.teams)} {...cardProps} filtering={filtering} single />
            </section>
          ))}
        </div>
      </Section>

      {/* --- F2P / budget --- */}
      <Section id="budget" title="F2P & budget" blurb="Teams built from free and standard-banner Resonators — strong enough to clear most content while you save.">
        <TeamGrid teams={show(model.budget)} {...cardProps} filtering={filtering} />
      </Section>

      {/* --- Character index --- */}
      <Section
        id="index"
        title="Character index"
        blurb={
          editRoster
            ? "Tap every Resonator you own. Your roster is saved on this device and shared with the Tier List."
            : "Tap a Resonator to show only the teams they're in. The number is how many teams on this page use them."
        }
        aside={
          <button type="button" className="tm-pill" aria-pressed={editRoster} onClick={() => setEditRoster((v) => !v)}>
            {editRoster ? "Done marking" : "Mark my roster"}
          </button>
        }
      >
        <div className="tm-index">
          {byElement.map((g) => (
            <section key={g.el} className="tm-index-group" style={elStyle(g.el)} aria-label={`${g.el} Resonators`}>
              <h3 className="tm-index-h">
                <span className="tm-dot" aria-hidden="true" />
                {g.el}
              </h3>
              <ul className="tm-index-grid">
                {g.chars.map((c) => {
                  const isOwned = owned.has(c.slug);
                  const pressed = editRoster ? isOwned : focus === c.slug;
                  return (
                    <li key={c.slug}>
                      <button
                        type="button"
                        className="tm-ix"
                        aria-pressed={pressed}
                        data-owned={isOwned ? "" : undefined}
                        onClick={() => {
                          if (editRoster) {
                            toggleOwned(c.slug);
                            return;
                          }
                          setFocus((f) => (f === c.slug ? null : c.slug));
                          if (focus !== c.slug) document.getElementById("best")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        aria-label={
                          editRoster
                            ? `${c.name}, ${isOwned ? "owned" : "not owned"}`
                            : `${c.name}, ${c.teamCount} teams. Show only their teams`
                        }
                      >
                        <CharPoster thumb={c.thumb} name={c.name} rarity={c.rarity}>
                          {isOwned && (
                            <span className="tm-owned" aria-hidden="true">
                              ✓
                            </span>
                          )}
                        </CharPoster>
                        <span className="tm-ix-meta">
                          <Stars n={c.rarity} /> · {c.teamCount} {c.teamCount === 1 ? "team" : "teams"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  kicker,
  blurb,
  aside,
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  blurb?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="tm-section" aria-labelledby={`${id}-h`}>
      <header className="tm-section-head">
        <div>
          {kicker && <p className="rs-kicker">{kicker}</p>}
          <h2 id={`${id}-h`} className="tm-h2">
            {title}
          </h2>
          {blurb && <p className="tm-blurb">{blurb}</p>}
        </div>
        {aside && <div className="tm-section-aside">{aside}</div>}
      </header>
      {children}
    </section>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className={`tm-stars tm-stars-${n}`} aria-label={`${n}-star`}>
      ★{n}
    </span>
  );
}

interface CardProps {
  focus: string | null;
  owned: Set<string>;
  showOwned: boolean;
}

function TeamGrid({
  teams,
  filtering,
  compact = false,
  single = false,
  ...card
}: CardProps & { teams: Team[]; filtering: boolean; compact?: boolean; single?: boolean }) {
  if (teams.length === 0) {
    return <p className="tm-empty">{filtering ? "No teams here match your filter." : "No teams listed."}</p>;
  }
  return (
    <ul className={`tm-grid${compact ? " tm-grid-compact" : ""}${single ? " tm-grid-single" : ""}`}>
      {teams.map((t) => (
        <li key={t.id}>
          <TeamCard team={t} {...card} />
        </li>
      ))}
    </ul>
  );
}

function TeamCard({ team, focus, owned, showOwned }: { team: Team } & CardProps) {
  const lead = team.members[0];
  const have = team.members.filter((m) => owned.has(m.slug)).length;
  const tierTop = team.tier === "T0" || team.tier?.startsWith("T0 ");
  return (
    <article className="tm-card rs-spot" style={elStyle(lead.element)} aria-labelledby={`${team.id}-n`}>
      <header className="tm-card-head">
        <h3 id={`${team.id}-n`} className="tm-card-name">
          {team.tag && <span className="tm-tag">{team.tag}</span>}
          {team.name}
          {team.variant && <span className="tm-variant"> ({team.variant})</span>}
        </h3>
        {team.tier && (
          <span className={`tm-tier${tierTop ? " tm-tier-top" : ""}`} title={`Tier ${team.tier}`}>
            {team.tier}
          </span>
        )}
      </header>
      {team.badge && <p className={`tm-badge tm-badge-${team.badge.tone}`}>{team.badge.text}</p>}
      {team.alsoIn && team.alsoIn.length > 0 && (
        <p className="tm-also">
          Same team also listed under {team.alsoIn.join(" and ")}. No character can be used twice in a full clear,
          so send it up one tower.
        </p>
      )}

      <ol className="tm-members">
        {team.members.map((m) => (
          <Member key={m.slug} m={m} focused={focus === m.slug} owned={showOwned && owned.has(m.slug)} />
        ))}
      </ol>

      {/* Native disclosure: the text stays in the HTML (search, Ctrl+F),
          but the list is scannable. Opens itself when linked by hash. */}
      <details className="tm-how" id={`team-${team.id}`}>
        <summary className="tm-label">How they work together</summary>
        <p>{team.how}</p>
      </details>

      {showOwned && (
        <p className={`tm-have${have === 3 ? " tm-have-all" : ""}`}>
          {have === 3 ? "✓ You own all three" : `You own ${have} of 3`}
        </p>
      )}
    </article>
  );
}

function Member({ m, focused, owned }: { m: TeamMember; focused: boolean; owned: boolean }) {
  const face = (
    <CharPoster thumb={m.thumb} name={m.name} rarity={m.rarity}>
      {owned && (
        <span className="tm-owned" aria-hidden="true">
          ✓
        </span>
      )}
    </CharPoster>
  );
  return (
    <li className="tm-member" style={elStyle(m.element)} data-focus={focused ? "" : undefined}>
      <p className="tm-role">{m.role}</p>
      {m.hasPage ? (
        <Link href={`/characters/${m.slug}`} className="tm-member-link" aria-label={`${m.name} — open character page`}>
          {face}
        </Link>
      ) : (
        face
      )}
      <p className="tm-member-meta">
        <span className="tm-dot" aria-hidden="true" />
        {m.element} <Stars n={m.rarity} />
      </p>
    </li>
  );
}
