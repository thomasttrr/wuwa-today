"use client";

import { useEffect, useState } from "react";
import { getThemeMode, setThemeMode, THEME_EVENT, type ThemeMode } from "@/lib/theme-mode";

/** Appearance control: element colours on character pages, or gold everywhere. Stored values stay "resonance" / "dark". */
export default function ThemeSwitch() {
  const [mode, setMode] = useState<ThemeMode>("resonance");

  useEffect(() => {
    const sync = () => setMode(getThemeMode());
    sync();
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  // Plain labels: the old "Element / Neutral" only made sense if you already
  // knew the accent follows the live banner's element.
  const options: { key: ThemeMode; label: string; hint: string }[] = [
    { key: "resonance", label: "Element colors", hint: "Gold site-wide; character pages take their element's color" },
    { key: "dark", label: "Gold only", hint: "Gold everywhere, including character pages" },
  ];

  return (
    <div className="ts" role="radiogroup" aria-label="Accent color">
      <span className="ts-label">Accent color</span>
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
