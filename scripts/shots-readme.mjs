#!/usr/bin/env node
// README media: screenshots and short screen recordings of the built app.
// Run `npm run build` first; needs ffmpeg. Uses the machine's GPU when there is one (ANGLE).
//   node scripts/shots-readme.mjs            all screenshots and videos
//   node scripts/shots-readme.mjs shots      screenshots only
//   node scripts/shots-readme.mjs videos     videos only
// Writes docs/readme/*.jpg, and docs/readme/*.mp4 + a 16 s *.gif preview (GIFs play inline on GitHub).
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'readme');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4190;
const BASE = `http://localhost:${PORT}`;
const only = process.argv[2];
// Optional filter: node scripts/shots-readme.mjs shots name1,name2
const pick = process.argv[3]?.split(',');

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 30000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});
const browser = await chromium.launch({ args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--enable-gpu', '--autoplay-policy=no-user-gesture-required'] });

const wait = (p, ms) => p.waitForTimeout(ms);
/** Open the app at `q`, enter silently and let the intro (and a deep link's flight) land. */
async function open(page, q, { settle = 6500 } = {}) {
  await page.goto(`${BASE}/${q}`);
  await page.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 60000 });
  await wait(page, settle);
}
const chip = (page, name) => page.getByRole('button', { name, exact: true }).click();
async function openGame(page, title) {
  await page.locator('.games-btn').click();
  await page.locator('.games-menu button', { hasText: title }).first().click();
  await wait(page, 2500);
}

/** Leave a game's briefing panel. */
const begin = async (p) => (await p.getByRole('button', { name: 'Begin' }).click(), wait(p, 1500));
/** Brush the first lesson’s stroke along its guide. */
async function brush(p) {
  const { width: w, height: h } = p.viewportSize();
  // Lesson 1 is the dot (侧) at the top of 永: press in along its red guide.
  const strokes = [[[0.676, 0.215], [0.712, 0.3]]];
  for (const [[x0, y0], [x1, y1]] of strokes) {
    await p.mouse.move(w * x0, h * y0);
    await p.mouse.down();
    for (let i = 1; i <= 24; i++) await p.mouse.move(w * (x0 + ((x1 - x0) * i) / 24), h * (y0 + ((y1 - y0) * i) / 24), { steps: 2 });
    await p.mouse.up();
    await wait(p, 500);
  }
}

const SHOTS = [
  { name: 'hero-europe-1066', q: '?year=1066&lang=en', do: async (p) => (await chip(p, 'Europe'), wait(p, 3500)) },
  { name: 'event-hastings', q: '?year=1066&lang=en&event=ev-battle-of-hastings', settle: 8000 },
  { name: 'journey-ibn-battuta', q: '?year=1332&lang=en&person=person-ibn-battuta', settle: 8000 },
  {
    name: 'journey-napoleon-1812',
    q: '?year=1812&lang=en&person=person-napoleon',
    settle: 8000,
    // Step the journey on to the invasion of Russia.
    do: async (p) => {
      for (let i = 0; i < 20 && +new URL(p.url()).searchParams.get('year') < 1812; i++) {
        await p.keyboard.press('ArrowRight');
        await wait(p, 900);
      }
      await wait(p, 2500);
    },
  },
  { name: 'place-istanbul-1453', q: '?year=1453&lang=en&place=place-istanbul', settle: 8000 },
  { name: 'east-asia-tang-zh', q: '?year=741&lang=zh', do: async (p) => (await chip(p, '东亚'), wait(p, 3500)) },
  { name: 'mesoamerica-1500', q: '?year=1500&lang=en', do: async (p) => (await chip(p, 'Mesoamerica'), wait(p, 3500)) },
  { name: 'south-america-1530', q: '?year=1530&lang=en', do: async (p) => (await chip(p, 'South America'), wait(p, 3500)) },
  { name: 'oceania-1800', q: '?year=1800&lang=en', do: async (p) => (await chip(p, 'Oceania'), wait(p, 3500)) },
  {
    name: 'search',
    q: '?year=1500&lang=en',
    do: async (p) => {
      await p.keyboard.press('/');
      await p.keyboard.type('Ibn', { delay: 80 });
      await wait(p, 900);
    },
  },
  {
    name: 'layers',
    q: '?year=1250&lang=en',
    do: async (p) => {
      await chip(p, 'Central Asia');
      await wait(p, 3500);
      await p.getByRole('button', { name: 'Layers' }).click();
      await wait(p, 600);
    },
  },
  {
    name: 'lightbox',
    q: '?year=1250&lang=en&person=person-rumi',
    settle: 8000,
    do: async (p) => {
      await p.locator('.card-img').first().click();
      await wait(p, 1200);
    },
  },
  { name: 'game-red-cliffs', q: '?year=208&lang=en', do: async (p) => (await openGame(p, 'Red Cliffs'), await p.keyboard.press('Space'), wait(p, 2500)) },
  { name: 'game-vostok', q: '?year=1961&lang=en', do: async (p) => (await openGame(p, 'Vostok'), await begin(p), wait(p, 9000)) },
  { name: 'game-orchid-pavilion', q: '?year=353&lang=en', do: async (p) => (await openGame(p, 'Orchid Pavilion'), await begin(p), await brush(p), wait(p, 1200)) },
  { name: 'mobile', q: '?year=1324&lang=en&person=person-mansa-musa', settle: 8000, viewport: { width: 390, height: 844 }, scale: 2 },
];

const problems = [];
if (only !== 'videos')
  for (const s of SHOTS.filter((x) => !pick || pick.includes(x.name))) {
    const page = await browser.newPage({ viewport: s.viewport ?? { width: 1600, height: 1000 }, deviceScaleFactor: s.scale ?? 1 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
      await open(page, s.q, { settle: s.settle });
      if (s.do) await s.do(page);
      await page.screenshot({ path: path.join(OUT, `${s.name}.jpg`), type: 'jpeg', quality: 86 });
      console.log(`✓ ${s.name}${errors.length ? `  (page errors: ${errors.join(' | ')})` : ''}`);
      if (errors.length) problems.push(s.name);
    } catch (e) {
      console.log(`✗ ${s.name}: ${String(e).split('\n')[0]}`);
      problems.push(s.name);
    }
    await page.close();
  }

const VIDEO = { width: 1280, height: 720 };
const VIDEOS = [
  {
    // The intro swing, a flight to Europe, the timeline playing, then on to East Asia.
    name: 'tour',
    q: '?year=1000&lang=en',
    run: async (p) => {
      await p.goto(`${BASE}/?year=1000&lang=en`);
      await wait(p, 1500);
      await p.locator('.intro .btn-ghost:not([disabled])').click({ timeout: 60000 });
      await wait(p, 4500);
      await chip(p, 'Europe');
      await wait(p, 3000);
      await p.locator('.speed button', { hasText: '30' }).click().catch(() => {});
      await p.locator('.timeline .play').click();
      await wait(p, 6000);
      await p.locator('.timeline .play').click();
      await chip(p, 'East Asia');
      await wait(p, 4500);
    },
  },
  {
    // A biography: the numbered journey, stepped through with → while the year follows.
    name: 'journey',
    run: async (p) => {
      await open(p, '?year=1325&lang=en&person=person-ibn-battuta', { settle: 7500 });
      const t0 = Date.now() - 1500;
      for (let i = 0; i < 7; i++) {
        await p.keyboard.press('ArrowRight');
        await wait(p, 1700);
      }
      return (t0 - p.__start) / 1000; // start the clip on the open biography
    },
  },
  {
    // Red Cliffs: launch the fire ships on the east wind and light them.
    name: 'game-red-cliffs',
    run: async (p) => {
      await open(p, '?year=208&lang=en', { settle: 5000 });
      const t0 = Date.now();
      await openGame(p, 'Red Cliffs');
      for (let i = 0; i < 4; i++) {
        await p.keyboard.press('Space');
        await wait(p, 900);
      }
      await wait(p, 2500);
      await p.keyboard.press('f');
      await wait(p, 6000);
      return (t0 - p.__start) / 1000; // start the clip when the game opens
    },
  },
];

if (only !== 'shots')
  for (const v of VIDEOS.filter((x) => !pick || pick.includes(x.name))) {
    const dir = fs.mkdtempSync(path.join(OUT, '.rec-'));
    const ctx = await browser.newContext({ viewport: VIDEO, recordVideo: { dir, size: VIDEO } });
    const page = await ctx.newPage();
    page.__start = Date.now();
    let trim = 0;
    try {
      trim = (await v.run(page)) ?? 0;
    } catch (e) {
      console.log(`✗ video ${v.name}: ${String(e).split('\n')[0]}`);
      problems.push(`video ${v.name}`);
    }
    await ctx.close();
    const webm = fs.readdirSync(dir).find((f) => f.endsWith('.webm'));
    const src = path.join(dir, webm);
    const mp4 = path.join(OUT, `${v.name}.mp4`);
    const gif = path.join(OUT, `${v.name}.gif`);
    const cut = trim > 0 ? ['-ss', trim.toFixed(2)] : [];
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...cut, '-i', src, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart', '-an', mp4]);
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...cut, '-t', '16', '-i', src, '-vf', 'fps=8,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle', gif]);
    fs.rmSync(dir, { recursive: true, force: true });
    const mb = (f) => (fs.statSync(f).size / 1e6).toFixed(1);
    console.log(`✓ video ${v.name}: mp4 ${mb(mp4)} MB, gif ${mb(gif)} MB`);
  }

await browser.close();
server.kill();
if (problems.length) {
  console.log(`\nproblems: ${problems.join(', ')}`);
  process.exit(1);
}
