"use client";

import { useState } from "react";

/**
 * Share this page: native Web Share sheet when available, copy-link otherwise.
 * Styled as a small glass HUD button (chrome, not content).
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

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
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="og-btn og-btn-glass og-btn-sm"
      onClick={handleShare}
    >
      {copied ? "Link copied!" : "Share this page"}
    </button>
  );
}
