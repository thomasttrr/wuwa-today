"use client";

import { useState } from "react";

/** Share this page: native Web Share sheet when available, copy-link otherwise. */
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
    <button type="button" className="share-btn" onClick={handleShare}>
      {copied ? "Link copied!" : "Share this page"}
    </button>
  );
}
