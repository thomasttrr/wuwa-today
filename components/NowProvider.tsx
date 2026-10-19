"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";

/**
 * The shared clock value. Null on the server and before the first client
 * tick, so statically-exported pages render their placeholders first and
 * stay hydration-safe.
 */
export const NowContext = createContext<Date | null>(null);

/**
 * NowProvider — a single shared 1-second ticker for every live clock on
 * the page. Mount once near the root (app/layout.tsx); countdowns and
 * progress bars read the shared Date via useNow() instead of each owning
 * a setInterval, so every visible timer ticks in lockstep.
 */
export default function NowProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only clock sync: the static export renders placeholders, the effect starts the shared ticker after mount to stay hydration-safe.
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}
