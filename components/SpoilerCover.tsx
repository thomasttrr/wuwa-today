"use client";

import { useEffect, useRef, useState } from "react";

export const REVEAL_ALL_EVENT = "wuwa:reveal-spoilers";

function EyeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

export function RevealAllSpoilers() {
  return (
    <button
      type="button"
      className="lk-reveal-all"
      onClick={() => window.dispatchEvent(new Event(REVEAL_ALL_EVENT))}
    >
      <EyeIcon />
      Reveal all images
    </button>
  );
}

export default function SpoilerCover({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [on, setOn] = useState(false);
  const [gone, setGone] = useState(false);
  const onRef = useRef(false);

  const reveal = () => {
    if (onRef.current) return;
    onRef.current = true;
    setOn(true);
    window.setTimeout(() => setGone(true), 700);
  };

  useEffect(() => {
    window.addEventListener(REVEAL_ALL_EVENT, reveal);
    return () => window.removeEventListener(REVEAL_ALL_EVENT, reveal);
  });

  return (
    <div className="lk-spoiler" data-on={on}>
      {children}
      {!gone && (
        <button
          type="button"
          className="lk-spoiler-cover"
          onClick={reveal}
          aria-expanded={on}
          aria-label={`Reveal spoiler image: ${label}`}
        >
          <span className="lk-spoiler-scan" aria-hidden />
          <span className="lk-spoiler-inner">
            <span className="lk-spoiler-eye" aria-hidden>
              <EyeOffIcon />
            </span>
            <span className="lk-spoiler-k">Classified · Leaked visual</span>
            <span className="lk-spoiler-t">Spoiler</span>
            <span className="lk-spoiler-pill">Tap to reveal</span>
          </span>
        </button>
      )}
    </div>
  );
}
