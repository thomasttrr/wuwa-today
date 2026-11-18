/**
 * The Federated Cities Archive on the home page: what the game itself has
 * shown about the Resonator War, ahead of Version 4.0. Official and in-game
 * sources only; leaks stay on /leaks. The last record is the open question.
 */
export interface ArchiveRecord {
  id: string;
  text: string;
  source: string;
}

export const ARCHIVE_TITLE = "The Resonator War";
export const ARCHIVE_FILE = "FC-ARC / RW";

export const ARCHIVE_RECORDS: ArchiveRecord[] = [
  { id: "RW-01", text: "The war was fought inside the Federated Cities, between ordinary citizens and Resonators.", source: "3.8 special broadcast" },
  { id: "RW-02", text: "Lily served in it as a medic.", source: "Lily, character story" },
  { id: "RW-03", text: "Citizen forces won with Inverse Tacetite, a substance that suppresses Resonator powers.", source: "3.8 quest, A Bouquet for Tomorrow" },
  { id: "RW-04", text: "Promeus, the Sentinel of the Federation, took no action while the war went on.", source: "3.8 quest, A Bouquet for Tomorrow" },
  { id: "RW-05", text: "The Federated Cities were dissolved and the New Federation took their place.", source: "Lily, character story" },
  { id: "RW-06", text: "Resonators in the New Federation remain under strict government control.", source: "3.8 quest, A Bouquet for Tomorrow" },
];

export const ARCHIVE_OPEN_QUESTION = { id: "RW-07", text: "Why Promeus stayed silent", source: "Unanswered" };
