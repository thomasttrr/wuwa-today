"use client";

import { useState } from "react";
import Countdown from "./Countdown";
import { SERVER_OPTIONS, nextDailyReset, nextWeeklyReset } from "../lib/data";

/**
 * Daily + weekly reset timers. WuWa resets at 04:00 server time; the visitor
 * picks their server region and the countdowns adjust.
 */
export default function ResetTimers() {
  const [serverId, setServerId] = useState(SERVER_OPTIONS[0].id);
  const server = SERVER_OPTIONS.find((s) => s.id === serverId) ?? SERVER_OPTIONS[0];

  // Recompute each render; Countdown ticks every second on its own.
  const daily = nextDailyReset(server.offsetHours).toISOString();
  const weekly = nextWeeklyReset(server.offsetHours).toISOString();

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <h3 style={{ margin: 0 }}>Reset timers</h3>
        <label style={{ marginLeft: "auto", fontSize: "0.85rem", color: "var(--text-dim)" }}>
          Server{" "}
          <select
            className="server-select"
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            aria-label="Server region for reset timers"
          >
            {SERVER_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid grid-2" style={{ marginTop: "0.9rem" }}>
        <Countdown target={daily} label="Daily reset (04:00 server time)" />
        <Countdown target={weekly} label="Weekly reset (Mon 04:00 server time)" />
      </div>
    </div>
  );
}
