import Image from "next/image";
import type { MaterialEntry } from "@/lib/character-schema";

/**
 * Shared material-list rendering — the mobile-tested pattern from the
 * pre-farm guides: stacked cards with icons, per-tier chips, summed totals,
 * and full farm-location lines.
 *
 * Used by both the pre-farm guides (`app/pre-farm/[slug]/page.tsx`) and the
 * character-detail pages (`app/characters/[slug]/page.tsx`) so the two
 * render identically.
 */

/** Base material name → item icon (Game8 item pages, verified).
 *  Tiered rows ("LF / MF / HF / FF Howler Core") use the highest-tier icon. */
const MATERIAL_ICONS: Record<string, string> = {
  "Howler Core": "/images/items/ff-howler-core.png",
  "Wing Polarizer": "/images/items/layered-wing-polarizer.png",
  "Forged Empyrean's Sigh": "/images/items/forged-empyreans-sigh.png",
  "Miasmic Branch": "/images/items/miasmic-branch.png",
  "Remnant of the Wheel": "/images/items/remnant-of-the-wheel.png",
  "Shell Credits": "/images/items/shell-credit.png",
  "Exoswarm Core": "/images/items/ff-exoswarm-core.png",
  Combustor: "/images/items/reverb-combustor.png",
  "Dreamless Feather": "/images/items/dreamless-feather.png",
  "Forget-Me-Not": "/images/items/forget-me-not.png",
  Rimewisp: "/images/items/rimewisp.png",
  "Mech Core": "/images/items/ff-mech-core.png",
  String: "/images/items/melodic-string.png",
  "Suncoveter's Reach": "/images/items/suncoveters-reach.png",
  "We Who Question": "/images/items/we-who-question.png",
};

export function MaterialIcon({ name }: { name: string }) {
  const src = MATERIAL_ICONS[name];
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={30}
      height={30}
      className="og-material-icon"
    />
  );
}

export type TieredMaterial = {
  base: string;
  tiers: { label: string; qty: string }[];
  total: string;
};

/** "LF / MF / HF / FF Howler Core" + "4 / 12 / 12 / 4"
 *  → { base: "Howler Core", tiers: [{LF,4},{MF,12},…], total: "32" }.
 *  Returns null when the entry isn't tiered or quantities aren't numeric. */
export function parseTiers(
  name: string,
  qty: string
): TieredMaterial | null {
  if (!name.includes(" / ") || !qty.includes(" / ")) return null;
  const nParts = name.split(" / ").map((s) => s.trim());
  const qParts = qty.split(" / ").map((s) => s.trim());
  if (nParts.length !== qParts.length || nParts.length < 2) return null;
  if (qParts.some((q) => Number.isNaN(parseInt(q.replace(/,/g, ""), 10))))
    return null;
  const lastTokens = nParts[nParts.length - 1].split(/\s+/);
  if (lastTokens.length < 2) return null;
  const base = lastTokens.slice(1).join(" ");
  const labels = nParts.map((p, i) =>
    i === nParts.length - 1 ? lastTokens[0] : p
  );
  const total = qParts
    .reduce((s, q) => s + parseInt(q.replace(/,/g, ""), 10), 0)
    .toLocaleString("en-US");
  return {
    base,
    tiers: labels.map((label, i) => ({ label, qty: qParts[i] })),
    total,
  };
}

export function TierChips({
  tiers,
}: {
  tiers: { label: string; qty: string }[];
}) {
  return (
    <div className="og-material-tiers" aria-label="Per-tier quantities">
      {tiers.map((t) => (
        <span key={t.label} className="og-tier-chip">
          {t.label} ×{t.qty}
        </span>
      ))}
    </div>
  );
}

/** The inner rows of a material list — one stacked card per material with
 *  icon, name, summed quantity, tier chips, and farm location. */
export function MaterialRows({ entries }: { entries: MaterialEntry[] }) {
  return (
    <>
      {entries.map((m) => {
        const t = parseTiers(m.name, m.qty);
        return (
          <li key={m.name} className="og-material">
            <div className="og-material-top">
              <MaterialIcon name={t ? t.base : m.name} />
              <span className="og-material-name">
                {t ? t.base : m.name}
              </span>
              <span className="og-material-qty">
                ×{t ? t.total : m.qty}
              </span>
            </div>
            {t && <TierChips tiers={t.tiers} />}
            {m.farm !== "—" && (
              <div className="og-material-farm">{m.farm}</div>
            )}
          </li>
        );
      })}
    </>
  );
}

export default function MaterialTable({
  entries,
}: {
  entries: MaterialEntry[];
}) {
  return (
    <div className="og-materials">
      <div className="og-materials-group">
        <ol className="og-materials-list">
          <MaterialRows entries={entries} />
        </ol>
      </div>
    </div>
  );
}
