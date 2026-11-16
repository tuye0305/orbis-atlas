#!/usr/bin/env node
// Music check: every track in public/music/manifest.json is served and decodable, enabling music
// starts the current region's track, and flying to another region crossfades to its track.
// Run `npm run build` first. Writes docs/screenshots/pr-music/*.png.
//   node scripts/check-music.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.SHOTS_OUT ?? path.join(ROOT, 'docs', 'screenshots', 'pr-music');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4183;
const BASE = `http://localhost:${PORT}`;
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/music/manifest.json'), 'utf8'));

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const failures = [];
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures.push(msg);
};

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  // Record every media element the player creates so the test can see what is playing.
  await page.addInitScript(() => {
    const seen = [];
    window.__media = seen;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!seen.includes(this)) seen.push(this);
      return play.call(this);
    };
  });
  const playing = () =>
    page.evaluate(() => window.__media.filter((m) => !m.paused).map((m) => ({ src: m.src.split('/').pop(), t: +m.currentTime.toFixed(1) })));

  // 1. Every track decodes (loads metadata) and has the duration the manifest claims.
  await page.goto(`${BASE}/?year=1066&lang=en`);
  for (const [region, tracks] of Object.entries(manifest.regions)) {
    for (const t of tracks) {
      const d = await page.evaluate(
        (src) =>
          new Promise((res) => {
            const a = new Audio(src);
            a.onloadedmetadata = () => res(a.duration);
            a.onerror = () => res(-1);
          }),
        `${BASE}/music/${t.file}`,
      );
      check(Math.abs(d - t.duration) < 2, `${region}: ${t.file} decodes (${d.toFixed(1)}s, manifest ${t.duration}s)`);
    }
  }

  /** Poll until `test(playing)` holds, up to `ms`. Returns the last observation. */
  const until = async (test, ms) => {
    const end = Date.now() + ms;
    let now = await playing();
    while (!test(now) && Date.now() < end) {
      await page.waitForTimeout(250);
      now = await playing();
    }
    return now;
  };

  // 2. Enter with music: one track starts, for the region where the intro lands, and no track
  //    starts for the regions the intro swing passes over on the way.
  await page.locator('.intro .btn-primary:not([disabled])').click({ timeout: 30000 });
  const started = new Set();
  const end = Date.now() + 15000;
  let now = [];
  while (Date.now() < end) {
    now = await playing();
    for (const p of now) started.add(p.src);
    if (now.length === 1 && now[0].t > 2) break;
    await page.waitForTimeout(250);
  }
  const region1 = await page.evaluate(() => document.querySelector('.region-chip.on')?.textContent?.trim());
  check(now.length === 1 && now[0].t > 0 && started.size === 1, `enter with music: ${[...started].join(', ')} started; region chip ${region1}`);
  await page.screenshot({ path: path.join(OUT, 'music-on-intro.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });
  const first = now[0]?.src;

  // 3. Fly to East Asia: both tracks sound during the crossfade, then only East Asia.
  await page.getByRole('button', { name: 'East Asia', exact: true }).click();
  const mid = await until((n) => n.length === 2, 8000);
  check(mid.length === 2, `crossfade overlaps both tracks: ${JSON.stringify(mid)}`);
  now = await until((n) => n.length === 1 && n[0].src.startsWith('east-asia'), 10000);
  check(now.length === 1 && now[0].src.startsWith('east-asia') && now[0].src !== first, `after flying to East Asia: ${JSON.stringify(now)}`);
  await page.screenshot({ path: path.join(OUT, 'music-on-east-asia.png') });

  // 4. Turning music off pauses everything.
  await page.locator('.music-btn').click();
  await page.waitForTimeout(1500);
  now = await playing();
  check(now.length === 0, `music off: ${JSON.stringify(now)}`);
  check(errors.length === 0, `no page errors${errors.length ? `: ${errors.join(' | ')}` : ''}`);
} finally {
  await browser.close();
  server.kill();
}
if (failures.length) process.exit(1);
