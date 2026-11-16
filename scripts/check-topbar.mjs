#!/usr/bin/env node
// Top-bar fit check. Run `npm run build` first. For 11 widths (1920 down to 390 px) and two music
// labels (the longest, Southeast Asia, and Europe), the top bar must keep every control on screen,
// the brand clear of the search box, no overlapping buttons and 中文 on one line.
//   node scripts/check-topbar.mjs        SHOTS_OUT=dir overrides docs/screenshots/pr-music-polish
import { chromium } from 'playwright';
import path from 'node:path';
const OUT = process.env.SHOTS_OUT ?? 'docs/screenshots/pr-music-polish';
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['vite', 'preview', '--port', '4184', '--strictPort'], { stdio: 'pipe' });
await new Promise((r) => srv.stdout.on('data', (d) => String(d).includes('4184') && r()));
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
let bad = 0;
for (const w of [1920, 1600, 1440, 1366, 1280, 1200, 1181, 1100, 900, 768, 390]) {
  for (const region of ['Southeast Asia', 'Europe']) {
    const p = await b.newPage({ viewport: { width: w, height: 800 } });
    await p.goto('http://localhost:4184/');
    await p.locator('.btn-primary:not([disabled])').click({ timeout: 60000 });
    await p.waitForTimeout(5000);
    const chip = p.getByRole('button', { name: region, exact: true });
    if (await chip.isVisible()) await chip.click();
    await p.waitForTimeout(6000);
    const r = await p.evaluate(() => {
      const box = (s) => document.querySelector(s)?.getBoundingClientRect();
      const ctrls = [...document.querySelectorAll('.topbar .controls > *')].map((e) => e.getBoundingClientRect());
      const brand = box('.topbar .brand'), search = box('.search-trigger'), regions = box('.regions');
      const lab = document.querySelector('.music-label');
      const zh = [...document.querySelectorAll('.topbar .controls > *')].find((e) => /中文|EN/.test(e.textContent));
      return {
        rightmost: Math.max(...ctrls.map((c) => c.right)), vw: innerWidth,
        brandOverSearch: brand.right > search.left + 1 && brand.top < search.bottom && search.top < brand.bottom,
        zhWrapped: zh ? zh.getBoundingClientRect().height > 44 : false,
        overlap: ctrls.some((c, i) => i && c.left < ctrls[i - 1].right - 1) || (regions && ctrls[0].left < regions.right - 1 && ctrls[0].top < regions.bottom && regions.top < ctrls[0].bottom),
        label: lab && getComputedStyle(lab).display !== 'none' ? `${lab.textContent} ${lab.clientWidth}/${lab.scrollWidth}` : 'hidden',
        search: document.querySelector('.search-trigger span') ? Math.round(document.querySelector('.search-trigger span').getBoundingClientRect().width) : '-',
      };
    });
    const ok = r.rightmost <= r.vw && !r.brandOverSearch && !r.zhWrapped && !r.overlap;
    if (!ok) bad++;
    console.log(`${ok ? '✓' : '✗'} ${w} ${region.padEnd(14)} right ${Math.round(r.rightmost)}/${r.vw} search ${r.search}px label ${r.label}${r.brandOverSearch ? ' BRAND-OVER-SEARCH' : ''}${r.zhWrapped ? ' ZH-WRAP' : ''}${r.overlap ? ' OVERLAP' : ''}`);
    if (region === 'Southeast Asia' && [1440, 1366, 1280, 1200].includes(w)) await p.screenshot({ path: path.join(OUT, `topbar-${w}.png`), clip: { x: 0, y: 0, width: w, height: 80 } });
    await p.close();
  }
}
await b.close(); srv.kill(); process.exit(bad ? 1 : 0);
