"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { NowContext } from "./NowProvider";

/**
 * useNow — reads the shared clock broadcast by <NowProvider>.
 *
 * Returns the provider's latest Date, re-rendering the consumer at most
 * every `intervalMs` (default 1000). Returns null on the server and before
 * the provider's first tick, so statically-exported pages render their
 * placeholder first and stay hydration-safe.
 *
 * Example: `const now = useNow();` for a 1s countdown,
 * `const now = useNow(10_000);` for a slow progress bar.
 */
export default function useNow(intervalMs: number = 1000): Date | null {
  const ctx = useContext(NowContext);
  const [snapshot, setSnapshot] = useState<Date | null>(null);
  const lastEmittedRef = useRef(0);

  useEffect(() => {
    if (ctx === null) return;
    const t = ctx.getTime();
    if (lastEmittedRef.current === 0 || t - lastEmittedRef.current >= intervalMs) {
      lastEmittedRef.current = t;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only clock sync: the static export renders a placeholder, the effect swaps in live time after mount to stay hydration-safe.
      setSnapshot(ctx);
    }
  }, [ctx, intervalMs]);

  return snapshot;
}
