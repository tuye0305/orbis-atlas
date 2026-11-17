#!/usr/bin/env node
// Responsive screenshots: opens the app at several window sizes and writes PNGs.
//   node scripts/responsive-shots.mjs <baseUrl> <outDir> [prefix]
// Also reports layout problems: top-bar overflow, panels overlapping the top bar or timeline.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [base = 'http://localhost:5188', out = 'docs/screenshots/pr-responsive', prefix = ''] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });

const SIZES = [
  { name: '2200x1200', w: 2200, h: 1200 },
  { name: '1600x1000', w: 1600, h: 1000 },
  { name: '1280x800', w: 1280, h: 800 },
  { name: '1100x760', w: 1100, h: 760 },
  { name: '980x700', w: 980, h: 700 },
  { name: '820x1000', w: 820, h: 1000 },
  { name: '1280x600-short', w: 1280, h: 600 },
  { name: '390x844-phone', w: 390, h: 844, mobile: true },
  { name: '844x390-landscape', w: 844, h: 390, mobile: true },
];
const only = process.env.SIZES?.split(',');
const q = process.env.Q ?? '?year=1066&lang=en&event=ev-battle-of-hastings';

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const s of SIZES.filter((x) => !only || only.includes(x.name))) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base + q);
  await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 60000 });
  await page.waitForTimeout(4500);
  const report = await page.evaluate(() => {
    const r = (sel) => document.querySelector(sel)?.getBoundingClientRect();
    const bar = r('.topbar');
    const nav = document.querySelector('.regions');
    const tl = r('.timeline');
    const issues = [];
    const W = innerWidth;
    for (const el of document.querySelectorAll('.topbar button')) {
      const b = el.getBoundingClientRect();
      if (b.width && (b.right > W + 1 || b.left < -1) && !nav.contains(el)) issues.push(`offscreen: ${el.textContent.trim().slice(0, 20)}`);
    }
    for (const sel of ['.drawer.open .drawer-body', '.card.open']) {
      const p = r(sel);
      if (!p) continue;
      if (p.top < bar.bottom - 1) issues.push(`${sel} under topbar (${Math.round(p.top)} < ${Math.round(bar.bottom)})`);
      if (p.bottom > tl.top + 1) issues.push(`${sel} under timeline (${Math.round(p.bottom)} > ${Math.round(tl.top)})`);
      if (p.height < 120) issues.push(`${sel} too short (${Math.round(p.height)})`);
    }
    return { bar: Math.round(bar.height), navOverflow: nav.scrollWidth - nav.clientWidth, tl: Math.round(tl.height), issues };
  });
  await page.screenshot({ path: path.join(out, `${prefix}${s.name}.png`) });
  console.log(`${s.name}: ${JSON.stringify(report)}${errors.length ? ' errors=' + errors.join('|') : ''}`);
  await page.close();
}
await browser.close();
