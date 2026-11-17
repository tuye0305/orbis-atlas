#!/usr/bin/env node
// Wikidata / Commons helper.
//
//   node scripts/wd.mjs search "Battle of Hastings"     → candidate QIDs with descriptions
//   node scripts/wd.mjs lookup Q83224 Q7331              → canonical facts per QID
//   node scripts/wd.mjs enrich [dataset…]                → fetch every QID in data/<dataset>/*.json into
//                                                          data/cache/<dataset>/{wikidata,commons}.json
//
// Caches are split per dataset so that parallel pull requests on different datasets never touch
// the same cache file. A QID used by several datasets is simply stored in each of their caches.
//
// Facts come from Wikidata (CC0). Image metadata (license, author) comes from Commons.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache');
const UA = 'OrbisAtlas/0.1 (https://atlas.anyloop.ai; historical atlas)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retries 429/5xx and network errors with exponential backoff plus jitter (several curators may
// query Wikidata at once), honouring Retry-After when the server sends it.
async function getJSON(url, tries = 7) {
  for (let i = 0; i < tries; i++) {
    let wait = 1000 * 2 ** i + Math.random() * 1000;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get('retry-after'));
        if (ra > 0) wait = Math.max(wait, ra * 1000);
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(Math.min(wait, 60000));
    }
  }
}

function parseTime(snak) {
  const v = snak?.datavalue?.value;
  if (!v?.time) return null;
  const m = /^([+-])(\d+)-(\d\d)-(\d\d)/.exec(v.time);
  if (!m) return null;
  const year = (m[1] === '-' ? -1 : 1) * Number(m[2]);
  const precision = v.precision; // 9 = year, 10 = month, 11 = day, 8 = decade, 7 = century
  const date = precision >= 11 ? `${m[2].padStart(4, '0')}-${m[3]}-${m[4]}` : null;
  return { year, date, precision };
}

function bestClaims(claims, pid) {
  const list = claims?.[pid] ?? [];
  const preferred = list.filter((c) => c.rank === 'preferred');
  return (preferred.length ? preferred : list.filter((c) => c.rank !== 'deprecated')).map((c) => c.mainsnak);
}

function firstTime(claims, pids) {
  for (const p of pids) {
    for (const s of bestClaims(claims, p)) {
      const t = parseTime(s);
      if (t) return { ...t, pid: p };
    }
  }
  return null;
}

function zhLabel(labels) {
  return (labels['zh-hans'] || labels['zh-cn'] || labels.zh || labels['zh-hant'] || labels['zh-tw'])?.value ?? null;
}

function compact(entity) {
  if (!entity || entity.missing !== undefined) return { missing: true };
  const c = entity.claims ?? {};
  const coord = bestClaims(c, 'P625')[0]?.datavalue?.value;
  const image = bestClaims(c, 'P18')[0]?.datavalue?.value ?? null;
  const out = {
    label: { en: entity.labels?.en?.value ?? null, zh: zhLabel(entity.labels ?? {}) },
    description: entity.descriptions?.en?.value ?? null,
    coord: coord ? { lat: +coord.latitude.toFixed(4), lon: +coord.longitude.toFixed(4) } : null,
    image,
    pointInTime: firstTime(c, ['P585']),
    start: firstTime(c, ['P580', 'P571']),
    end: firstTime(c, ['P582', 'P576']),
    born: firstTime(c, ['P569']),
    died: firstTime(c, ['P570']),
    instanceOf: bestClaims(c, 'P31').map((s) => s.datavalue?.value?.id).filter(Boolean),
    wiki: {
      en: entity.sitelinks?.enwiki?.title ?? null,
      zh: entity.sitelinks?.zhwiki?.title ?? null,
    },
  };
  // A place's location sometimes sits on P276 (location) instead of P625.
  if (!out.coord) out.locationQid = bestClaims(c, 'P276')[0]?.datavalue?.value?.id ?? null;
  return out;
}

export async function fetchEntities(qids) {
  const result = {};
  for (let i = 0; i < qids.length; i += 50) {
    const batch = qids.slice(i, i + 50);
    const url =
      'https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels|descriptions|claims|sitelinks' +
      `&languages=en|zh|zh-hans|zh-cn|zh-hant|zh-tw&sitefilter=enwiki|zhwiki&ids=${batch.join('|')}`;
    const data = await getJSON(url);
    for (const q of batch) result[q] = compact(data.entities?.[q]);
    await sleep(200);
  }
  return result;
}

export async function fetchCommons(files) {
  const result = {};
  for (let i = 0; i < files.length; i += 40) {
    const batch = files.slice(i, i + 40);
    const titles = batch.map((f) => `File:${f}`).join('|');
    const url =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=480' +
      `&iiextmetadatafilter=LicenseShortName|Artist|UsageTerms&titles=${encodeURIComponent(titles)}`;
    const data = await getJSON(url);
    const norm = new Map((data.query?.normalized ?? []).map((n) => [n.to, n.from]));
    for (const page of Object.values(data.query?.pages ?? {})) {
      const original = (norm.get(page.title) ?? page.title).replace(/^File:/, '');
      const ii = page.imageinfo?.[0];
      if (!ii) {
        result[original] = { missing: true };
        continue;
      }
      const md = ii.extmetadata ?? {};
      const strip = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      result[original] = {
        thumb: ii.thumburl ?? ii.url,
        page: ii.descriptionurl,
        license: strip(md.LicenseShortName?.value) || strip(md.UsageTerms?.value) || null,
        artist: strip(md.Artist?.value).slice(0, 120) || null,
      };
    }
    await sleep(200);
  }
  return result;
}

export function readCuratedFiles() {
  const dataDir = path.join(ROOT, 'data');
  const out = [];
  for (const region of fs.readdirSync(dataDir)) {
    const dir = path.join(dataDir, region);
    if (!fs.statSync(dir).isDirectory() || ['cache', 'verification', 'borders'].includes(region)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      const kind = file.replace('.json', '');
      if (!['events', 'people', 'places', 'polities'].includes(kind)) continue;
      let records;
      try {
        records = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
      } catch (e) {
        console.warn(`skipping ${region}/${file}: ${e.message}`);
        continue;
      }
      out.push({ region, kind, file: path.join(dir, file), records });
    }
  }
  return out;
}

function loadCache(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function saveCache(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const sorted = Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));
  fs.writeFileSync(file, `${JSON.stringify(sorted, null, 1)}\n`);
}

/** Every cached Wikidata entity and Commons file, merged across datasets (plus the legacy single-file cache). */
export function loadAllCaches() {
  const wd = {};
  const img = {};
  const legacyWd = path.join(CACHE_DIR, 'wikidata.json');
  const legacyImg = path.join(CACHE_DIR, 'commons.json');
  Object.assign(wd, loadCache(legacyWd));
  Object.assign(img, loadCache(legacyImg));
  if (fs.existsSync(CACHE_DIR)) {
    for (const d of fs.readdirSync(CACHE_DIR)) {
      const dir = path.join(CACHE_DIR, d);
      if (!fs.statSync(dir).isDirectory()) continue;
      Object.assign(wd, loadCache(path.join(dir, 'wikidata.json')));
      Object.assign(img, loadCache(path.join(dir, 'commons.json')));
    }
  }
  return { wd, img, legacy: [legacyWd, legacyImg].filter((f) => fs.existsSync(f)) };
}

function qidsOf(records) {
  const qids = new Set();
  for (const r of records) {
    if (r.qid) qids.add(r.qid);
    for (const ru of r.rulers ?? []) if (ru.qid) qids.add(ru.qid);
  }
  return [...qids].filter((q) => /^Q\d+$/.test(q));
}

async function enrich({ refresh = false, only = [] } = {}) {
  const pool = refresh ? { wd: {}, img: {}, legacy: [] } : loadAllCaches();
  const { wd, img } = pool;
  const byDataset = new Map();
  for (const { region: dataset, records } of readCuratedFiles()) {
    if (only.length && !only.includes(dataset)) continue;
    if (!byDataset.has(dataset)) byDataset.set(dataset, []);
    byDataset.get(dataset).push(...records);
  }
  const allQids = new Set([...byDataset.values()].flatMap(qidsOf));
  const todo = [...allQids].filter((q) => !wd[q]);
  console.log(`Wikidata: ${allQids.size} QIDs, fetching ${todo.length}`);
  Object.assign(wd, await fetchEntities(todo));
  // Resolve P276 location coordinates one hop away.
  const locs = [...new Set([...allQids].map((q) => wd[q]?.locationQid).filter((q) => q && !wd[`loc:${q}`]))];
  if (locs.length) {
    const loc = await fetchEntities(locs);
    for (const [q, e] of Object.entries(loc)) wd[`loc:${q}`] = { coord: e.coord, label: e.label };
  }

  const filesOf = (records) => {
    const files = new Set();
    for (const r of records) {
      const f = r.image || (r.qid && wd[r.qid]?.image);
      if (f) files.add(f);
    }
    return files;
  };
  const allFiles = new Set([...byDataset.values()].flatMap((rs) => [...filesOf(rs)]));
  const imgTodo = [...allFiles].filter((f) => !img[f]);
  console.log(`Commons: ${allFiles.size} images, fetching ${imgTodo.length}`);
  Object.assign(img, await fetchCommons(imgTodo));

  for (const [dataset, records] of byDataset) {
    const subWd = {};
    for (const q of qidsOf(records)) {
      if (!wd[q]) continue;
      subWd[q] = wd[q];
      const lq = wd[q].locationQid;
      if (lq && wd[`loc:${lq}`]) subWd[`loc:${lq}`] = wd[`loc:${lq}`];
    }
    const subImg = {};
    for (const f of filesOf(records)) if (img[f]) subImg[f] = img[f];
    saveCache(path.join(CACHE_DIR, dataset, 'wikidata.json'), subWd);
    saveCache(path.join(CACHE_DIR, dataset, 'commons.json'), subImg);
    console.log(`  ${dataset}: ${Object.keys(subWd).length} entities, ${Object.keys(subImg).length} images`);
  }
  // Once every dataset has its own cache, the legacy single-file cache is redundant.
  if (!only.length) for (const f of pool.legacy) fs.rmSync(f);
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  if (cmd === 'search') {
    const q = args.join(' ');
    const lang = /[一-鿿]/.test(q) ? 'zh' : 'en';
    const data = await getJSON(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&limit=7&language=${lang}&uselang=en&search=${encodeURIComponent(q)}`,
    );
    for (const s of data.search ?? []) console.log(`${s.id}\t${s.label}\t— ${s.description ?? ''}`);
  } else if (cmd === 'lookup') {
    const res = await fetchEntities(args);
    for (const [q, e] of Object.entries(res)) console.log(q, JSON.stringify(e));
  } else if (cmd === 'enrich') {
    await enrich({ refresh: args.includes('--refresh'), only: args.filter((a) => !a.startsWith('--')) });
  } else {
    console.log('usage: wd.mjs search <text> | lookup <QID…> | enrich [dataset…] [--refresh]');
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
