"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getThemeMode, setThemeMode, type ThemeMode } from "@/lib/theme-mode";
import { NAV_ITEMS } from "@/lib/nav";
import type { SearchItem } from "./ResonanceNav";

const PAGE_ITEMS: SearchItem[] = NAV_ITEMS.map((i) => ({ kind: "page", label: i.label, href: i.href, hint: i.hint }));

/* Character entries load once per visit, on first open. */
let charactersPromise: Promise<SearchItem[]> | null = null;
function loadCharacters() {
  charactersPromise ??= fetch("/search-index.json")
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<SearchItem[]>;
    })
    .catch((e) => {
      charactersPromise = null;
      throw e;
    });
  return charactersPromise;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [chars, setChars] = useState<SearchItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const retry = useCallback(() => {
    setLoadError(false);
    loadCharacters().then(setChars, () => setLoadError(true));
  }, []);
  useEffect(() => {
    let live = true;
    loadCharacters().then(
      (c) => live && setChars(c),
      () => live && setLoadError(true),
    );
    return () => {
      live = false;
    };
  }, []);
  const items = useMemo(() => PAGE_ITEMS.concat(chars ?? []), [chars]);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  // Appearance toggle as a command: label reflects the mode you'd switch to.
  const [mode] = useState<ThemeMode>(() => (typeof document === "undefined" ? "resonance" : getThemeMode()));
  const themeAction: SearchItem = {
    kind: "action",
    label: mode === "dark" ? "Switch to Element appearance" : "Switch to Neutral appearance",
    href: "#theme",
    hint: "Appearance · theme element neutral dark",
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
          {loadError && (
            <li className="rs-palette-empty">
              Couldn&apos;t load Resonators. Check your connection and{" "}
              <button type="button" className="rs-palette-retry" onClick={retry}>try again</button>.
            </li>
          )}
          {!chars && !loadError && <li className="rs-palette-empty">Loading Resonators…</li>}
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
