#!/usr/bin/env node
// historical-basemaps GeoJSON → simplified TopoJSON per snapshot (public/data/borders/).
//
//   node scripts/build-borders.mjs <historical-basemaps/geojson> [<jiangshan-map checkout>]
//
// Sources:
//   * World: https://github.com/aourednik/historical-basemaps (GPL-3.0)
//   * China & immediate neighbours (optional, higher fidelity): polity outlines from
//     https://github.com/DeanChensj/jiangshan-map (GPL-3.0). Only its `polities` features are used;
//     its CHGIS-derived prefecture layer is never read (not redistributable).
//     For each world snapshot year, the jiangshan snapshot in force that year is cut into the world
//     layer (world polygons are erased where the China layer covers them).
//   * data/borders/corrections.json: verifier-reviewed renames of anachronistic source labels.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [SRC, JS] = process.argv.slice(2);
if (!SRC) {
  console.error('usage: build-borders.mjs <historical-basemaps/geojson> [<jiangshan-map dir>]');
  process.exit(1);
}
const OUT = path.join(ROOT, 'public', 'data', 'borders');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'orbis-borders-'));
fs.mkdirSync(OUT, { recursive: true });
const corrections = fs.existsSync(path.join(ROOT, 'data/borders/corrections.json'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data/borders/corrections.json'), 'utf8'))
  : {};

// ---------- jiangshan-map (China) ----------
let china = null;
if (JS) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of ['js/map_data.js', 'js/i18n_dict.js']) vm.runInContext(fs.readFileSync(path.join(JS, f), 'utf8'), sandbox);
  const dynasties = sandbox.window.DYNASTY_DATA;
  const dict = sandbox.window.EN_LOCALE.dict;
  const files = new Map();
  for (const dyn of fs.readdirSync(path.join(JS, 'data/atlas'))) {
    const dir = path.join(JS, 'data/atlas', dyn);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.geojson')) files.set(f.replace('.geojson', ''), path.join(dir, f));
  }
  const snapFor = (year) => {
    const d = dynasties.find((x) => year >= x.fromYear && year < x.toYear) ?? dynasties[dynasties.length - 1];
    if (!d.phases?.length) return `s_${d.key}`;
    return (d.phases.find((p) => year < p.until) ?? d.phases[d.phases.length - 1]).snap;
  };
  china = { snapFor, files, dict };
}

function chinaLayer(year) {
  const id = china.snapFor(year);
  const file = china.files.get(id);
  if (!file) return null;
  const cache = new Map();
  const load = (sid) => {
    if (!cache.has(sid)) {
      const fp = china.files.get(sid);
      cache.set(sid, fp ? JSON.parse(fs.readFileSync(fp, 'utf8')) : null);
    }
    return cache.get(sid);
  };
  // A snapshot lists its polities; "s_other/title" entries reuse a feature defined in another snapshot.
  const resolve = (sid, title, depth = 0) => {
    const gj = load(sid);
    if (!gj || depth > 6) return null;
    const own = gj.features.find((f) => f.properties.role && !f.properties.category && f.properties.title === title);
    if (own) return own;
    const ref = (gj.snapshot?.polities ?? []).find((e) => e.endsWith(`/${title}`));
    return ref ? resolve(ref.split('/')[0], title, depth + 1) : null;
  };
  const gj = load(id);
  const picked = [];
  for (const entry of gj.snapshot?.polities ?? []) {
    const [sid, title] = entry.includes('/') ? entry.split('/') : [id, entry];
    const f = resolve(sid, title);
    if (f) picked.push(f);
  }
  const features = [];
  for (const f of picked) {
    const p = f.properties;
    if (!p.role || p.category) continue; // polity outlines only — never prefectures
    const [lon, lat] = p.anchor ?? [0, 0];
    if (lon < 70 || lon > 150 || lat < -12 || lat > 62) continue; // jiangshan's curated core
    const zh = String(p.title).replace(/^s_[a-z0-9_]+\//, '');
    const en = china.dict[zh] ?? china.dict[p.title] ?? zh;
    features.push({
      type: 'Feature',
      geometry: f.geometry,
      properties: { NAME: en, NAME_ZH: zh, SUBJECTO: p.role === 'main' ? 'China' : en, PARTOF: null, BORDERPRECISION: 2, SRC: 'jiangshan', ROLE: p.role },
    });
  }
  return { id, features };
}

// ---------- build ----------
const snapshots = fs
  .readdirSync(SRC)
  .map((f) => /^world_(bc)?(\d+)\.geojson$/.exec(f))
  .filter(Boolean)
  .map((m) => ({ file: m[0], year: m[1] ? -Number(m[2]) : Number(m[2]) }))
  .filter((s) => s.year >= -1 && s.year <= 2010)
  .sort((a, b) => a.year - b.year);

const index = [];
for (const s of snapshots) {
  const out = path.join(OUT, `${s.year}.topo.json`);
  const world = JSON.parse(fs.readFileSync(path.join(SRC, s.file), 'utf8'));
  const fix = corrections[String(s.year)] ?? {};
  world.features = world.features.filter((f) => f.properties?.NAME);
  for (const f of world.features) {
    const c = fix[f.properties.NAME];
    if (c) Object.assign(f.properties, typeof c === 'string' ? { NAME: c } : c);
    const q = f.properties;
    f.properties = { NAME: q.NAME, NAME_ZH: q.NAME_ZH ?? null, SUBJECTO: q.SUBJECTO ?? null, PARTOF: q.PARTOF ?? null, BORDERPRECISION: q.BORDERPRECISION ?? 1, SRC: 'hb', ROLE: null };
  }
  const worldFile = path.join(TMP, `world_${s.year}.json`);
  fs.writeFileSync(worldFile, JSON.stringify(world));
  let cmd;
  let chinaId = null;
  const cn = china ? chinaLayer(s.year) : null;
  if (cn?.features.length) {
    chinaId = cn.id;
    const cnFile = path.join(TMP, `china_${s.year}.json`);
    fs.writeFileSync(cnFile, JSON.stringify({ type: 'FeatureCollection', features: cn.features }));
    cmd = [
      `-i "${worldFile}" "${cnFile}" combine-files`,
      `-simplify 12% weighted keep-shapes target=*`,
      `-clean target=*`,
      `-erase target=world_${s.year} china_${s.year}`,
      `-merge-layers target=* force name=borders`,
      '-each "delete fid"',
      '-filter-slivers min-area=200km2',
      `-o "${out}" format=topojson quantization=1e5 precision=0.001`,
    ].join(' ');
  } else {
    cmd = [
      `-i "${worldFile}" name=borders`,
      '-simplify 12% weighted keep-shapes',
      '-filter-slivers min-area=200km2',
      `-o "${out}" format=topojson quantization=1e5 precision=0.001`,
    ].join(' ');
  }
  await mapshaper.runCommands(cmd);
  const kb = Math.round(fs.statSync(out).size / 1024);
  index.push({ year: s.year, file: `${s.year}.topo.json`, kb, china: chinaId });
  console.log(`${s.year}\t${kb} KB${chinaId ? `\tchina: ${chinaId}` : ''}`);
}
fs.writeFileSync(path.join(OUT, 'index.json'), `${JSON.stringify(index, null, 1)}\n`);
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`${index.length} snapshots, ${index.reduce((a, b) => a + b.kb, 0)} KB total`);
