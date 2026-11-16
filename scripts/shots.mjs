#!/usr/bin/env node
// Smoke test + screenshots. Starts `vite preview` on a built app (run `npm run build` first),
// opens several deep links in headless Chromium, checks for console errors and rendered
// markers, and writes docs/screenshots/*.png.
//   npm run shots
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4179;
const BASE = `http://localhost:${PORT}`;

const SHOTS = [
  { name: '01-europe-1066', q: '?year=1066&lang=en', region: 'Europe' },
  { name: '02-constantinople-1453', q: '?year=1453&lang=en&place=place-istanbul' },
  { name: '03-mansa-musa-journey', q: '?year=1324&lang=en&person=person-mansa-musa' },
  { name: '04-tang-zh', q: '?year=741&lang=zh', region: '东亚' },
  { name: '05-west-asia-1187', q: '?year=1187&lang=en', region: 'West Asia' },
  { name: '06-napoleon-1812', q: '?year=1812&lang=en&person=person-napoleon' },
  { name: '07-south-asia-1600', q: '?year=1600&lang=en', region: 'South Asia' },
  { name: '08-search', q: '?year=1500&lang=en', search: 'Ibn' },
];

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const failures = [];
try {
  for (const s of SHOTS) {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
    await page.goto(BASE + s.q);
    await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });
    await page.waitForTimeout(3800);
    if (s.region) {
      await page.getByRole('button', { name: s.region, exact: true }).click();
      await page.waitForTimeout(3200);
    }
    if (s.search) {
      await page.keyboard.press('/');
      await page.keyboard.type(s.search, { delay: 40 });
      await page.waitForTimeout(600);
    }
    const markers = await page.locator('.globe-overlay > *').count();
    await page.screenshot({ path: path.join(OUT, `${s.name}.png`) });
    const ok = errors.length === 0 && markers > 0;
    console.log(`${ok ? '✓' : '✗'} ${s.name}  markers=${markers}${errors.length ? `  errors=${errors.join(' | ')}` : ''}`);
    if (!ok) failures.push(s.name);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (failures.length) {
  console.error(`failed: ${failures.join(', ')}`);
  process.exit(1);
}
