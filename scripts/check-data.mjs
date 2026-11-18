#!/usr/bin/env node
/**
 * check-data.mjs — fails the build when the data files would ship a broken
 * page. Runs automatically before `npm run build` (the "prebuild" script),
 * and on its own with `npm run check`. No dependencies.
 *
 * Errors (exit 1) are things that break a page or a link:
 *   - character files: missing required fields, slug/filename mismatch,
 *     unknown element/rarity, missing portrait or weapon icon, a file that
 *     lib/characters.ts doesn't import, a pull verdict pointing at an
 *     unknown banner id
 *   - banners/events: duplicate ids, unparseable dates, end before start,
 *     an event link to a page that doesn't exist, a missing image
 *   - eventById("…") calls in the app that name an event that isn't there
 *   - an active redeem code that is also on the excluded/expired list
 *   - next.config.js and vercel.json redirects disagreeing
 * Warnings are printed but don't fail the build.
 *
 * It checks shape and references only. It never judges game facts.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (...p) => path.join(ROOT, ...p);
const readJson = (p) => JSON.parse(fs.readFileSync(rel(p), "utf8"));
const exists = (p) => fs.existsSync(rel(p));
const publicFile = (url) => exists(path.join("public", decodeURI(url.split("?")[0])));

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// ISO 8601 only (e.g. "2026-12-03T03:59:00+08:00" or "2026-12-03"): Date.parse
// alone accepts sloppy strings like "2026-12-3" that other parsers reject.
const ISO = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
const isDate = (s) => typeof s === "string" && ISO.test(s) && !Number.isNaN(Date.parse(s));

// ---------- banners ----------
const bannersFile = readJson("data/banners.json");
const bannerIds = new Set();
for (const b of bannersFile.banners ?? []) {
  const w = `banners.json ${b.id ?? "(no id)"}`;
  if (!b.id) err(w, "missing id");
  else if (bannerIds.has(b.id)) err(w, "duplicate id");
  bannerIds.add(b.id);
  if (!isDate(b.startsAt)) err(w, `startsAt is not a date: ${b.startsAt}`);
  if (!isDate(b.endsAt)) err(w, `endsAt is not a date: ${b.endsAt}`);
  if (isDate(b.startsAt) && isDate(b.endsAt) && Date.parse(b.endsAt) <= Date.parse(b.startsAt)) err(w, "endsAt is not after startsAt");
  if (!Array.isArray(b.characters) || b.characters.length === 0) err(w, "no characters");
  if (b.image && !publicFile(b.image)) err(w, `image not found in public/: ${b.image}`);
}
for (const h of bannersFile.history ?? []) if (h.id) bannerIds.add(h.id);
const selectorIds = new Set((bannersFile.selectors ?? []).map((s) => s.id));
for (const s of bannersFile.selectors ?? []) {
  const w = `banners.json selector ${s.id}`;
  if (!isDate(s.startsAt) || !isDate(s.endsAt)) err(w, "startsAt/endsAt must be dates");
}
if (!bannersFile._meta?.version) err("banners.json _meta", "missing version");

// ---------- events ----------
const appRoutes = new Set();
(function walk(dir, route) {
  for (const ent of fs.readdirSync(rel(dir), { withFileTypes: true })) {
    if (!ent.isDirectory()) {
      if (ent.name === "page.tsx") appRoutes.add(route || "/");
      continue;
    }
    if (ent.name.startsWith("[")) continue; // dynamic segments checked separately
    walk(path.join(dir, ent.name), `${route}/${ent.name}`);
  }
})("app", "");

const eventIds = new Set();
for (const e of readJson("data/events.json").events ?? []) {
  const w = `events.json ${e.id ?? e.name ?? "(no id)"}`;
  if (!e.id) err(w, "missing id");
  else if (eventIds.has(e.id)) err(w, "duplicate id");
  eventIds.add(e.id);
  if (!isDate(e.startsAt)) err(w, `startsAt is not a date: ${e.startsAt}`);
  if (e.endsAt !== null && e.endsAt !== undefined && !isDate(e.endsAt)) err(w, `endsAt is not a date: ${e.endsAt}`);
  if (isDate(e.startsAt) && isDate(e.endsAt) && Date.parse(e.endsAt) <= Date.parse(e.startsAt)) err(w, "endsAt is not after startsAt");
  if (e.href && e.href.startsWith("/") && !appRoutes.has(e.href.split(/[?#]/)[0])) err(w, `href points at a page that doesn't exist: ${e.href}`);
  if (e.image && !publicFile(e.image)) err(w, `image not found in public/: ${e.image}`);
}

// eventById("...") in app code must name a real event.
(function scan(dir) {
  for (const ent of fs.readdirSync(rel(dir), { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) scan(p);
    else if (/\.tsx?$/.test(ent.name)) {
      for (const m of fs.readFileSync(rel(p), "utf8").matchAll(/eventById\(\s*"([^"]+)"\s*\)/g)) {
        if (!eventIds.has(m[1])) err(p.replace(/\\/g, "/"), `eventById("${m[1]}") — no such event in data/events.json`);
      }
    }
  }
})("app");

// ---------- characters ----------
const ELEMENTS = new Set(["Electro", "Aero", "Havoc", "Spectro", "Glacio", "Fusion"]);
const INTERNAL_BANNER_IDS = new Set(["no-active-banner", "free-story-character"]);
const REQUIRED = ["slug", "name", "game_version", "profile", "pull_verdict", "build", "teams", "teams_meta", "sources"];
const loader = fs.readFileSync(rel("lib/characters.ts"), "utf8");
const charFiles = fs.readdirSync(rel("data/characters")).filter((f) => f.endsWith(".json"));
const slugs = new Set(charFiles.map((f) => f.replace(/\.json$/, "")));

for (const f of charFiles) {
  const w = `data/characters/${f}`;
  let c;
  try {
    c = readJson(`data/characters/${f}`);
  } catch (e) {
    err(w, `invalid JSON (${e.message})`);
    continue;
  }
  for (const k of REQUIRED) if (c[k] === undefined || c[k] === null) err(w, `missing "${k}"`);
  if (c.slug && c.slug !== f.replace(/\.json$/, "")) err(w, `slug "${c.slug}" doesn't match the file name`);
  if (!loader.includes(`@/data/characters/${f}`)) err(w, "not imported in lib/characters.ts, so it has no page");

  const p = c.profile ?? {};
  if (p.element && !ELEMENTS.has(p.element)) err(w, `unknown element "${p.element}"`);
  if (p.rarity !== 4 && p.rarity !== 5) err(w, `rarity must be 4 or 5, got ${p.rarity}`);
  if (!p.portrait_url) err(w, "profile.portrait_url missing");
  else if (!publicFile(p.portrait_url)) err(w, `portrait not found in public/: ${p.portrait_url}`);

  const v = c.pull_verdict ?? {};
  for (const k of ["verdict", "verdict_label", "banner_id", "published_at"]) if (!v[k]) err(w, `pull_verdict.${k} missing`);
  if (v.published_at && !/^\d{4}-\d{2}-\d{2}$/.test(v.published_at)) err(w, `pull_verdict.published_at must be YYYY-MM-DD, got "${v.published_at}"`);
  if (v.banner_id && !bannerIds.has(v.banner_id) && !selectorIds.has(v.banner_id) && !INTERNAL_BANNER_IDS.has(v.banner_id)) {
    err(w, `pull_verdict.banner_id "${v.banner_id}" is not a banner, selector or known internal id`);
  }

  const b = c.build ?? {};
  if (!Array.isArray(b.ranked_weapons) || b.ranked_weapons.length === 0) err(w, "build.ranked_weapons is empty");
  for (const rw of b.ranked_weapons ?? []) if (rw.icon && !publicFile(rw.icon)) err(w, `weapon icon not found in public/: ${rw.icon}`);
  if (!Array.isArray(b.echo_sets) || b.echo_sets.length === 0) err(w, "build.echo_sets is empty");

  for (const t of c.teams ?? []) {
    for (const m of t.members ?? []) {
      if (m.slug && !slugs.has(m.slug)) warn(w, `team "${t.name}" member slug "${m.slug}" has no character file`);
    }
  }
}

// ---------- codes ----------
const codes = readJson("data/codes.json");
const dead = readJson("data/codes-excluded.json");
const deadSet = new Set([...(dead.excluded ?? []), ...(dead.expired ?? [])].map((x) => String(x.code).toUpperCase()));
for (const c of codes.active ?? []) {
  const w = `codes.json ${c.code}`;
  if (deadSet.has(String(c.code).toUpperCase())) err(w, "is active but also listed in codes-excluded.json");
  if (c.expiresAt !== null && c.expiresAt !== undefined && !isDate(c.expiresAt)) err(w, `expiresAt is not a date: ${c.expiresAt}`);
  if (!Array.isArray(c.verifiedBy) || c.verifiedBy.length === 0) warn(w, "no verifiedBy sources");
}

// ---------- redirects: next.config.js must match vercel.json ----------
{
  const require = createRequire(import.meta.url);
  const nextConfig = require(rel("next.config.js"));
  const fromNext = typeof nextConfig.redirects === "function" ? await nextConfig.redirects() : [];
  const fromVercel = exists("vercel.json") ? readJson("vercel.json").redirects ?? [] : [];
  const key = (r) => `${r.source} -> ${r.destination} (${r.permanent ? "308" : "307"})`;
  const a = new Set(fromNext.map(key));
  const b = new Set(fromVercel.map(key));
  for (const k of a) if (!b.has(k)) err("vercel.json", `missing redirect from next.config.js: ${k}`);
  for (const k of b) if (!a.has(k)) err("next.config.js", `missing redirect from vercel.json: ${k}`);
}

// ---------- report ----------
for (const w of warnings) console.warn(`warn  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERROR ${e}`);
  console.error(`\ncheck-data: ${errors.length} error(s). Fix the data above before building.`);
  process.exit(1);
}
console.log(`check-data: OK (${charFiles.length} characters, ${bannerIds.size} banner ids, ${eventIds.size} events, ${codes.active?.length ?? 0} active codes${warnings.length ? `, ${warnings.length} warning(s)` : ""})`);
