"use client";

import { useState } from "react";
import Countdown from "./Countdown";
import CycleProgress from "./CycleProgress";
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
      <div className="reset-head">
        <h3 className="reset-title">Reset timers</h3>
        <label className="reset-server-label">
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
      <div className="grid grid-2 reset-timers-grid">
        <div>
          <Countdown target={daily} label="Daily reset (04:00 server time)" />
          <CycleProgress target={daily} cycleMs={86_400_000} label="Daily reset cycle" />
        </div>
        <div>
          <Countdown target={weekly} label="Weekly reset (Mon 04:00 server time)" />
          <CycleProgress target={weekly} cycleMs={7 * 86_400_000} label="Weekly reset cycle" />
        </div>
      </div>
    </div>
  );
}
