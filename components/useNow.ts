"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Shared clock store. One 1-second timer drives every live clock on the
 * page; it only runs while at least one component is subscribed and the tab
 * is visible. Each consumer reads a time *bucket* (floor(now / intervalMs)),
 * so React only re-renders it when its own bucket changes — a 30s consumer
 * re-renders twice a minute, not every second.
 */
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function notify() {
  listeners.forEach((l) => l());
}

function startTimer() {
  if (timer !== null || typeof document === "undefined" || document.hidden) return;
  timer = setInterval(notify, 1000);
}

function stopTimer() {
  if (timer === null) return;
  clearInterval(timer);
  timer = null;
}

function onVisibility() {
  if (document.hidden) {
    stopTimer();
  } else {
    // Catch up immediately after a background tab / laptop wake.
    notify();
    startTimer();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", onVisibility);
    startTimer();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      document.removeEventListener("visibilitychange", onVisibility);
      stopTimer();
    }
  };
}

/**
 * useNow — the current time, refreshed at most once per `intervalMs`
 * (default 1000). Returns null on the server and during hydration so
 * statically-exported pages render their placeholder first and stay
 * hydration-safe.
 *
 * Example: `const now = useNow();` for a 1s countdown,
 * `const now = useNow(10_000);` for a slow progress bar.
 */
export default function useNow(intervalMs: number = 1000): Date | null {
  const getSnapshot = useCallback(
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    [intervalMs],
  );
  const bucket = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => (bucket === null ? null : new Date(bucket)), [bucket]);
}

function getServerSnapshot(): number | null {
  return null;
}
