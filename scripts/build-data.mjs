#!/usr/bin/env node
// Merge curated data + Wikidata/Commons cache → public/data/atlas.json,
// and write the auto-diff report (curated value vs Wikidata) to data/verification/.
//   node scripts/build-data.mjs              → also fetches pixel sizes for new Commons files
//   node scripts/build-data.mjs --offline    → never touches the network (unsized images still work)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCuratedFiles } from './wd.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : fallback);
const wd = read(path.join(ROOT, 'data/cache/wikidata.json'), {});
const commons = read(path.join(ROOT, 'data/cache/commons.json'), {});
// Original pixel size per Commons file ([width, height]). Kept in its own cache rather than in
// commons.json, so the shared wd.mjs cache shape (and its re-fetch) is untouched.
const SIZE_CACHE = path.join(ROOT, 'data/cache/commons-size.json');
const sizes = read(SIZE_CACHE, {});
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

/**
 * Commons' Artist field is flattened HTML. It often repeats itself (a visible name plus a hidden
 * copy: "Unknown authorUnknown author") or carries boilerplate around the real name.
 */
export function cleanArtist(raw) {
  if (!raw) return null;
  let s = raw.replace(/&amp;/g, '&').replace(/\[\d+\]/g, '').replace(/\s+/g, ' ').trim();
  const half = s.length / 2;
  if (Number.isInteger(half) && s.slice(0, half) === s.slice(half)) s = s.slice(0, half).trim();
  // A repeated lead-in ("Unknown authorUnknown author Cambridge…"), or a label glued to it ("AnonymousUnknown author").
  s = s.replace(/^(.{4,40}?)\1(?=\s|$)/, '$1').replace(/^(?:Anonymous|Unknown)\s*(Unknown (?:author|artist))\b/i, '$1');
  const assumed = /^No machine-readable author provided\.\s*(.+?)\s+assumed\b/i.exec(s);
  if (assumed) s = assumed[1].replace(/~\w+$/, '');
  // "Source.png: <author> derivative work: …" names the source file first; "User:" is wiki syntax.
  s = s.replace(/^[^:]{1,80}\.(?:png|jpe?g|svg|gif|tiff?):\s*/i, '').replace(/^User:\s*/, '').replace(/\s+User:\s*/g, ', ').trim();
  if (s.length > 60) s = `${s.slice(0, 57).replace(/\s+\S*$/, '')}…`;
  return s || null;
}

/** Fill `sizes` for Commons files it lacks, 50 titles per request. Network failure is not fatal. */
async function fetchSizes(files) {
  const todo = files.filter((f) => !sizes[f]);
  if (!todo.length || process.argv.includes('--offline')) return;
  const UA = 'OrbisAtlas/0.1 (https://github.com/tuye0305/orbis-atlas; open-source historical atlas)';
  try {
    for (let i = 0; i < todo.length; i += 50) {
      const batch = todo.slice(i, i + 50);
      const url =
        'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=size' +
        `&titles=${encodeURIComponent(batch.map((f) => `File:${f}`).join('|'))}`;
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const norm = new Map((data.query?.normalized ?? []).map((n) => [n.to, n.from]));
      for (const page of Object.values(data.query?.pages ?? {})) {
        const ii = page.imageinfo?.[0];
        const original = (norm.get(page.title) ?? page.title).replace(/^File:/, '');
        if (ii?.width && ii?.height) sizes[original] = [ii.width, ii.height];
      }
    }
  } catch (e) {
    console.warn(`commons sizes: ${e.message}; images without a size fall back to measuring on load`);
  }
  const sorted = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => (a < b ? -1 : 1)));
  fs.writeFileSync(SIZE_CACHE, `${JSON.stringify(sorted, null, 0).replace(/\],"/g, '],\n"')}\n`);
}
await fetchSizes(Object.entries(commons).filter(([, c]) => !c.missing).map(([f]) => f));

function image(file) {
  if (!file) return undefined;
  const c = commons[file];
  if (!c || c.missing) return undefined;
  // w/h: the original's pixel size, so the card can reserve the frame before the picture loads
  // and only offer thumbnail widths Commons can actually render (it never upscales).
  const [w, h] = sizes[file] ?? [];
  return { file, thumb: c.thumb, page: c.page, license: c.license, artist: cleanArtist(c.artist), ...(w && h ? { w, h } : {}) };
}

const diffs = [];
const seen = new Map();
const out = { events: [], people: [], places: [], polities: [] };

for (const { region: dataset, kind, records } of readCuratedFiles()) {
  for (const raw of records) {
    const r = { ...raw, dataset };
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
        if (w.died && w.died.precision >= 9 && Math.abs(w.died.year - r.died) > 1) diff('died', r.died, w.died.year);
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

// Report
fs.mkdirSync(path.join(ROOT, 'data/verification'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/verification/auto-diff.json'), `${JSON.stringify(diffs, null, 1)}\n`);
const open = diffs.filter((d) => !d.resolution);
const lines = [
  '# Auto-diff: curated values vs Wikidata',
  '',
  `Generated by \`scripts/build-data.mjs\`. ${diffs.length} differences, ${open.length} unresolved.`,
  'Each difference is resolved in `resolutions/<dataset>.json` by a verifier after checking a second independent source.',
  '',
  '| Record | Field | Ours | Wikidata | Resolution |',
  '| --- | --- | --- | --- | --- |',
  ...diffs.map(
    (d) =>
      `| \`${d.id}\` ([${d.qid}](https://www.wikidata.org/wiki/${d.qid})) | ${d.field}${d.km ? ` (${d.km} km)` : ''} | ${JSON.stringify(d.ours)} | ${JSON.stringify(d.wikidata)} | ${d.resolution ? `${d.resolution.verdict}: ${d.resolution.reason ?? ''}` : '**open**'} |`,
  ),
];
fs.writeFileSync(path.join(ROOT, 'data/verification/AUTO-DIFF.md'), `${lines.join('\n')}\n`);

const size = Math.round(fs.statSync(path.join(ROOT, 'public/data/atlas.json')).size / 1024);
console.log(
  `atlas.json ${size} KB · ${out.events.length} events, ${out.people.length} people, ${out.places.length} places, ${out.polities.length} polities · ${diffs.length} diffs (${open.length} open) · ${Object.keys(polityNames).length} border names`,
);
