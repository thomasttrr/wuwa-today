"use client";

import { SEARCH_EVENT } from "@/lib/nav";

/** Opens the command palette from anywhere (ResonanceNav listens). */
export default function SearchButton({ label = "Search the site" }: { label?: string }) {
  return (
    <button type="button" className="rs-btn" onClick={() => window.dispatchEvent(new Event(SEARCH_EVENT))}>
      {label}
    </button>
  );
}
