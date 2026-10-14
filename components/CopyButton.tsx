"use client";

import { useState } from "react";

/** Copy-to-clipboard button for redeem codes. Morphs to a check on copy. */
export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={`copy-btn${copied ? " copied" : ""}`}
      onClick={copy}
      aria-label={`Copy code ${text}`}
    >
      {copied ? (
        <span className="copy-done" aria-hidden="true">
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
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
    </button>
  );
}
