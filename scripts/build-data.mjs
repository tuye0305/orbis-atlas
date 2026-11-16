#!/usr/bin/env node
// Merge curated data + Wikidata/Commons cache → public/data/atlas.json (+ stories.json, the long
// narratives loaded lazily by the detail card), and write the auto-diff report (curated value vs
// Wikidata) per dataset to data/verification/auto-diff/<dataset>.{json,md}.
//   node scripts/build-data.mjs
// The two public files are build outputs (git-ignored); `npm run dev` and `npm run build` regenerate them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAllCaches, readCuratedFiles } from './wd.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
const { wd, img: commons } = loadAllCaches();
// One resolutions file per dataset (data/verification/resolutions/<dataset>.json) so verifiers never collide.
const resDir = path.join(ROOT, 'data/verification/resolutions');
const resolutions = {};
if (fs.existsSync(resDir)) for (const f of fs.readdirSync(resDir)) if (f.endsWith('.json')) Object.assign(resolutions, read(path.join(resDir, f), {}));

const PALETTE = ['#b5523b', '#c98b3a', '#7d8f4e', '#4f7a8c', '#7a5c8e', '#a8645a', '#5f8a73', '#9c7a3c', '#6a6fa0', '#a0526e'];
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function km(aLat, aLon, bLat, bLon) {
  const r = Math.PI / 180;
  const d = Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLon - aLon) * r) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(d));
}

function image(file) {
  if (!file) return undefined;
  const c = commons[file];
  if (!c || c.missing) return undefined;
  return { file, thumb: c.thumb, page: c.page, license: c.license, artist: c.artist };
}

const diffs = [];
const seen = new Map();
const out = { events: [], people: [], places: [], polities: [] };
const stories = {};
const datasets = new Set();

for (const { region: dataset, kind, records } of readCuratedFiles()) {
  for (const raw of records) {
    const r = { ...raw, dataset };
    datasets.add(dataset);
    if (seen.has(r.id)) {
      console.warn(`duplicate id ${r.id} in ${dataset} (also in ${seen.get(r.id)}); skipped — run validate-data`);
      continue;
    }
    seen.set(r.id, dataset);
    const w = r.qid ? wd[r.qid] : undefined;
    const diff = (field, ours, theirs, extra) => {
      const key = `${r.id}:${field}`;
      diffs.push({ key, id: r.id, dataset, kind, field, ours, wikidata: theirs, qid: r.qid, ...extra, resolution: resolutions[key] ?? null });
    };
    if (r.qid && (!w || w.missing)) diff('qid', r.qid, 'missing on Wikidata');
    if (w && !w.missing) {
      r.wiki = w.wiki;
      if (!r.image && w.image) r.image = w.image;
      const coord = w.coord ?? (w.locationQid ? wd[`loc:${w.locationQid}`]?.coord : null);
      if (kind === 'events') {
        const t = w.pointInTime ?? w.start;
        if (t && t.precision >= 9 && Math.abs(t.year - r.year) > 1) diff('year', r.year, t.year);
        if (w.end && r.endYear && w.end.precision >= 9 && Math.abs(w.end.year - r.endYear) > 1) diff('endYear', r.endYear, w.end.year);
      }
      if ((kind === 'events' || kind === 'places') && coord && r.lat != null) {
        const d = km(r.lat, r.lon, coord.lat, coord.lon);
        if (d > 50) diff('coord', [r.lat, r.lon], [coord.lat, coord.lon], { km: Math.round(d) });
      }
      if (kind === 'people') {
        if (w.born && w.born.precision >= 9 && Math.abs(w.born.year - r.born) > 1) diff('born', r.born, w.born.year);
        if (w.died && r.died == null) diff('died', null, w.died.year);
        else if (w.died && w.died.precision >= 9 && Math.abs(w.died.year - r.died) > 1) diff('died', r.died, w.died.year);
      }
      if (kind === 'polities') {
        if (w.start && w.start.precision >= 9 && Math.abs(w.start.year - r.from) > 2) diff('from', r.from, w.start.year);
        if (w.end && w.end.precision >= 9 && Math.abs(w.end.year - r.to) > 2) diff('to', r.to, w.end.year);
      }
    }
    // A verifier's resolution may override a curated value (applied, not just reported).
    for (const [key, res] of Object.entries(resolutions)) {
      if (!key.startsWith(`${r.id}:`) || !res || res.apply === undefined) continue;
      const field = key.slice(r.id.length + 1);
      if (field === 'coord') [r.lat, r.lon] = res.apply;
      else r[field] = res.apply;
    }
    const img = image(r.image);
    if (img) r.image = img;
    else delete r.image;
    if (kind === 'polities' && !r.color) r.color = PALETTE[hash(r.id) % PALETTE.length];
    if (r.story) {
      stories[r.id] = r.story;
      delete r.story;
    }
    out[kind].push(r);
  }
}

out.events.sort((a, b) => a.year - b.year);
out.people.sort((a, b) => a.born - b.born);
out.polities.sort((a, b) => a.from - b.from);

const polityNames = read(path.join(ROOT, 'data/borders/polity-names.json'), {});
const atlas = { generated: new Date().toISOString().slice(0, 10), ...out, polityNames };
fs.mkdirSync(path.join(ROOT, 'public/data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/data/atlas.json'), JSON.stringify(atlas));
fs.writeFileSync(path.join(ROOT, 'public/data/stories.json'), JSON.stringify(stories));

// Report: one file pair per dataset, so pull requests on different datasets never collide.
const diffDir = path.join(ROOT, 'data/verification/auto-diff');
fs.rmSync(diffDir, { recursive: true, force: true });
fs.mkdirSync(diffDir, { recursive: true });
for (const dataset of [...datasets].sort()) {
  const mine = diffs.filter((d) => d.dataset === dataset);
  const open = mine.filter((d) => !d.resolution);
  fs.writeFileSync(path.join(diffDir, `${dataset}.json`), `${JSON.stringify(mine, null, 1)}\n`);
  const lines = [
    `# Auto-diff: ${dataset} — curated values vs Wikidata`,
    '',
    `Generated by \`scripts/build-data.mjs\`. ${mine.length} differences, ${open.length} unresolved.`,
    `Each difference is resolved in \`../resolutions/${dataset}.json\` by a verifier after checking a second independent source.`,
    '',
    '| Record | Field | Ours | Wikidata | Resolution |',
    '| --- | --- | --- | --- | --- |',
    ...mine.map(
      (d) =>
        `| \`${d.id}\` ([${d.qid}](https://www.wikidata.org/wiki/${d.qid})) | ${d.field}${d.km ? ` (${d.km} km)` : ''} | ${JSON.stringify(d.ours)} | ${JSON.stringify(d.wikidata)} | ${d.resolution ? `${d.resolution.verdict}: ${(d.resolution.reason ?? '').replace(/\|/g, '\\|')}` : '**open**'} |`,
    ),
  ];
  fs.writeFileSync(path.join(diffDir, `${dataset}.md`), `${lines.join('\n')}\n`);
}
const open = diffs.filter((d) => !d.resolution);

const kb = (f) => Math.round(fs.statSync(path.join(ROOT, 'public/data', f)).size / 1024);
console.log(
  `atlas.json ${kb('atlas.json')} KB, stories.json ${kb('stories.json')} KB (${Object.keys(stories).length}) · ${out.events.length} events, ${out.people.length} people, ${out.places.length} places, ${out.polities.length} polities · ${diffs.length} diffs (${open.length} open) · ${Object.keys(polityNames).length} border names`,
);
