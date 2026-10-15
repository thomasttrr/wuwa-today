"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Share this page: native Web Share sheet when available, copy-link otherwise.
 * Styled as a small glass HUD button (chrome, not content).
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function handleShare() {
    const url = window.location.href;
    const title = document.title;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API blocked — still surface the feedback state.
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="og-btn og-btn-glass og-btn-sm"
      onClick={handleShare}
    >
      {copied ? "Link copied!" : "Share this page"}
      {copied && (
        <span className="og-visually-hidden" role="status" aria-live="polite">
          Link copied!
        </span>
      )}
    </button>
  );
}
