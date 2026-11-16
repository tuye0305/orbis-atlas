#!/usr/bin/env node
// Rewrites curated data files in the house style: a JSON array with one record per line, so
// diffs stay one line per changed record.
//   node scripts/fmt-data.mjs              all datasets
//   node scripts/fmt-data.mjs oceania      one dataset folder
import fs from 'node:fs';
import { readCuratedFiles } from './wd.mjs';

export function formatRecords(records) {
  return `[\n${records.map((r) => JSON.stringify(r)).join(',\n')}\n]\n`;
}

const only = process.argv.slice(2);
let changed = 0;
for (const { region, file, records } of readCuratedFiles()) {
  if (only.length && !only.includes(region)) continue;
  const next = formatRecords(records);
  if (fs.readFileSync(file, 'utf8') !== next) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log(`${changed} file(s) reformatted`);
