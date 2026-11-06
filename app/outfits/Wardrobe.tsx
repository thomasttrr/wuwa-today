"use client";

import Link from "next/link";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type Ref,
} from "react";
import type { Cosmetic, Shelf, ShelfKey } from "./types";

type Filter = "all" | ShelfKey;

/**
 * The Wardrobe: a "Runway" that flips through the outfits on a big stage,
 * then the rest of the catalog as display-case tiles on themed shelves, with
 * search, shelf chips, "Surprise me", and a quick-look sheet for any piece.
 * Any piece can be linked to directly with #its-id.
 */
export default function Wardrobe({
  items,
  shelves,
  newest,
}: {
  items: Cosmetic[];
  shelves: Shelf[];
  newest: string;
}) {
  const outfits = useMemo(() => items.filter((i) => i.shelf === "outfits"), [items]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const [stage, setStage] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());
  const [expanded, setExpanded] = useState<Set<ShelfKey>>(() => new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const runwayRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const searching = q.length > 0;

  // Which shelves and pieces are visible right now.
  const visible = useMemo(() => {
    const match = (i: Cosmetic) =>
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.character.toLowerCase().includes(q) ||
      i.kind.toLowerCase().includes(q) ||
      i.version.toLowerCase() === q;
    return shelves
      .filter((s) => (filter === "all" ? s.key !== "outfits" || searching : s.key === filter))
      .map((s) => ({ shelf: s, list: items.filter((i) => i.shelf === s.key && match(i)) }))
      .filter((g) => g.list.length > 0);
  }, [shelves, items, filter, q, searching]);

  const total = visible.reduce((n, g) => n + g.list.length, 0);
  // The order the quick look steps through (what's on screen, top to bottom).
  const flat = useMemo(() => {
    const onRunway = filter === "all" && !searching ? outfits : [];
    return [...onRunway, ...visible.flatMap((g) => g.list)];
  }, [visible, outfits, filter, searching]);

  const open = useCallback((id: string) => {
    setOpenId(id);
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
  }, []);
  const close = useCallback(() => {
    setOpenId(null);
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch {
      /* ignore */
    }
  }, []);

  // Deep links: #outfit-id puts it on the runway, any other #id opens it.
  // Runs after hydration (the static render has no hash) and whenever the hash
  // changes later, e.g. a shared link opened in a tab already on this page.
  useEffect(() => {
    const apply = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const idx = outfits.findIndex((o) => o.id === id);
      if (idx >= 0) {
        setFilter("all");
        setQuery("");
        setStage(idx);
        requestAnimationFrame(() => runwayRef.current?.scrollIntoView({ block: "start" }));
      } else if (byId.has(id)) {
        setOpenId(id);
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [outfits, byId]);

  const surprise = () => {
    const pool = items.filter((i) => i.image);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) open(pick.id);
  };

  const pickFilter = (f: Filter) => {
    setFilter(f);
    // Bring the catalog top into view when switching shelves from far below.
    const top = catalogRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) catalogRef.current?.scrollIntoView({ block: "start" });
  };

  const counts = useMemo(() => {
    const m = new Map<ShelfKey, number>();
    for (const i of items) m.set(i.shelf, (m.get(i.shelf) ?? 0) + 1);
    return m;
  }, [items]);

  const current = openId ? byId.get(openId) ?? null : null;
  const pos = current ? flat.findIndex((i) => i.id === current.id) : -1;

  return (
    <>
      {outfits.length > 0 && !searching && filter === "all" && (
        <Runway ref={runwayRef} outfits={outfits} index={stage} onIndex={setStage} newest={newest} />
      )}

      <div className="wd-catalog" ref={catalogRef} id="catalog">
        <div className="wd-bar">
          <div className="wd-bar-row">
            <label className="wd-search">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="og-visually-hidden">Search the wardrobe</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, character, kind…"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <button type="button" className="wd-surprise" onClick={surprise}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" />
                <circle cx="12" cy="12" r="1.4" fill="currentColor" />
              </svg>
              <span>Surprise me</span>
            </button>
          </div>
          <div className="wd-chips" role="group" aria-label="Shelves">
            <button type="button" className="wd-chip" aria-pressed={filter === "all"} onClick={() => pickFilter("all")}>
              All <span className="wd-chip-n">{items.length}</span>
            </button>
            {shelves.map((s) => (
              <button
                key={s.key}
                type="button"
                className="wd-chip"
                style={{ "--c": s.color } as CSSProperties}
                aria-pressed={filter === s.key}
                onClick={() => pickFilter(s.key)}
              >
                <span className="wd-chip-dot" aria-hidden="true" />
                {s.title} <span className="wd-chip-n">{counts.get(s.key)}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="og-visually-hidden" aria-live="polite">
          {searching ? `${total} pieces match “${query.trim()}”.` : ""}
        </p>

        {visible.length === 0 ? (
          <div className="wd-empty">
            <p className="wd-empty-t">Nothing in the wardrobe matches “{query.trim()}”.</p>
            <button
              type="button"
              className="rs-btn"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear search
            </button>
          </div>
        ) : (
          visible.map(({ shelf, list }, n) => {
            const full = searching || filter !== "all" || expanded.has(shelf.key);
            const shown = full || !shelf.preview ? list : list.slice(0, shelf.preview);
            const hidden = list.length - shown.length;
            return (
              <section
                key={shelf.key}
                className={`wd-shelf wd-shelf-${shelf.shape}`}
                style={{ "--c": shelf.color } as CSSProperties}
                aria-labelledby={`wd-h-${shelf.key}`}
              >
                <header className="wd-shelf-head">
                  <span className="wd-shelf-n" aria-hidden="true">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 id={`wd-h-${shelf.key}`}>
                      {shelf.title} <span className="wd-shelf-count">{list.length}</span>
                    </h2>
                    <p>{shelf.blurb}</p>
                  </div>
                </header>
                <ul className="wd-grid" id={`wd-grid-${shelf.key}`}>
                  {shown.map((i) => (
                    <li key={i.id}>
                      <Tile item={i} onOpen={open} />
                    </li>
                  ))}
                </ul>
                {hidden > 0 && (
                  <button
                    type="button"
                    className="wd-more"
                    aria-expanded={false}
                    aria-controls={`wd-grid-${shelf.key}`}
                    onClick={() => setExpanded((s) => new Set(s).add(shelf.key))}
                  >
                    Show all {list.length} {shelf.title.toLowerCase()}
                    <span aria-hidden="true"> ↓</span>
                  </button>
                )}
              </section>
            );
          })
        )}
      </div>

      {current && (
        <QuickLook
          item={current}
          pos={pos}
          total={flat.length}
          onClose={close}
          onStep={(d) => {
            if (pos < 0 || flat.length === 0) return;
            open(flat[(pos + d + flat.length) % flat.length].id);
          }}
        />
      )}
    </>
  );
}

/* --------------------------------------------------------------------------
   Runway: the outfits on a big stage, with a thumbnail rail.
   -------------------------------------------------------------------------- */

function Runway({
  ref,
  outfits,
  index,
  onIndex,
  newest,
}: {
  ref: Ref<HTMLElement>;
  outfits: Cosmetic[];
  index: number;
  onIndex: (i: number) => void;
  newest: string;
}) {
  const o = outfits[index] ?? outfits[0];
  const railRef = useRef<HTMLOListElement>(null);
  const n = outfits.length;
  const go = (d: number) => onIndex((index + d + n) % n);

  // Keep the selected thumb in view inside the rail (never scrolls the page).
  useEffect(() => {
    const rail = railRef.current;
    const btn = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !btn) return;
    const left = btn.offsetLeft - (rail.clientWidth - btn.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [index]);

  const onRailKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (index + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
      onIndex(next);
      (railRef.current?.children[next]?.querySelector("button") as HTMLButtonElement | null)?.focus();
    }
  };

  return (
    <section ref={ref} className="wd-runway" id="runway" aria-label="Outfit runway" style={{ "--c": o.color } as CSSProperties}>
      <div className="wd-stage">
        <div className="wd-stage-art">
          {o.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- static export; srcset of real downscales.
            <img
              key={o.id}
              src={o.image}
              srcSet={o.thumb ? `${o.thumb} 480w, ${o.image} 1280w` : undefined}
              sizes="(max-width: 1120px) 100vw, 1040px"
              width={1280}
              height={720}
              alt={o.imageAlt}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
          ) : (
            <div className="wd-noart">No official art yet</div>
          )}
          <div className="wd-stage-nav">
            <button type="button" onClick={() => go(-1)} aria-label="Previous outfit">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="wd-stage-count" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => go(1)} aria-label="Next outfit">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div className="wd-stage-info">
          <p className="og-visually-hidden" aria-live="polite">{`${o.name}, for ${o.character}`}</p>
          <p className="wd-stage-kicker">
            {o.isNew && <span className="wd-new">New in {newest}</span>}
            <span>{o.kind}</span>
            {o.versionShort && <span>v{o.versionShort}</span>}
          </p>
          <h2 className="wd-stage-name">{o.name}</h2>
          <p className="wd-stage-for">
            for{" "}
            {o.characterSlug ? (
              <Link href={`/characters/${o.characterSlug}`}>{o.character}</Link>
            ) : (
              <strong>{o.character}</strong>
            )}
          </p>
          <p className="wd-stage-desc">{o.description}</p>
          <p className="wd-stage-avail">
            <span className="wd-label">How to get</span>
            {o.availability}
          </p>
        </div>
      </div>

      <ol className="wd-rail" ref={railRef} aria-label="Choose an outfit" onKeyDown={onRailKey}>
        {outfits.map((it, i) => (
          <li key={it.id} style={{ "--c": it.color } as CSSProperties}>
            <button
              type="button"
              aria-pressed={i === index}
              tabIndex={i === index ? 0 : -1}
              onClick={() => onIndex(i)}
            >
              <span className="wd-rail-art">
                {it.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- small rail thumb.
                  <img src={it.thumb ?? it.image} alt="" width={480} height={270} loading="lazy" decoding="async" />
                )}
              </span>
              <span className="wd-rail-name">{it.name}</span>
              <span className="wd-rail-who">{it.character}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Tile: one display case.
   -------------------------------------------------------------------------- */

function Tile({ item, onOpen }: { item: Cosmetic; onOpen: (id: string) => void }) {
  const initials = item.name
    .replace(/^Phantom:\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <button
      type="button"
      className="wd-tile"
      style={{ "--c": item.color } as CSSProperties}
      onClick={() => onOpen(item.id)}
      aria-haspopup="dialog"
    >
      <span className="wd-case">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export; art is already small.
          <img src={item.thumb ?? item.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="wd-case-empty" aria-hidden="true">
            <span>{initials}</span>
          </span>
        )}
        {item.isNew && <span className="wd-new wd-new-tile">New</span>}
      </span>
      <span className="wd-tile-name">{item.name}</span>
      <span className="wd-tile-meta">
        {item.character}
        {item.versionShort ? ` · ${item.versionShort}` : ""}
        {!item.image ? " · no art" : ""}
      </span>
    </button>
  );
}

/* --------------------------------------------------------------------------
   Quick look: native <dialog>, bottom sheet on phones, card on desktop.
   -------------------------------------------------------------------------- */

function QuickLook({
  item,
  pos,
  total,
  onClose,
  onStep,
}: {
  item: Cosmetic;
  pos: number;
  total: number;
  onClose: () => void;
  onStep: (d: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  // Each new item starts at the top of the sheet.
  useEffect(() => {
    ref.current?.querySelector(".wd-ql-box")?.scrollTo({ top: 0 });
  }, [item.id]);

  const onKey = (e: KeyboardEvent) => {
    if (total < 2) return;
    if (e.key === "ArrowRight") onStep(1);
    if (e.key === "ArrowLeft") onStep(-1);
  };

  return (
    <dialog
      ref={ref}
      className="wd-ql"
      aria-labelledby="wd-ql-name"
      onClose={onClose}
      onKeyDown={onKey}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ "--c": item.color } as CSSProperties}
    >
      <div className="wd-ql-box">
        <div className="wd-ql-art">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- quick-look art.
            <img key={item.id} src={item.image} alt={item.imageAlt} decoding="async" />
          ) : (
            <div className="wd-noart">No official art has been published for this one.</div>
          )}
        </div>
        <div className="wd-ql-body">
          <p className="wd-stage-kicker">
            {item.isNew && <span className="wd-new">New</span>}
            <span>{item.kind}</span>
            <span>Version {item.version}</span>
          </p>
          <h2 id="wd-ql-name" className="wd-ql-name">
            {item.name}
          </h2>
          <p className="wd-stage-for">
            for{" "}
            {item.characterSlug ? (
              <Link href={`/characters/${item.characterSlug}`}>{item.character}</Link>
            ) : (
              <strong>{item.character}</strong>
            )}
          </p>
          <p className="wd-ql-desc">{item.description}</p>
          <div className="wd-ql-avail">
            <span className="wd-label">How to get</span>
            <p>{item.availability}</p>
          </div>
          {item.sources.length > 0 && (
            <div className="wd-ql-sources">
              <span className="wd-label">Sources</span>
              <ul>
                {item.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.host}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.image && <p className="wd-ql-credit">Art: {item.imageCredit}</p>}
        </div>
      </div>

      <div className="wd-ql-bar">
        {total > 1 && (
          <button type="button" className="wd-ql-step" onClick={() => onStep(-1)} aria-label="Previous piece">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <span className="wd-ql-pos">{pos >= 0 ? `${pos + 1} of ${total}` : ""}</span>
        {total > 1 && (
          <button type="button" className="wd-ql-step" onClick={() => onStep(1)} aria-label="Next piece">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <button type="button" className="wd-ql-close" onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  );
}
