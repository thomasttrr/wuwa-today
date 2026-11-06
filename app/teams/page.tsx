import PageHero from "@/components/PageHero";
import type { Metadata } from "next";
import Link from "next/link";
import TeamsExplorer from "@/components/TeamsExplorer";
import { buildTeamsModel } from "@/lib/teams";
import "./teams.css";

export const metadata: Metadata = {
  title: "Best Teams (3.7)",
  description:
    "Wuthering Waves 3.7 team compositions: the best teams overall, this reset's Tower of Adversity and Whimpering Wastes picks, F2P and budget teams — each with a plain line on how the three work together.",
  alternates: { canonical: "/teams" },
};

export default function TeamsPage() {
  const model = buildTeamsModel();
  const total =
    model.general.length +
    model.variants.length +
    model.tower.towers.reduce((n, t) => n + t.teams.length, 0) +
    model.wastes.halves.reduce((n, h) => n + h.teams.length, 0) +
    model.budget.length;

  return (
    <>
      <PageHero kicker={<>Version {model.version} · {model.versionNote} · {total} teams</>} title="Teams">
        Who to field together, and why it works. The best teams overall, this
          reset&apos;s Tower and Whimpering Wastes picks, and teams you can build
          for free. Tap a Resonator in the index to see every team they fit.
      </PageHero>

      <TeamsExplorer model={model} />

      <footer className="tm-foot">
        <p>
          Teams reflect version {model.version} ({model.versionNote.toLowerCase()}). Every slot is shown
          as Main DPS, Sub-DPS, Support. For builds, weapons and echoes, open any
          Resonator&apos;s page from their portrait, or see the{" "}
          <Link href="/tier-list">tier list</Link> for who&apos;s worth building.
        </p>
      </footer>
    </>
  );
}
