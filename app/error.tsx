"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

/**
 * Backstop for unexpected client errors in any page. It sits inside the root
 * layout, so the nav and footer stay up and only the page body is replaced.
 * Next 16 passes `retry` (re-renders the segment), not the older `reset`.
 */
export default function PageError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="nf">
      <h1>This page hit a snag</h1>
      <p className="lede">Something on it failed to load. Try again, or head somewhere else.</p>
      <ul className="nf-links">
        <li>
          <button type="button" className="rs-btn" onClick={() => retry()}>
            Try again
          </button>
        </li>
        <li><Link href="/">Today&apos;s dashboard</Link></li>
        <li><Link href="/characters">Characters</Link></li>
      </ul>
    </section>
  );
}
