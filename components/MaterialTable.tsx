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
  "Reverie Lily": "/images/items/reverie-lily.png",
  "Abyssal Husk": "/images/items/abyssal-husk.png",
  "Afterlife": "/images/items/afterlife.png",
  "Arithmetic Shell": "/images/items/arithmetic-shell.png",
  "Autopuppet Kernel": "/images/items/ff-autopuppet-kernel.png",
  "Bamboo Iris": "/images/items/bamboo-iris.png",
  "Belle Poppy": "/images/items/belle-poppy.png",
  "Blazing Bone": "/images/items/blazing-bone.png",
  "Blighted Crown of Puppet King": "/images/items/blighted-crown-of-puppet-king.png",
  "Bloodleaf Viburnum": "/images/items/bloodleaf-viburnum.png",
  "Bloom of Hearkening": "/images/items/bloom-of-hearkening.png",
  "Burning Judgement": "/images/items/burning-judgment.png",
  "Burning Judgment": "/images/items/burning-judgment.png",
  "Cadence Seed / Bud / Leaf / Blossom": "/images/items/cadence-blossom.png",
  "Carved Crystal": "/images/items/ff-carved-crystal.png",
  "Cleansing Conch": "/images/items/cleansing-conch.png",
  "Cloudperch Seed": "/images/items/cloudperch-seed.png",
  "Coriolus": "/images/items/coriolus.png",
  "Curse of the Abyss": "/images/items/curse-of-the-abyss.png",
  "Dream of Stars": "/images/items/dream-of-stars.png",
  "Edelschnee": "/images/items/edelschnee.png",
  "Elegy Tacet Core": "/images/items/elegy-tacet-core.png",
  "Exoswarm Pendant": "/images/items/intact-exoswarm-pendant.png",
  "Firecracker Jewelweed": "/images/items/firecracker-jewelweed.png",
  "Flowborne Dream": "/images/items/flowborne-dream.png",
  "Gemini Spore": "/images/items/gemini-spore.png",
  "Gold in Memory": "/images/items/gold-in-memory.png",
  "Gold-Dissolving Feather": "/images/items/gold-dissolving-feather.png",
  "Golden Fleece": "/images/items/golden-fleece.png",
  "Group Abomination Tacet Core": "/images/items/group-abomination-tacet-core.png",
  "Helix": "/images/items/presto-helix.png",
  "Hidden Thunder Tacet Core": "/images/items/hidden-thunder-tacet-core.png",
  "Iris": "/images/items/iris.png",
  "Lanternberry": "/images/items/lanternberry.png",
  "Loong's Pearl": "/images/items/loongs-pearl.png",
  "Luminous Calendula": "/images/items/luminous-calendula.png",
  "Metallic Drip": "/images/items/heterized-metallic-drip.png",
  "Monument Bell": "/images/items/monument-bell.png",
  "Moss Amber": "/images/items/moss-amber.png",
  "Mysterious Code": "/images/items/mysterious-code.png",
  "Nightmare Flashdrive": "/images/items/nightmare-flashdrive.png",
  "Nova": "/images/items/nova.png",
  "Our Choice": "/images/items/our-choice.png",
  "Past Reveries": "/images/items/past-reveries.png",
  "Pavo Plum": "/images/items/pavo-plum.png",
  "Pecok Flower": "/images/items/pecok-flower.png",
  "Phlogiston": "/images/items/flawless-phlogiston.png",
  "Platinum Core": "/images/items/platinum-core.png",
  "Polygon Core": "/images/items/ff-polygon-core.png",
  "Rage Tacet Core": "/images/items/rage-tacet-core.png",
  "Redbell": "/images/items/redbell.png",
  "Ring": "/images/items/tailored-ring.png",
  "Roaring Rock Fist": "/images/items/roaring-rock-fist.png",
  "Seaside Cendrelis": "/images/items/seaside-cendrelis.png",
  "Sentinel's Dagger": "/images/items/sentinels-dagger.png",
  "Skyward Glazed Heart": "/images/items/skyward-glazed-heart.png",
  "Sliverglow Bloom": "/images/items/sliverglow-bloom.png",
  "Solidarity's Loneflame": "/images/items/solidaritys-loneflame.png",
  "Sound-Keeping Tacet Core": "/images/items/sound-keeping-tacet-core.png",
  "Stone Rose": "/images/items/stone-rose.png",
  "Strife Tacet Core": "/images/items/strife-tacet-core.png",
  "Summer Flower": "/images/items/summer-flower.png",
  "Sword Acorus": "/images/items/sword-acorus.png",
  "Terraspawn Fungus": "/images/items/terraspawn-fungus.png",
  "The Netherworld's Stare": "/images/items/the-netherworlds-stare.png",
  "Thundering Tacet Core": "/images/items/thundering-tacet-core.png",
  "Tidal Residuum": "/images/items/ff-tidal-residuum.png",
  "Topological Confinement": "/images/items/topological-confinement.png",
  "Truth in Lies": "/images/items/truth-in-lies.png",
  "Unending Destruction": "/images/items/unending-destruction.png",
  "Unfading Glory": "/images/items/unfading-glory.png",
  "Violet Coral": "/images/items/violet-coral.png",
  "Waveworn Residue 210 / 226 / 235 / 239": "/images/items/waveworn-residue-239.png",
  "Waveworn Shard": "/images/items/ff-waveworn-shard.png",
  "When Irises Bloom": "/images/items/when-irises-bloom.png",
  "Whisperin Core": "/images/items/ff-whisperin-core.png",
  "Wintry Bell": "/images/items/wintry-bell.png",
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
