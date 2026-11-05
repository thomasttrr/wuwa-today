"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = { label: string; hint: string; href: string };

const PAGES: Entry[] = [
  { label: "Today", hint: "Page", href: "/" },
  { label: "Banners", hint: "Page", href: "/banners" },
  { label: "Events", hint: "Page", href: "/events" },
  { label: "Characters", hint: "Page", href: "/characters" },
  { label: "Pre-Farm", hint: "Page", href: "/pre-farm" },
  { label: "Pull Planner", hint: "Page", href: "/pull-planner" },
  { label: "Tier List", hint: "Page", href: "/tier-list" },
  { label: "Beginner guides", hint: "Page", href: "/beginner" },
  { label: "Plain-words glossary", hint: "Page", href: "/glossary" },
  { label: "Start here", hint: "Beginner guide", href: "/beginner/start-here" },
  { label: "Beginner Convene guide", hint: "Beginner guide", href: "/beginner/convene-guide" },
  { label: "Your first teams", hint: "Beginner guide", href: "/beginner/first-teams" },
  { label: "Mistakes to skip", hint: "Beginner guide", href: "/beginner/mistakes" },
];

// Character / guide / code entries live in lib/search-index.ts (a slim
// generated label/hint/href list) and are lazy-loaded on first open —
// importing the full records here shipped ~680 KB of JSON on every page.

/**
 * ⌘K search (Resonance Trait 5): one palette that jumps to any
 * character, code, page or guide. Opens on Cmd/Ctrl+K or the nav
 * search button ("wuwa:search" event); arrows + Enter navigate,
 * Esc closes. Plain DOM + the router — no library.
 */
export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [dynEntries, setDynEntries] = useState<Entry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const indexRequested = useRef(false);

  const INDEX = useMemo<Entry[]>(() => [...PAGES, ...dynEntries], [dynEntries]);

  const closePalette = () => {
    openRef.current = false;
    setOpen(false);
  };

  const openPalette = () => {
    if (!indexRequested.current) {
      indexRequested.current = true;
      import("@/lib/search-index")
        .then((m) => setDynEntries(m.SEARCH_ENTRIES))
        .catch(() => {});
    }
    setQuery("");
    setCursor(0);
    openRef.current = true;
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Deterministic toggle via the ref mirror — no side effects
        // inside a state updater.
        if (openRef.current) closePalette();
        else openPalette();
      }
    };
    const onOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wuwa:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wuwa:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open ]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDEX.slice(0, 9);
    return INDEX.filter(
      (e) =>
        e.label.toLowerCase().includes(q) || e.hint.toLowerCase().includes(q),
    ).slice(0, 9);
  }, [query, INDEX]);

  // The cursor clamps to whatever the current filter leaves standing.
  const activeCursor = Math.min(cursor, Math.max(0, results.length - 1));

  // Keep the keyboard-selected row in view while arrowing through results.
  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [activeCursor, results]);

  if (!open) return null;

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    closePalette();
    router.push(entry.href);
  };

  return (
    <div
      className="og-search-backdrop"
      onClick={closePalette}
      role="presentation"
    >
      <div
        className="og-search-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search WuWa Today"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="og-search-input"
          type="text"
          value={query}
          placeholder="Search characters, codes, guides…"
          aria-label="Search"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          inputMode="search"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") closePalette();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            }
            if (e.key === "Enter") go(results[activeCursor]);
          }}
        />
        <div className="og-search-list" ref={listRef} role="listbox">
          {results.map((entry, i) => (
            <button
              key={entry.href + entry.label}
              type="button"
              role="option"
              aria-selected={i === activeCursor}
              className={`og-search-item${i === activeCursor ? " is-active" : ""}`}
              onMouseEnter={() => setCursor(i)}
              onClick={() => go(entry)}
            >
              <span>{entry.label}</span>
              <span className="og-search-hint">{entry.hint}</span>
            </button>
          ))}
          {results.length === 0 && (
            <p className="og-search-empty">Nothing matches that yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
