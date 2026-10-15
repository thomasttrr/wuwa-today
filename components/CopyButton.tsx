"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copy-to-clipboard button for redeem codes. Morphs to a check on copy.
 * Styled as a small glass HUD button (chrome, not content).
 */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers: select-and-copy via a temp textarea.
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="og-btn og-btn-glass og-btn-sm"
      onClick={copy}
      aria-label={`Copy code ${text}`}
    >
      {copied ? (
        <span aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{ verticalAlign: "-2px", marginRight: "0.35rem" }}
          >
            <path
              d="M3 8.5l3.5 3.5L13 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied!
        </span>
      ) : (
        "Copy"
      )}
      {copied && (
        <span className="og-visually-hidden" role="status" aria-live="polite">
          Copied!
        </span>
      )}
    </button>
  );
}
