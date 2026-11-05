"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getThemeMode, setThemeMode, type ThemeMode } from "@/lib/theme-mode";

export interface SearchItem {
  kind: "page" | "character" | "action";
  label: string;
  href: string;
  hint: string;
  color?: string;
  image?: string;
}

const NAV = [
  { href: "/", label: "Today" },
  { href: "/banners", label: "Banners" },
  { href: "/events", label: "Events" },
  { href: "/characters", label: "Characters" },
  { href: "/pre-farm", label: "Pre-Farm" },
  { href: "/pull-planner", label: "Planner" },
  { href: "/tier-list", label: "Tier List" },
];

/**
 * ResonanceNav — one glass bar, two homes: a slim top bar on desktop, a
 * floating capsule above the home indicator on mobile (CSS decides).
 * The active-tab highlight glides between tabs on the shared spring.
 * The search button (and ⌘K / Ctrl+K / "/") opens the command palette.
 */
export default function ResonanceNav({ items }: { items: SearchItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const activeIndex = NAV.findIndex((item) => isActive(item.href));

  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeIndex < 0) {
      setPill(null);
      return;
    }
    const tab = () => list.querySelectorAll<HTMLElement>(":scope > a")[activeIndex];
    const measure = () => {
      const t = tab();
      if (!t) return;
      setPill((prev) => {
        const next = { x: t.offsetLeft, w: t.offsetWidth };
        return prev && prev.x === next.x && prev.w === next.w ? prev : next;
      });
    };
    measure();
    const t = tab();
    if (t && list.scrollWidth > list.clientWidth) {
      list.scrollTo({
        left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="rs-nav" aria-label="Primary">
        <Link href="/" className="rs-brand" aria-label="WuWa Today home">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>WuWa Today</span>
        </Link>
        <div ref={listRef} className="rs-tabs">
          {pill && (
            <span
              className="rs-tab-pill"
              aria-hidden="true"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} aria-current={i === activeIndex ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
        <button type="button" className="rs-search-btn" onClick={() => setOpen(true)} aria-label="Search characters and pages">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="rs-search-label">Search</span>
          <kbd>⌘K</kbd>
        </button>
      </nav>
      {open && <CommandPalette items={items} onClose={() => setOpen(false)} />}
    </>
  );
}

function CommandPalette({ items, onClose }: { items: SearchItem[]; onClose: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  // Appearance toggle as a command: label reflects the mode you'd switch to.
  const [mode] = useState<ThemeMode>(() => (typeof document === "undefined" ? "resonance" : getThemeMode()));
  const themeAction: SearchItem = {
    kind: "action",
    label: mode === "dark" ? "Switch to Resonance theme" : "Switch to Dark theme",
    href: "#theme",
    hint: "Appearance · theme dark resonance",
  };

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items.filter((i) => i.kind === "page").concat(items.filter((i) => i.kind === "character").slice(0, 6), [themeAction]);
    return [...items, themeAction]
      .map((i) => {
        const l = i.label.toLowerCase();
        const score = l.startsWith(term) ? 0 : l.includes(term) ? 1 : i.hint.toLowerCase().includes(term) ? 2 : 9;
        return { i, score };
      })
      .filter((r) => r.score < 9)
      .sort((a, b) => a.score - b.score)
      .slice(0, 12)
      .map((r) => r.i);
    // themeAction is rebuilt each render from `mode`, which never changes while open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, items, mode]);

  useEffect(() => {
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  const go = useCallback(
    (item: SearchItem | undefined) => {
      if (!item) return;
      onClose();
      if (item.kind === "action") {
        setThemeMode(getThemeMode() === "dark" ? "resonance" : "dark");
        return;
      }
      router.push(item.href);
    },
    [onClose, router]
  );

  return (
    <dialog
      ref={dialogRef}
      className="rs-palette"
      aria-label="Search"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rs-palette-box">
        <div className="rs-palette-field">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={q}
            placeholder="Search Resonators, guides, tools"
            aria-label="Search"
            aria-controls="rs-palette-list"
            aria-activedescendant={results[sel] ? `rs-opt-${sel}` : undefined}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[sel]);
              }
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="rs-palette-list" role="listbox" className="rs-palette-list">
          {results.length === 0 && <li className="rs-palette-empty">No matches. Try a Resonator name.</li>}
          {results.map((r, i) => (
            <li
              key={r.href}
              id={`rs-opt-${i}`}
              role="option"
              aria-selected={i === sel}
              className="rs-palette-opt"
              style={r.color ? ({ "--opt": r.color } as React.CSSProperties) : undefined}
              onMouseMove={() => setSel(i)}
              onClick={() => go(r)}
            >
              {r.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- tiny 32px thumb in a client-only dialog; export is unoptimized.
                <img src={r.image} alt="" width={32} height={32} loading="lazy" />
              ) : (
                <span className="rs-palette-glyph" aria-hidden="true">{r.kind === "action" ? "◐" : "→"}</span>
              )}
              <span className="rs-palette-label">{r.label}</span>
              <span className="rs-palette-hint">{r.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
