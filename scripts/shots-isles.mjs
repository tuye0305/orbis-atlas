#!/usr/bin/env node
// Screenshots of the Brush Isles game in each of its four styles. Needs the dev server (the
// game's `window.__isle` paint hook only exists in dev builds):
//   npm run dev -- --port 5194 &   node scripts/shots-isles.mjs [http://localhost:5194] [outDir]
// For each city it opens the game, shows the intro, paints a small showcase town through the
// hook, and captures the build, a close-up and the result screen.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] ?? 'http://localhost:5194';
const OUT = path.resolve(process.argv[3] ?? path.join(ROOT, 'docs', 'screenshots', 'pr-isles'));
fs.mkdirSync(OUT, { recursive: true });

/** Paint programs, run in the page with the dev hook `I` (paint, landmark, view). */
const PROGRAMS = {
  tenochtitlan: `
    for (const [x, z] of [[-3, 0], [3, 0], [0, 3], [0, -3], [-4, 3], [4, -3], [3, 4], [-4, -3], [5, 1], [-5, -1]]) I.paint('land', x, z, 0.8, 2);
    for (const [x, z] of [[-2, 1], [2, -1], [1, 3], [-3, -2], [3, 2], [-1, -3], [4, -1], [-4, 1]]) I.paint('houses', x, z, 0.7, 1);
    for (const [x, z] of [[-9, 2], [9, -2], [8, 5], [-8, -5], [2, 9], [-2, -9], [6, -7]]) I.paint('fields', x, z, 0.9, 1);
    for (const [x, z] of [[-6, -5], [6, 5], [-6, 6]]) I.paint('trees', x, z, 0.7, 0);
    for (let x = -14; x <= -6; x += 1) I.paint('land', x, 0.5, 0.25, 0);
    I.landmark(0.5, 0.5);
  `,
  kaifeng: `
    const rz = (x) => 0.32 * x + 2.6 * Math.sin(x * 0.2) - 1;
    for (let x = -9; x <= 9; x += 2) { I.paint('houses', x, rz(x) + 2.4, 0.7, 1); I.paint('houses', x, rz(x) - 2.4, 0.7, 1); }
    for (const [x, z] of [[-4, 7], [5, -8], [9, 4], [-10, -4]]) I.paint('trees', x, z, 0.8, 1);
    I.paint('water', 3, 4, 0.9, 0); I.paint('water', 3, 6, 0.9, 0);
    I.landmark(-6, 6);
  `,
  raiatea: `
    for (const a of [0.2, 0.9, 1.6, 2.3, 3.0, 3.7, 4.4, 5.1, 5.8]) { const x = -1 + Math.cos(a) * 6.6, z = -1 + Math.sin(a) * 6.6; I.paint('houses', x, z, 0.45, 0); }
    for (const [x, z] of [[-4, -4], [2, -5], [3, 2]]) I.paint('fields', x, z, 0.5, 0);
    for (const [x, z] of [[-13.6, -1], [9, 8], [-8, 10]]) I.paint('land', x, z, 0.7, 0);
    for (const [x, z] of [[-13.6, -1], [9, 8], [-8, 10]]) I.paint('trees', x, z, 0.7, 0);
    I.landmark(-1, 6.6);
  `,
  amsterdam: `
    const rx = (z) => 1.6 * Math.sin(z * 0.16);
    for (let z = -3; z <= 11; z += 1) { I.paint('houses', rx(z) + 2.3, z, 0.35, 0); I.paint('houses', rx(z) - 2.3, z, 0.35, 0); }
    for (let z = -1; z <= 10; z += 1) I.paint('water', -6.5, z, 0.5, 0);
    for (let z = 0; z <= 9; z += 1) { I.paint('houses', -4.6, z, 0.3, 0); I.paint('houses', -8.4, z, 0.3, 0); }
    for (const [x, z] of [[8, 12], [-8, 13], [2, 14]]) I.paint('fields', x, z, 1, 2);
    I.landmark(6, 3);
  `,
};
const VIEWS = {
  tenochtitlan: { wide: [0.62, 0.6, 30, 0, 1], close: [0.35, 0.42, 14, 0, 2] },
  kaifeng: { wide: [0.9, 0.6, 26, 0, 0], close: [1.25, 0.4, 13, 1, 0] },
  raiatea: { wide: [0.3, 0.48, 32, 0, 1], close: [0.15, 0.36, 15, -1, 5] },
  amsterdam: { wide: [0.5, 0.58, 26, 0, 3], close: [0.95, 0.34, 12, 2, 4] },
};

const only = process.env.ONLY?.split(',');
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const failures = [];
for (const [style, prog] of Object.entries(PROGRAMS)) {
  if (only && !only.includes(style)) continue;
  for (const lang of style === 'kaifeng' ? ['en', 'zh'] : ['en']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(m.text()));
    await page.goto(`${BASE}/?game=isle-${style}&lang=${lang}`);
    await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 60000 });
    await page.locator('.gp-primary').waitFor({ timeout: 30000 });
    await page.waitForTimeout(1200);
    const sfx = lang === 'en' ? '' : `-${lang}`;
    if (lang === 'en') await page.screenshot({ path: path.join(OUT, `${style}-intro.png`) });
    await page.locator('.gp-primary').click();
    await page.waitForFunction(() => window.__isle, null, { timeout: 30000 });
    await page.waitForTimeout(2500);
    if (lang === 'en') await page.screenshot({ path: path.join(OUT, `${style}-start.png`) });
    await page.evaluate(`(() => { const I = window.__isle; ${prog} })()`);
    await page.evaluate(([v]) => window.__isle.view(...v), [VIEWS[style].wide]);
    await page.waitForTimeout(9000);
    const stats = await page.evaluate(() => window.__isle.stats());
    await page.screenshot({ path: path.join(OUT, `${style}-built${sfx}.png`) });
    if (lang === 'en') {
      await page.evaluate(([v]) => window.__isle.view(...v), [VIEWS[style].close]);
      await page.keyboard.press('h');
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT, `${style}-close.png`) });
      await page.keyboard.press('h');
      await page.evaluate(() => window.__isle.finish());
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT, `${style}-result.png`) });
    }
    console.log(`${errors.length ? '✗' : '✓'} ${style} ${lang}  ${JSON.stringify(stats)}${errors.length ? `\n  errors: ${errors.join(' | ')}` : ''}`);
    if (errors.length) failures.push(style);
    await page.close();
  }
}
// phone portrait, one city
if (!only || only.includes('phone')) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/?game=isle-tenochtitlan&lang=en`);
  await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 60000 });
  await page.locator('.gp-primary').waitFor({ timeout: 30000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'phone-intro.png') });
  await page.locator('.gp-primary').click();
  await page.waitForFunction(() => window.__isle, null, { timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.evaluate(`(() => { const I = window.__isle; ${PROGRAMS.tenochtitlan} })()`);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUT, 'phone-built.png') });
  await page.close();
}
await browser.close();
if (failures.length) {
  console.error(`errors in: ${failures.join(', ')}`);
  process.exit(1);
}
