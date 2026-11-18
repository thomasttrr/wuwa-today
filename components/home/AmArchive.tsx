"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchiveRecord } from "@/lib/archive";

type State = "locked" | "verifying" | "open";

const STATUS: Record<State, string> = {
  locked: "Clearance required",
  verifying: "Checking clearance",
  open: "",
};

/**
 * The Federated Cities Archive: a record you have to request. Locked, the
 * text sits under hatched redaction bars; "Request access" runs a short
 * clearance check, then the bars wipe away one record at a time and the
 * stamp thumps down as Declassified. Reduced motion skips straight to open.
 * The text is in the DOM throughout (redaction is visual), so search and
 * screen readers always get it.
 */
export default function AmArchive({
  file,
  title,
  records,
  question,
}: {
  file: string;
  title: string;
  records: ArchiveRecord[];
  question: ArchiveRecord;
}) {
  const [state, setState] = useState<State>("locked");
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const toggle = () => {
    if (state === "verifying") return;
    if (state === "open") {
      setState("locked");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("open");
      return;
    }
    setState("verifying");
    timer.current = window.setTimeout(() => setState("open"), 1550);
  };

  const status = state === "open" ? `${records.length} of ${records.length + 1} records released` : STATUS[state];

  return (
    <div className="am-dossier" data-state={state}>
      <span className="am-dos-tab" aria-hidden="true">
        {file}
      </span>
      <div className="am-dos-head">
        <div className="am-dos-title">
          <span>Historical record</span>
          <b>{title}</b>
        </div>
        <div className="am-stamp" role="status">
          <b>{status}</b>
        </div>
        <button type="button" className="am-btn am-ghost am-dos-btn" onClick={toggle} aria-controls="am-dos-list" disabled={state === "verifying"}>
          {state === "open" ? "Seal the record" : state === "verifying" ? "Verifying" : "Request access"}
        </button>
      </div>
      <div className="am-dos-scan" aria-hidden="true">
        <i />
      </div>
      <ol className="am-dos-list" id="am-dos-list">
        {records.map((r, i) => (
          <li key={r.id} style={{ "--n": i } as React.CSSProperties}>
            <span className="am-rid">{r.id}</span>
            <p>
              <span className="am-rd">{r.text}</span>
            </p>
            <span className="am-src">{r.source}</span>
          </li>
        ))}
        <li className="is-void">
          <span className="am-rid">{question.id}</span>
          <p>
            {question.text}
            <span className="am-nofield">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 2v6M10 12v6M2 10h6M12 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
              <b>No record exists</b>
            </span>
          </p>
          <span className="am-src">{question.source}</span>
        </li>
      </ol>
      <p className="am-dos-foot">Official and in-game sources only. Leaks are kept out of this record.</p>
    </div>
  );
}
