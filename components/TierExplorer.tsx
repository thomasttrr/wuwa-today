"use client";

import Link from "next/link";
import {
  ViewTransition,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Placement, SourceKey, TierChar, TierModel, TierRole } from "@/lib/tiers";
import { CharMedal, CharPoster } from "./CharThumb";

const PRYDWEN_TIERS = ["T0", "T0.5", "T1", "T1.5", "T2", "T3", "T4"];
const ROLES: ("All" | TierRole)[] = ["All", "DPS", "Hybrid", "Support"];
const ROLE_LABEL: Record<string, string> = { All: "All roles", DPS: "DPS", Hybrid: "Hybrid", Support: "Support" };
const ELEMENTS: [string, string][] = [
  ["Aero", "#5fd9aa"],
  ["Electro", "#b28cf6"],
  ["Fusion", "#f5824f"],
  ["Glacio", "#6fc3f2"],
  ["Havoc", "#ec6aa6"],
  ["Spectro", "#f0d46a"],
];
const SOURCES: { key: SourceKey; label: string }[] = [
  { key: "prydwen", label: "Community" },
  { key: "value", label: "Value" },
  { key: "ours", label: "WuWa Today" },
];
const MODE_SHORT: Record<string, string> = {
  "Tower of Adversity": "ToA",
  "Whimpering Wastes": "WhiWa",
  Overall: "Overall",
};
const ROSTER_KEY = "wuwa-today:roster";

interface Placed {
  char: TierChar;
  roles: TierRole[];
}

function bestOf(placements: Placement[]): { tier: string; roles: TierRole[] } | null {
  if (placements.length === 0) return null;
  const rank = (t: string) => PRYDWEN_TIERS.indexOf(t);
  const best = placements.reduce((a, b) => (rank(b.tier) < rank(a.tier) ? b : a));
  return {
    tier: best.tier,
    roles: placements.filter((p) => p.tier === best.tier).map((p) => p.role),
  };
}

export default function TierExplorer({ model }: { model: TierModel }) {
  const [source, setSource] = useState<SourceKey>("prydwen");
  const [mode, setMode] = useState("Tower of Adversity");
  const [role, setRole] = useState<"All" | TierRole>("All");
  const [elements, setElements] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [rosterOnly, setRosterOnly] = useState(false);
  const [editRoster, setEditRoster] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [barGone, setBarGone] = useState(false);

  // Mobile: once the control bar scrolls away, a compact mode switch floats
  // above the tab bar so ToA / WhiWa stays one tap away.
  useEffect(() => {
    const el = barRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setBarGone(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ROSTER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration restore of the visitor's saved roster; the server render never reads localStorage.
      if (raw) setOwned(new Set(JSON.parse(raw) as string[]));
    } catch {
      // storage unavailable: roster stays session-only
    }
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

  /** Re-tiering changes go through a React transition so <ViewTransition>
   * slides each portrait from its old tier row to its new one. */
  const retier = (fn: () => void) => startTransition(fn);

  const modes = source === "ours" ? [] : model.modes[source];
  const activeMode = modes.includes(mode) ? mode : modes[0];

  const rows = useMemo(() => {
    if (source === "ours") {
      const tiers = [...new Set(model.chars.filter((c) => c.ours).map((c) => c.ours!.tier))];
      const order = ["SS", "S", "A", "B", "C", "D"];
      tiers.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      return tiers.map((tier) => ({
        tier,
        label: model.chars.find((c) => c.ours?.tier === tier)?.ours?.label ?? "",
        items: model.chars.filter((c) => c.ours?.tier === tier).map((char) => ({ char, roles: [] as TierRole[] })),
      }));
    }
    const buckets = new Map<string, Placed[]>(PRYDWEN_TIERS.map((t) => [t, []]));
    for (const char of model.chars) {
      const all = char[source][activeMode] ?? [];
      const ps = role === "All" ? all : all.filter((p) => p.role === role);
      const best = bestOf(ps);
      if (best) buckets.get(best.tier)!.push({ char, roles: best.roles });
    }
    return PRYDWEN_TIERS.map((tier) => ({ tier, label: "", items: buckets.get(tier)! })).filter((r) => r.items.length > 0);
  }, [model.chars, source, activeMode, role]);

  const q = query.trim().toLowerCase();
  const matches = (c: TierChar) =>
    (elements.size === 0 || elements.has(c.element)) &&
    (!q || c.name.toLowerCase().includes(q)) &&
    (!rosterOnly || owned.has(c.slug));
  const total = rows.reduce((n, r) => n + r.items.length, 0);
  const shown = rows.reduce((n, r) => n + r.items.filter((i) => matches(i.char)).length, 0);
  const filtering = elements.size > 0 || q !== "" || rosterOnly;

  const sel = selected ? model.chars.find((c) => c.slug === selected) ?? null : null;

  return (
    <div className="tl" style={{ "--tiers": rows.length } as CSSProperties}>
      <div ref={barRef} className="tl-bar" role="toolbar" aria-label="Tier list controls">
        <div className="tl-bar-row">
          <Segmented
            label="Source"
            options={SOURCES.map((s) => ({ key: s.key, label: s.label }))}
            value={source}
            onChange={(v) => retier(() => setSource(v as SourceKey))}
          />
          {modes.length > 0 && (
            <Segmented
              label="Game mode"
              options={modes.map((m) => ({ key: m, label: m, short: MODE_SHORT[m] }))}
              value={activeMode}
              onChange={(v) => retier(() => setMode(v))}
            />
          )}
          {source !== "ours" && (
            <Segmented
              label="Role"
              options={ROLES.map((r) => ({ key: r, label: ROLE_LABEL[r] }))}
              value={role}
              onChange={(v) => retier(() => setRole(v as "All" | TierRole))}
            />
          )}
        </div>
        <div className="tl-bar-row">
          <label className="tl-search">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a Resonator"
              aria-label="Find a Resonator"
            />
          </label>
          <div className="tl-els" role="group" aria-label="Filter by element">
            {ELEMENTS.map(([name, color]) => (
              <button
                key={name}
                type="button"
                className="tl-el"
                aria-pressed={elements.has(name)}
                style={{ "--c": color } as CSSProperties}
                onClick={() => {
                  const next = new Set(elements);
                  if (next.has(name)) next.delete(name);
                  else next.add(name);
                  setElements(next);
                }}
              >
                <span className="tl-el-dot" aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>
          <div className="tl-roster-ctl">
            <button
              type="button"
              className="tl-pill"
              aria-pressed={editRoster}
              onClick={() => setEditRoster((v) => !v)}
            >
              {editRoster ? "Done marking" : "Mark my roster"}
            </button>
            <button
              type="button"
              className="tl-pill"
              aria-pressed={rosterOnly}
              disabled={owned.size === 0 && !rosterOnly}
              onClick={() => setRosterOnly((v) => !v)}
            >
              My roster <span className="tl-pill-n">{owned.size}</span>
            </button>
          </div>
        </div>
        <p className="tl-status" aria-live="polite">
          {editRoster
            ? "Tap portraits to mark who you own. Saved on this device."
            : filtering
              ? `Showing ${shown} of ${total}`
              : `${total} Resonators ranked`}
          {(filtering || editRoster) && (
            <button
              type="button"
              className="tl-clear"
              onClick={() => {
                setElements(new Set());
                setQuery("");
                setRosterOnly(false);
                setEditRoster(false);
              }}
            >
              Clear
            </button>
          )}
        </p>
      </div>

      <ol className="tl-rows" aria-label="Tiers">
        {rows.map((row, i) => (
          <li
            key={row.tier}
            className="tl-row"
            style={{ "--rank": i, "--rank-k": 1 - i / Math.max(rows.length - 1, 1) } as CSSProperties}
          >
            <div className="tl-tier">
              <span className="tl-tier-name" aria-label={`Tier ${row.tier}`}>
                {(() => {
                  const m = /^([A-Za-z]+)(.*)$/.exec(row.tier);
                  return m ? (
                    <>
                      {m[1]}
                      {m[2] && <span className="tl-tier-num">{m[2]}</span>}
                    </>
                  ) : (
                    row.tier
                  );
                })()}
              </span>
              {row.label && <span className="tl-tier-label">{row.label}</span>}
            </div>
            <ul className="tl-grid">
              {row.items.map(({ char, roles }) => {
                const hit = matches(char);
                const mine = owned.has(char.slug);
                return (
                  <li key={char.slug}>
                    <ViewTransition name={`tl-${char.slug}`}>
                      <button
                        type="button"
                        className="tl-char"
                        data-dim={!hit || undefined}
                        data-owned={mine || undefined}
                        style={{ "--c": char.color } as CSSProperties}
                        aria-label={
                          editRoster
                            ? `${char.name}: ${mine ? "owned, tap to unmark" : "tap to mark as owned"}`
                            : `${char.name}, ${row.tier}. Open quick look`
                        }
                        aria-pressed={editRoster ? mine : undefined}
                        onClick={() => (editRoster ? toggleOwned(char.slug) : setSelected(char.slug))}
                      >
                        <CharPoster thumb={char.thumb} name={char.name} rarity={char.rarity}>
                          {mine && (
                            <span className="tl-owned" aria-hidden="true">
                              <svg width="12" height="12" viewBox="0 0 24 24">
                                <path d="m5 12 5 5 9-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                          {role === "All" && roles.length > 0 && (
                            <span className="tl-role" aria-hidden="true">{roles.map((r) => r[0]).join("/")}</span>
                          )}
                        </CharPoster>
                      </button>
                    </ViewTransition>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      {modes.length > 1 && (
        <div className="tl-float" data-show={barGone || undefined} aria-hidden={!barGone}>
          <Segmented
            label="Game mode"
            options={modes.map((m) => ({ key: m, label: m, short: MODE_SHORT[m] }))}
            value={activeMode}
            onChange={(v) => retier(() => setMode(v))}
            tabIndex={barGone ? 0 : -1}
          />
        </div>
      )}

      {role === "All" && source !== "ours" && (
        <p className="tl-legend">
          <b>D</b> DPS · <b>H</b> Hybrid · <b>S</b> Support. In “All roles”, Resonators ranked in more than one
          role sit at their best placement.
        </p>
      )}

      {sel && (
        <QuickLook
          char={sel}
          model={model}
          owned={owned.has(sel.slug)}
          onToggleOwned={() => toggleOwned(sel.slug)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Segmented({
  label,
  options,
  value,
  onChange,
  tabIndex,
}: {
  label: string;
  options: { key: string; label: string; short?: string }[];
  value: string;
  onChange: (v: string) => void;
  tabIndex?: number;
}) {
  const i = Math.max(0, options.findIndex((o) => o.key === value));
  return (
    <div className="tl-seg" role="radiogroup" aria-label={label} style={{ "--n": options.length, "--i": i } as CSSProperties}>
      <span className="tl-seg-thumb" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={o.key === value}
          aria-label={o.short ? o.label : undefined}
          tabIndex={tabIndex}
          onClick={() => o.key !== value && onChange(o.key)}
        >
          {o.short ? (
            <>
              <span className="tl-long">{o.label}</span>
              <span className="tl-short" aria-hidden="true">{o.short}</span>
            </>
          ) : (
            o.label
          )}
        </button>
      ))}
    </div>
  );
}

function placementText(ps: Placement[] | undefined) {
  if (!ps || ps.length === 0) return null;
  return ps.map((p) => `${p.tier} ${p.role}`).join(" · ");
}

function QuickLook({
  char,
  model,
  owned,
  onToggleOwned,
  onClose,
}: {
  char: TierChar;
  model: TierModel;
  owned: boolean;
  onToggleOwned: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const rows: { group: string; mode: string; text: string | null }[] = [
    ...model.modes.prydwen.map((m) => ({ group: `Community · ${model.meta.prydwenPatch}`, mode: m, text: placementText(char.prydwen[m]) })),
    ...model.modes.value.map((m) => ({ group: `Value · ${model.meta.valuePatch}`, mode: m, text: placementText(char.value[m]) })),
  ];
  const groups = [...new Set(rows.map((r) => r.group))];

  return (
    <dialog
      ref={ref}
      className="tl-sheet"
      aria-labelledby="tl-sheet-name"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ "--c": char.color } as CSSProperties}
    >
      <div className="tl-sheet-box">
        <button type="button" className="tl-sheet-x" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <header className="tl-sheet-head">
          {char.thumb && <CharMedal thumb={char.thumb} name={char.name} size={88} rarity={char.rarity} eager />}
          <div>
            <p className="tl-sheet-kicker">
              {[char.element, char.weapon, char.rarity ? `${char.rarity}★` : ""].filter(Boolean).join(" · ")}
            </p>
            <h2 id="tl-sheet-name">{char.name}</h2>
            {char.role && <p className="tl-sheet-role">{char.role}</p>}
          </div>
        </header>

        {char.ours && (
          <section className="tl-sheet-ours">
            <div className="tl-sheet-badge">
              <span>{char.ours.tier}</span>
              <small>WuWa Today</small>
            </div>
            <div>
              <p className="tl-sheet-label">{char.ours.label}</p>
              <p className="tl-sheet-note">{char.ours.note}</p>
            </div>
          </section>
        )}

        {groups.map((g) => (
          <section key={g} className="tl-sheet-group">
            <h3>{g}</h3>
            <dl>
              {rows
                .filter((r) => r.group === g)
                .map((r) => (
                  <div key={r.mode}>
                    <dt>{r.mode}</dt>
                    <dd>{r.text ?? <span className="tl-muted">Not ranked</span>}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}

        <div className="tl-sheet-actions">
          {char.inHub && (
            <Link href={`/characters/${char.slug}`} className="rs-btn rs-btn-solid">
              Full build
            </Link>
          )}
          <button type="button" className="rs-btn" aria-pressed={owned} onClick={onToggleOwned}>
            {owned ? "✓ In my roster" : "Add to my roster"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
