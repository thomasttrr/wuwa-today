"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Availability from "./Availability";

export interface AccountPlan {
  key: string;
  title: string;
  profile: string;
  pick: { slug: string; name: string; portrait: string; color: string; label: string; start: string | null; end: string | null };
  note: string;
  also: string;
}

/** One account plan at a time, picked with a segmented control. */
export default function PlannerAccounts({ plans, builtAt }: { plans: AccountPlan[]; builtAt: number }) {
  const [i, setI] = useState(0);
  const p = plans[i];
  return (
    <div className="pp-acc">
      <div className="pp-seg" role="tablist" aria-label="Account type" style={{ "--n": plans.length, "--i": i } as CSSProperties}>
        <span className="pp-seg-thumb" aria-hidden="true" />
        {plans.map((x, j) => (
          <button key={x.key} type="button" role="tab" aria-selected={i === j} onClick={() => setI(j)}>
            {x.title}
          </button>
        ))}
      </div>
      <article key={p.key} className="pp-acc-card" role="tabpanel" aria-label={`${p.title} plan`} style={{ "--c": p.pick.color } as CSSProperties}>
        <p className="pp-acc-profile">{p.profile}</p>
        <div className="pp-acc-pick">
          {/* eslint-disable-next-line @next/next/no-img-element -- 88px portrait. */}
          <img src={p.pick.portrait} alt="" width={88} height={88} />
          <div>
            <p className="pp-acc-label">Ranked pick</p>
            <h3>
              <Link href={`/characters/${p.pick.slug}`}>{p.pick.name}</Link>
            </h3>
            <span className="pp-verdict">{p.pick.label}</span>
            <Availability start={p.pick.start} end={p.pick.end} builtAt={builtAt} />
          </div>
        </div>
        <p className="pp-acc-note">{p.note}</p>
        <p className="pp-acc-also">{p.also}</p>
      </article>
    </div>
  );
}
