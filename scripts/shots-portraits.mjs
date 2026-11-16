#!/usr/bin/env node
// Detail-card image check at several window sizes. Run `npm run build` first.
// For each viewport × record it screenshots the open card and asserts that the picture
//   - is shown whole (not cropped) and its frame fits within the viewport-relative cap,
//   - reserves its final frame before it loads (Commons responses are held back to catch layout shift),
//   - is drawn from a srcset candidate wide enough for the screen's pixel density,
//   - opens in a lightbox that fits the window, closes on Escape and returns focus to the picture.
//   node scripts/shots-portraits.mjs                    → docs/screenshots/pr-portraits/
//   SHOTS_DIST=/path/to/dist SHOTS_OUT=/tmp/before node scripts/shots-portraits.mjs
//   SHOTS_ONLY=phone,rumi node scripts/shots-portraits.mjs   → only matching viewports/records
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.SHOTS_OUT ?? path.join(ROOT, 'docs', 'screenshots', 'pr-portraits');
const DIST = process.env.SHOTS_DIST ?? path.join(ROOT, 'dist');
const ONLY = process.env.SHOTS_ONLY?.split(',');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4181;
const BASE = `http://localhost:${PORT}`;
const DPR = 2;
const HOLD_MS = 1500; // Delay on every Commons response, so the frame can be measured before the picture arrives.

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
  // Extremes: a 155×191 original, the tallest picture (0.38) and the widest (3.7).
  { name: 'taejo', q: '?lang=en&person=person-taejo-of-goryeo' },
  { name: 'basho', q: '?lang=en&person=person-matsuo-basho' },
  { name: 'manila', q: '?lang=en&place=place-manila' },
];
// Lightbox screenshots for these (viewport, record) pairs; every run still checks the lightbox.
const LIGHTBOX_SHOTS = new Set(['desktop-yue-fei', 'desktop-hastings', 'phone-wang-anshi']);

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
      if (ONLY && !ONLY.some((o) => o === vp.name || o === r.name)) continue;
      const id = `${vp.name}-${r.name}`;
      const problems = [];
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: DPR, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
      await page.route(/upload\.wikimedia\.org|thumb\.wikimedia\.org/, async (route) => {
        await new Promise((res) => setTimeout(res, HOLD_MS));
        await route.continue().catch(() => {});
      });
      // Note the frame's height on the first frame it exists, and whether its image was still loading
      // then (a person's picture is usually already cached by its globe marker).
      await page.addInitScript(() => {
        const tick = () => {
          const f = document.querySelector('.card .card-img');
          if (f && window.__firstH === undefined) window.__firstH = f.getBoundingClientRect().height;
          if (f && !f.classList.contains('loaded')) window.__preN = (window.__preN ?? 0) + 1;
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await page.goto(BASE + r.q);
      await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });


      await page.waitForTimeout(4200);
      await page.waitForFunction(() => document.querySelector('.card .card-img')?.classList.contains('loaded'), null, { timeout: 20000 });
      await page.waitForTimeout(500);
      const m = await page.evaluate(() => {
        const f = document.querySelector('.card .card-img');
        const el = f.querySelector('img');
        const fr = f.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        const fit = getComputedStyle(el).objectFit;
        // Size of the painted picture inside the <img> box.
        const k = fit === 'contain' ? Math.min(b.width / el.naturalWidth, b.height / el.naturalHeight) : Math.max(b.width / el.naturalWidth, b.height / el.naturalHeight);
        // naturalWidth is density-corrected under srcset; the file's real width is its w descriptor.
        const cands = (el.srcset || '').split(',').map((c) => c.trim().split(/\s+/)).map(([u, w]) => [new URL(u, location.href).href, Number.parseInt(w, 10)]);
        const widest = Math.max(0, ...cands.map((c) => c[1]));
        const file = cands.find((c) => c[0] === el.currentSrc)?.[1] ?? el.naturalWidth;
        return {
          early: { h: window.__firstH, n: window.__preN ?? 0 },
          fit,
          frame: [fr.width, fr.height],
          painted: [el.naturalWidth * k, el.naturalHeight * k],
          natural: file,
          widest,
          src: el.currentSrc,
          vh: innerHeight,
        };
      });
      const whole = m.painted[0] <= m.frame[0] + 1 && m.painted[1] <= m.frame[1] + 1;
      const capped = m.frame[1] <= Math.max(0.4 * m.vh, 172) + 1;
      if (!whole) problems.push('CROPPED');
      if (!capped) problems.push('TOO TALL');
      // Layout shift: the frame's first size equals its final size.
      if (m.early.h === undefined || Math.abs(m.early.h - m.frame[1]) > 1) problems.push(`SHIFT ${Math.round(m.early.h)}→${Math.round(m.frame[1])}px`);
      // Sharpness: the file is at least as wide as the painted device pixels, or the widest candidate offered.
      const need = Math.round(m.painted[0] * DPR);
      if (m.widest && m.natural < Math.min(need, m.widest) * 0.97) problems.push(`SOFT ${m.natural}px for ${need}px`);

      await page.locator('.card').screenshot({ path: path.join(OUT, `${id}.png`) });

      // Lightbox: opens from the picture, shows it whole inside the window, Escape closes it only.
      await page.locator('.card .card-img-open').click();
      const lb = page.locator('.img-lightbox-box img');
      await lb.waitFor({ timeout: 5000 });
      await page.waitForFunction(() => document.querySelector('.img-lightbox-box img')?.complete, null, { timeout: 20000 });
      await page.waitForTimeout(400);
      const l = await page.evaluate(() => {
        const el = document.querySelector('.img-lightbox-box img');
        const b = el.getBoundingClientRect();
        const box = document.querySelector('.img-lightbox-box').getBoundingClientRect();
        return {
          img: [b.width, b.height],
          ratio: el.naturalWidth / el.naturalHeight,
          inside: box.left >= -1 && box.top >= -1 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1,
          focus: document.activeElement?.className,
          modal: document.querySelector('[role="dialog"][aria-modal="true"]') !== null,
        };
      });
      if (!l.inside) problems.push('LIGHTBOX OFF-SCREEN');
      if (Math.abs(l.img[0] / l.img[1] - l.ratio) > 0.02) problems.push('LIGHTBOX DISTORTED');
      if (l.focus !== 'img-lightbox-close' || !l.modal) problems.push(`LIGHTBOX FOCUS ${l.focus}`);
      if (LIGHTBOX_SHOTS.has(id)) await page.screenshot({ path: path.join(OUT, `lightbox-${id}.png`) });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      const after = await page.evaluate(() => ({
        gone: !document.querySelector('.img-lightbox'),
        card: document.querySelector('.card')?.classList.contains('open'),
        focus: document.activeElement?.className,
      }));
      if (!after.gone || !after.card || after.focus !== 'card-img-open') problems.push(`ESCAPE gone=${after.gone} card=${after.card} focus=${after.focus}`);

      const ok = !problems.length;
      const f = (a) => a.map(Math.round).join('x');
      console.log(`${ok ? '✓' : '✗'} ${vp.name.padEnd(7)} ${r.name.padEnd(10)} frame=${f(m.frame)} painted=${f(m.painted)} file=${m.natural}px/${need}px lightbox=${f(l.img)}${m.early.n ? '' : ' (cached)'}  ${problems.join('  ')}`);
      if (!ok) failures.push(id);
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
