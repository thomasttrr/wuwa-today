"use client";

import Link from "next/link";
import { ViewTransition, startTransition, useEffect, useMemo, useState, type CSSProperties } from "react";

export interface HubChar {
  slug: string;
  name: string;
  portrait: string;
  element: string;
  color: string;
  weapon: string;
  rarity: number;
  role: string;
  preRelease: boolean;
  tier: string | null;
  onBanner: boolean;
}

type SortKey = "tier" | "name" | "rarity";
const TIER_ORDER = ["SS", "S", "A", "B", "C", "D"];
const SORTS: { key: SortKey; label: string }[] = [
  { key: "tier", label: "Tier" },
  { key: "name", label: "A–Z" },
  { key: "rarity", label: "Rarity" },
];

/**
 * Character hub explorer. One sticky bar (search, element, weapon, rarity,
 * role, sort); a dense portrait grid. Filter and sort changes run in a React
 * transition so each tile's <ViewTransition> glides it to its new slot; the
 * same `char-<slug>` name morphs the tile into the detail-page hero.
 * Picking exactly one element re-tunes the whole page to that element.
 */
export default function CharactersHub({
  chars,
  elements,
  weapons,
  roles,
  elementColors,
  tierLabels,
}: {
  chars: HubChar[];
  elements: string[];
  weapons: string[];
  roles: string[];
  elementColors: Record<string, string>;
  tierLabels: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [els, setEls] = useState<Set<string>>(new Set());
  const [weapon, setWeapon] = useState<string | null>(null);
  const [rarity, setRarity] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [upcoming, setUpcoming] = useState(false);
  const [sort, setSort] = useState<SortKey>("tier");

  const t = (fn: () => void) => startTransition(fn);

  // One element selected -> the page resonates with it.
  const single = els.size === 1 ? [...els][0] : null;
  useEffect(() => {
    const body = document.body;
    const fallback = body.dataset.siteEl;
    if (single && elementColors[single]) body.style.setProperty("--el", elementColors[single]);
    else if (fallback) body.style.setProperty("--el", fallback);
    return () => {
      if (fallback) body.style.setProperty("--el", fallback);
    };
  }, [single, elementColors]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = chars.filter(
      (c) =>
        (!term || c.name.toLowerCase().includes(term)) &&
        (els.size === 0 || els.has(c.element)) &&
        (!weapon || c.weapon === weapon) &&
        (!rarity || c.rarity === rarity) &&
        (!role || c.role === role) &&
        (!upcoming || c.preRelease)
    );
    const tierRank = (c: HubChar) => (c.tier ? TIER_ORDER.indexOf(c.tier) : 99);
    out.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "rarity") return b.rarity - a.rarity || tierRank(a) - tierRank(b) || a.name.localeCompare(b.name);
      return tierRank(a) - tierRank(b) || b.rarity - a.rarity || a.name.localeCompare(b.name);
    });
    return out;
  }, [chars, q, els, weapon, rarity, role, upcoming, sort]);

  // Tier sort renders labelled tier sections. Unranked Resonators are new
  // or upcoming, so they lead ("New, not ranked yet") instead of trailing C.
  const groups = useMemo(() => {
    if (sort !== "tier") return [{ key: "all", title: "", badge: null as string | null, items: list }];
    const out: { key: string; title: string; badge: string | null; items: HubChar[] }[] = [];
    const unranked = list.filter((c) => !c.tier);
    if (unranked.length) out.push({ key: "new", title: "New, not ranked yet", badge: null, items: unranked });
    for (const tier of TIER_ORDER) {
      const items = list.filter((c) => c.tier === tier);
      if (items.length) out.push({ key: tier, title: tierLabels[tier] ?? "", badge: tier, items });
    }
    return out;
  }, [list, sort, tierLabels]);

  const active = q || els.size || weapon || rarity || role || upcoming;
  const clear = () =>
    t(() => {
      setQ("");
      setEls(new Set());
      setWeapon(null);
      setRarity(null);
      setRole(null);
      setUpcoming(false);
    });

  return (
    <>
      <div className="ch-bar" role="toolbar" aria-label="Filter characters">
        <div className="ch-row">
          <label className="ch-search">
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a Resonator" aria-label="Find a Resonator" />
          </label>
          <div className="ch-chips" role="group" aria-label="Element">
            {elements.map((e) => (
              <button
                key={e}
                type="button"
                className="ch-chip"
                aria-pressed={els.has(e)}
                style={{ "--c": elementColors[e] } as CSSProperties}
                onClick={() =>
                  t(() => {
                    const n = new Set(els);
                    if (n.has(e)) n.delete(e);
                    else n.add(e);
                    setEls(n);
                  })
                }
              >
                <span className="ch-dot" aria-hidden="true" />
                {e}
              </button>
            ))}
          </div>
        </div>
        <div className="ch-row">
          <Select label="Weapon" value={weapon} options={weapons} onChange={(v) => t(() => setWeapon(v))} />
          <Select label="Role" value={role} options={roles} onChange={(v) => t(() => setRole(v))} />
          <div className="ch-chips" role="group" aria-label="Rarity">
            {[5, 4].map((r) => (
              <button key={r} type="button" className="ch-chip" aria-pressed={rarity === r} onClick={() => t(() => setRarity(rarity === r ? null : r))}>
                {r}★
              </button>
            ))}
            <button type="button" className="ch-chip" aria-pressed={upcoming} onClick={() => t(() => setUpcoming(!upcoming))}>
              Upcoming
            </button>
          </div>
          <div className="ch-sort" role="radiogroup" aria-label="Sort by">
            <span className="ch-sort-l">Sort</span>
            {SORTS.map((s) => (
              <button key={s.key} type="button" role="radio" aria-checked={sort === s.key} onClick={() => t(() => setSort(s.key))}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <p className="ch-status" aria-live="polite">
          {list.length === chars.length ? `${chars.length} Resonators` : `${list.length} of ${chars.length}`}
          {active ? (
            <button type="button" className="ch-clear" onClick={clear}>
              Clear filters
            </button>
          ) : null}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="ch-empty">
          <p>No Resonator matches those filters.</p>
          <button type="button" className="rs-btn" onClick={clear}>
            Clear filters
          </button>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="ch-group" aria-label={g.title}>
            {g.title && (
              <header className="ch-group-head">
                <h2 className={`ch-group-tier ch-group-${g.key}`}>{g.badge ?? g.title}</h2>
                {g.badge && <span className="ch-group-label">{g.title}</span>}
                <span className="ch-group-n">{g.items.length}</span>
              </header>
            )}
            <ul className="ch-grid">
              {g.items.map((c) => (
                <li key={c.slug}>
                  <Link href={`/characters/${c.slug}`} className="ch-tile rs-spot" style={{ "--c": c.color } as CSSProperties}>
                    <span className={`ch-art ch-r${c.rarity}`} data-slug={c.slug}>
                      <ViewTransition name={`char-${c.slug}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- 500px portrait shown at <=160px; export is unoptimized. */}
                        <img src={c.portrait} alt="" width={128} height={128} loading="lazy" decoding="async" />
                      </ViewTransition>
                      {c.tier && sort !== "tier" && <span className={`ch-tier ch-tier-${c.tier}`}>{c.tier}</span>}
                      {c.onBanner && <span className="ch-flag">On banner</span>}
                      {!c.onBanner && c.preRelease && <span className="ch-flag ch-flag-soon">Upcoming</span>}
                    </span>
                    <span className="ch-name">{c.name}</span>
                    <span className="ch-meta">
                      <span className="ch-stars" aria-label={`${c.rarity} star`}>{c.rarity}★</span> {c.role} · {c.weapon}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
}) {
  return (
    <label className="ch-select" data-set={value ? "" : undefined}>
      <span>{label}</span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} aria-label={label}>
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
