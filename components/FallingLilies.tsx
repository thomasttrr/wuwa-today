import type { CSSProperties } from "react";

/**
 * FallingLilies — a light drift of lily petals for Lily's launch.
 * Pure CSS animation (styles in app/resonance.css), no client JS, and
 * the layer hides entirely under prefers-reduced-motion. Petal layout
 * is deterministic (seeded from the index) so the static export renders
 * identical markup on every build — no Math.random, no hydration drift.
 */

const TONES = ["#fdf6f9", "#f9dce9", "#f5c6da", "#fdf6f9", "#f9dce9", "#f6d789"];

type Petal = {
  left: number;
  size: number;
  fall: number;
  delay: number;
  sway: number;
  drift: number;
  spin: number;
  tone: string;
  opacity: number;
};

function petalAt(i: number): Petal {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: 3 + r(1) * 94,
    size: 14 + Math.round(r(2) * 14),
    fall: 11 + r(3) * 8,
    delay: -r(4) * 18,
    sway: 2.6 + r(5) * 2.2,
    drift: 16 + r(6) * 28,
    spin: -38 + Math.round(r(7) * 76),
    tone: TONES[i % TONES.length],
    opacity: 0.5 + r(8) * 0.45,
  };
}

export default function FallingLilies({ count = 12 }: { count?: number }) {
  const petals = Array.from({ length: count }, (_, i) => petalAt(i));
  return (
    <div className="fl-layer" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="fl-fall"
          style={
            {
              left: `${p.left}%`,
              "--fl-fall": `${p.fall}s`,
              "--fl-delay": `${p.delay}s`,
            } as CSSProperties
          }
        >
          <svg
            className="fl-sway"
            style={
              {
                "--fl-sway": `${p.sway}s`,
                "--fl-drift": `${p.drift}px`,
                "--fl-spin": `${p.spin}deg`,
              } as CSSProperties
            }
            width={p.size}
            height={Math.round(p.size * 1.4)}
            viewBox="0 0 40 56"
            fill="none"
          >
            <path
              d="M20 1 C30 12 35 24 33 34 C31 45 26 51 20 55 C14 51 9 45 7 34 C5 24 10 12 20 1 Z"
              fill={p.tone}
              fillOpacity={p.opacity}
            />
            <path
              d="M20 7 C19.2 20 19.2 36 20 49"
              stroke="#df9dbc"
              strokeOpacity={0.4 * p.opacity}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
