#!/usr/bin/env node
// Validates curated data against data/SCHEMA.md.
//   node scripts/validate-data.mjs            all datasets
//   node scripts/validate-data.mjs europe     one dataset folder
import { readCuratedFiles } from './wd.mjs';

const REGIONS = new Set([
  'europe', 'africa', 'west-asia', 'south-asia', 'central-asia', 'east-asia', 'southeast-asia',
  'north-america', 'mesoamerica', 'south-america', 'oceania',
]);
const EVENT_TYPES = new Set([
  'battle', 'war', 'political', 'founding', 'fall', 'cultural', 'religious', 'science', 'exploration', 'disaster', 'treaty',
]);
const CONF = new Set(['high', 'medium', 'low']);

const only = process.argv[2];
const errors = [];
const warnings = [];
const ids = new Map();

const isL10n = (v) => v && typeof v.en === 'string' && v.en.trim() && typeof v.zh === 'string' && v.zh.trim();
const isYear = (y) => Number.isInteger(y) && y >= -800 && y <= 2030;
const isLat = (v) => typeof v === 'number' && v >= -90 && v <= 90;
const isLon = (v) => typeof v === 'number' && v >= -180 && v <= 180;

const files = readCuratedFiles().filter((f) => !only || f.region === only);
for (const { region: folder, kind, records } of files) {
  if (!Array.isArray(records)) {
    errors.push(`${folder}/${kind}: not an array`);
    continue;
  }
  for (const r of records) {
    const at = `${folder}/${kind}:${r.id ?? '?'}`;
    const err = (m) => errors.push(`${at}: ${m}`);
    const warn = (m) => warnings.push(`${at}: ${m}`);
    if (!r.id || !/^(ev|person|place|polity)-[a-z0-9-]+$/.test(r.id)) err('bad id');
    if (ids.has(r.id)) err(`duplicate id (also in ${ids.get(r.id)})`);
    ids.set(r.id, `${folder}/${kind}`);
    if (r.qid !== undefined && !/^Q\d+$/.test(r.qid)) err('bad qid');
    if (!r.qid) warn('no qid');
    if (!REGIONS.has(r.region)) err(`bad region ${r.region}`);
    if (!isL10n(r.name ?? r.modern)) err('name/modern must be {en, zh}');
    if (r.summary && !isL10n(r.summary)) err('summary must be {en, zh}');
    if (!r.summary) warn('no summary');
    if (r.story !== undefined && !isL10n(r.story)) err('story must be {en, zh}');
    if (r.story && r.story.en.split(/\s+/).length > 260) warn('story longer than 260 words');
    if (!Array.isArray(r.sources) || r.sources.length < 2) warn('fewer than 2 sources');
    for (const s of r.sources ?? []) if (!s.title) err('source without title');
    if (r.confidence && !CONF.has(r.confidence)) err('bad confidence');
    if (kind === 'events') {
      if (!EVENT_TYPES.has(r.type)) err(`bad type ${r.type}`);
      if (!isYear(r.year)) err('bad year');
      if (r.endYear != null && (!isYear(r.endYear) || r.endYear < r.year)) err('bad endYear');
      if (!isLat(r.lat) || !isLon(r.lon)) err('bad lat/lon');
      if (!(r.importance >= 1 && r.importance <= 5)) err('importance 1-5');
      for (const s of r.route ?? []) if (!isYear(s.year) || !isLat(s.lat) || !isLon(s.lon) || !isL10n(s.label)) err('bad route stop');
    }
    if (kind === 'people') {
      if (!isYear(r.born) || !isYear(r.died) || r.died < r.born) err('bad born/died');
      if (!isL10n(r.role)) err('role must be {en, zh}');
      if (!Array.isArray(r.stops) || r.stops.length < 2) warn('fewer than 2 stops');
      let prev = -Infinity;
      for (const s of r.stops ?? []) {
        if (!isYear(s.year) || !isLat(s.lat) || !isLon(s.lon) || !isL10n(s.label)) err('bad stop');
        if (s.year < prev) err('stops not in time order');
        prev = s.year;
      }
    }
    if (kind === 'places') {
      if (!isLat(r.lat) || !isLon(r.lon)) err('bad lat/lon');
      if (!Array.isArray(r.names) || r.names.length < 2) err('names needs ≥2 entries');
      let prev = -Infinity;
      for (const n of r.names ?? []) {
        if (!isYear(n.from) || (n.to !== null && !isYear(n.to))) err('bad name range');
        if (!isL10n(n.name)) err('name entry must be {en, zh}');
        if (n.polity && !isL10n(n.polity)) err('polity must be {en, zh}');
        if (n.from < prev) err('names not in time order');
        prev = n.from;
      }
    }
    if (kind === 'polities') {
      if (!isYear(r.from) || !isYear(r.to) || r.to < r.from) err('bad from/to');
      if (r.capital && !isL10n(r.capital)) err('capital must be {en, zh}');
      for (const ru of r.rulers ?? []) if (!isL10n(ru.name) || !isYear(ru.from) || !isYear(ru.to)) err('bad ruler');
    }
  }
}

// Cross-references
const known = new Set(ids.keys());
for (const { region: folder, kind, records } of files) {
  for (const r of records) {
    for (const p of r.people ?? []) if (!known.has(p)) warnings.push(`${folder}/${kind}:${r.id}: unknown person ${p}`);
    if (r.place && !known.has(r.place)) warnings.push(`${folder}/${kind}:${r.id}: unknown place ${r.place}`);
  }
}

const counts = {};
for (const { region: folder, kind, records } of files) counts[`${folder}/${kind}`] = records.length;
console.table(counts);
for (const w of warnings) console.log(`warn  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
