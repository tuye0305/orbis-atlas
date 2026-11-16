#!/usr/bin/env node
// Detail-card image check at several window sizes. Run `npm run build` first.
// For each viewport × record it screenshots the open card and asserts that the picture is shown
// whole (not cropped) and that its frame fits within the viewport-relative cap.
//   node scripts/shots-portraits.mjs                    → docs/screenshots/pr-portraits/
//   SHOTS_DIST=/path/to/dist SHOTS_OUT=/tmp/before node scripts/shots-portraits.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.SHOTS_OUT ?? path.join(ROOT, 'docs', 'screenshots', 'pr-portraits');
const DIST = process.env.SHOTS_DIST ?? path.join(ROOT, 'dist');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4181;
const BASE = `http://localhost:${PORT}`;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'short', width: 1280, height: 640 },
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
];
const RECORDS = [
  { name: 'rumi', q: '?lang=zh&person=person-rumi' },
  { name: 'yue-fei', q: '?lang=zh&person=person-yue-fei' },
  { name: 'wang-anshi', q: '?lang=zh&person=person-wang-anshi' },
  { name: 'hastings', q: '?lang=en&event=ev-battle-of-hastings' },
];

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--outDir', DIST], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const failures = [];
try {
  for (const vp of VIEWPORTS) {
    for (const r of RECORDS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
      await page.goto(BASE + r.q);
      await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });
      await page.waitForTimeout(4200);
      const img = page.locator('.card .card-img img');
      await img.waitFor({ timeout: 10000 });
      await page.waitForFunction(() => document.querySelector('.card .card-img img')?.complete);
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const fig = document.querySelector('.card .card-img');
        const el = fig.querySelector('img');
        const f = fig.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        const fit = getComputedStyle(el).objectFit;
        // Size of the painted picture inside the <img> box.
        const k = fit === 'contain' ? Math.min(b.width / el.naturalWidth, b.height / el.naturalHeight) : Math.max(b.width / el.naturalWidth, b.height / el.naturalHeight);
        const pw = el.naturalWidth * k;
        const ph = el.naturalHeight * k;
        return { fit, frame: [Math.round(f.width), Math.round(f.height)], painted: [Math.round(pw), Math.round(ph)], vh: innerHeight };
      });
      // Whole picture visible: the painted image fits inside both the <img> box and the frame.
      const whole = m.painted[0] <= m.frame[0] + 1 && m.painted[1] <= m.frame[1] + 1;
      const capped = m.frame[1] <= Math.max(0.4 * m.vh, 172) + 1;
      const ok = whole && capped;
      const file = `${vp.name}-${r.name}.png`;
      await page.locator('.card').screenshot({ path: path.join(OUT, file) });
      console.log(`${ok ? '✓' : '✗'} ${vp.name} ${r.name}  fit=${m.fit} frame=${m.frame.join('x')} painted=${m.painted.join('x')}${whole ? '' : '  CROPPED'}${capped ? '' : '  TOO TALL'}`);
      if (!ok) failures.push(file);
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
if (failures.length) {
  console.error(`failed: ${failures.join(', ')}`);
  process.exit(1);
}
