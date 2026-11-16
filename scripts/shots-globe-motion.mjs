#!/usr/bin/env node
// Globe motion checks (run `npm run build` first):
//  - a border crossfade filmstrip across a snapshot boundary (1095 → 1105 crosses 1100),
//  - a hovered polity lifting,
//  - main-thread cost per frame while the globe is idle vs. while it turns,
//  - prefers-reduced-motion: the intro lands immediately.
// Writes docs/screenshots/pr-globe-motion/*.png and prints the metrics.
//   node scripts/shots-globe-motion.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'pr-globe-motion');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4181;
const BASE = `http://localhost:${PORT}`;
const ONLY_METRICS = process.argv.includes('--metrics');

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
async function open(q, opts = {}) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, ...opts });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
  await page.goto(BASE + q);
  await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });
  return page;
}

/**
 * Main-thread cost over `ms` (optionally while dragging the globe), from CDP performance
 * counters: script time and style recalcs per frame, plus overlay attribute mutations.
 */
async function frameCost(page, ms, action) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  await page.evaluate(() => {
    window.__muts = 0;
    window.__frames = 0;
    window.__mo = new MutationObserver((l) => (window.__muts += l.length));
    window.__mo.observe(document.querySelector('.globe-overlay'), { attributes: true, subtree: true });
    const f = () => {
      window.__frames++;
      window.__raf = requestAnimationFrame(f);
    };
    f();
  });
  const m0 = await metrics();
  const t0 = Date.now();
  if (action) await action();
  await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
  const m1 = await metrics();
  const { mutations, frames } = await page.evaluate(() => {
    window.__mo.disconnect();
    cancelAnimationFrame(window.__raf);
    return { mutations: window.__muts, frames: window.__frames };
  });
  const per = (k, scale = 1) => +(((m1[k] - m0[k]) * scale) / Math.max(1, frames)).toFixed(3);
  return {
    scriptMsTotal: +((m1.ScriptDuration - m0.ScriptDuration) * 1000).toFixed(1),
    frames,
    scriptMsPerFrame: per('ScriptDuration', 1000),
    styleRecalcsPerFrame: per('RecalcStyleCount'),
    layoutsPerFrame: per('LayoutCount'),
    overlayMutations: mutations,
    markers: await page.locator('.globe-overlay > *').count(),
  };
}

const results = {};
try {
  // 1. Idle vs. moving overlay writes.
  {
    const page = await open('?year=1066&lang=en');
    await page.waitForTimeout(9000); // let the intro flight and the panels settle
    results.idle2s = await frameCost(page, 2000);
    results.drag = await frameCost(page, 1000, async () => {
      await page.mouse.move(900, 500);
      await page.mouse.down();
      for (let i = 0; i < 60; i++) await page.mouse.move(900 - i * 2, 500);
      await page.mouse.up();
    });
    await page.waitForTimeout(3000);
    // Sweep the pointer across Europe: every polity boundary crossed is a hover change.
    results.hoverSweep = await frameCost(page, 3000, async () => {
      for (let i = 0; i <= 60; i++) {
        await page.mouse.move(560 + i * 10, 380 + Math.sin(i / 5) * 120);
        await page.waitForTimeout(25);
      }
    });
    await page.close();
  }
  if (!ONLY_METRICS) {
    // 2. Crossfade filmstrip across the 1100 snapshot.
    const page = await open('?year=1095&lang=en');
    await page.getByRole('button', { name: 'Europe', exact: true }).click();
    await page.waitForTimeout(4500);
    const clip = { x: 520, y: 260, width: 640, height: 420 };
    await page.screenshot({ path: path.join(OUT, 'crossfade-0-before.png'), clip });
    await page.keyboard.press('Shift+ArrowRight');
    let elapsed = 0;
    for (const [i, t] of [[1, 250], [2, 1400]]) {
      await page.waitForTimeout(t - elapsed);
      elapsed = t;
      await page.screenshot({ path: path.join(OUT, `crossfade-${i}-${t}ms.png`), clip });
    }
    // 3. Hover lift on a polity.
    await page.mouse.move(820, 470);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, 'hover-lift.png'), clip });
    await page.close();

    // 4. Journey arcs (comet on the current leg, dotted legs ahead).
    const j = await open('?year=1812&lang=en&person=person-napoleon');
    await j.waitForTimeout(12000);
    await j.screenshot({ path: path.join(OUT, 'journey-napoleon.png'), clip: { x: 300, y: 60, width: 900, height: 760 } });
    await j.close();

    // 5. Mansa Musa's pilgrimage: anchored stop badges and the current-stop ring.
    const g = await open('?year=1312&lang=en&person=person-mansa-musa');
    await g.waitForTimeout(12000);
    await g.screenshot({ path: path.join(OUT, 'journey-mansa-musa.png') });
    await g.close();
  }
  // 6. Reduced motion: the intro must land at once (no 3.2 s swoop).
  {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(`${BASE}?year=1066&lang=en`);
    await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 30000 });
    const positions = () =>
      page.evaluate(() => Object.fromEntries([...document.querySelectorAll('.globe-overlay > .mk-place')].map((e) => [e.dataset.key, e.style.transform])));
    await page.waitForTimeout(500);
    const a = await positions();
    await page.waitForTimeout(1500);
    const b = await positions();
    const keys = Object.keys(b).filter((k) => k in a);
    // With reduced motion the camera is already where the intro would end: places don't move.
    results.reducedMotion = { placesCompared: keys.length, movedAfter500ms: keys.filter((k) => a[k] !== b[k]).length };
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
console.log(JSON.stringify(results, null, 2));
if (errors.length) {
  console.error(`errors: ${errors.join(' | ')}`);
  process.exit(1);
}
