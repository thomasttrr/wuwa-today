"use client";

import { useEffect, useState } from "react";
import { getThemeMode, setThemeMode, THEME_EVENT, type ThemeMode } from "@/lib/theme-mode";

/** Quiet appearance control for the footer: Resonance or Dark. */
export default function ThemeSwitch() {
  const [mode, setMode] = useState<ThemeMode>("resonance");

  useEffect(() => {
    const sync = () => setMode(getThemeMode());
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const options: { key: ThemeMode; label: string; hint: string }[] = [
    { key: "resonance", label: "Resonance", hint: "Tuned to the live banner" },
    { key: "dark", label: "Dark", hint: "Neutral, low-color" },
  ];

  return (
    <div className="ts" role="radiogroup" aria-label="Appearance">
      <span className="ts-label">Appearance</span>
      <div className="ts-opts">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={mode === o.key}
            title={o.hint}
            onClick={() => setThemeMode(o.key)}
          >
            <span className={`ts-swatch ts-swatch-${o.key}`} aria-hidden="true" />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
