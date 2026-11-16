#!/usr/bin/env node
// Music check. Run `npm run build` first; needs ffmpeg and Playwright's Chromium.
//   node scripts/check-music.mjs            SHOTS_OUT=dir overrides docs/screenshots/pr-music
//   BROWSER=webkit node scripts/check-music.mjs   runs the browser part in WebKit (the Safari engine)
//
// Offline, with ffmpeg, for every track in public/music/manifest.json:
//   - the file decodes at its manifest duration, at about -18 LUFS, with no leading silence and
//     no silent gap of 2 s or more before its closing fade;
//   - the loop seam: the player starts the next take at the manifest's `crossfadeAt`. Mixed the
//     same way, the seam must add no new low: its quietest second may be at most 4 dB under the
//     quietest second of the music either side (and above -45 dBFS). The old restart-on-`ended`
//     seam is measured alongside for contrast. Writes seam-<region>.png (waveform at the seam).
// In Chromium:
//   - entering with music starts exactly one track, for the landing region;
//   - Media Session shows the track and its playing/paused state;
//   - the loop seam in the real player: seeking near the end overlaps two takes and the output
//     level (an AnalyserNode on the destination) never drops to silence;
//   - flying to East Asia crossfades, then plays only East Asia, and the label names it;
//   - only the regions visited are downloaded, and no more than the pool of 4 elements is used;
//   - music off, move to Europe, music on: Europe plays (not the region left behind);
//   - a region whose tracks 404 falls back to the open-sea score, labelled as such, with no errors.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, webkit } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.SHOTS_OUT ?? path.join(ROOT, 'docs', 'screenshots', 'pr-music');
fs.mkdirSync(OUT, { recursive: true });
const PORT = 4183;
const BASE = `http://localhost:${PORT}`;
const MUSIC = path.join(ROOT, 'dist/music');
const manifest = JSON.parse(fs.readFileSync(path.join(MUSIC, 'manifest.json'), 'utf8'));

const failures = [];
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures.push(msg);
};

// ---------- Offline: the files and their loop seams ----------

const ff = (args) => spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 64 << 20 });
const probe = (file) => Number.parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }));
const WIN = 0.2; // seconds per level window
/** RMS level (dBFS) per WIN-second window of a filter graph's output `[out]`. */
function levels(inputs, graph) {
  const r = ff([...inputs, '-filter_complex', `${graph},asetnsamples=n=${Math.round(44100 * WIN)},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-[out]`, '-map', '[out]', '-f', 'null', '-']);
  return [...r.stdout.matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === '-inf' ? -120 : Math.max(-120, +m[1])));
}
/** 1 s short-term level: the power mean of each run of 5 windows. Single 0.2 s windows dip on every rest. */
const smooth = (xs) =>
  xs.slice(4).map((_, i) => 10 * Math.log10(xs.slice(i, i + 5).reduce((s, db) => s + 10 ** (db / 10), 0) / 5));
const FADE_IN = 0.3; // as in gen-music.mjs
function silences(file, db, min) {
  const r = ff(['-i', file, '-af', `silencedetect=n=${db}dB:d=${min}`, '-f', 'null', '-']);
  const out = [];
  for (const m of r.stderr.matchAll(/silence_(start|end): (-?[0-9.]+)/g)) {
    if (m[1] === 'start') out.push([Math.max(0, +m[2]), Number.POSITIVE_INFINITY]);
    else if (out.length) out[out.length - 1][1] = +m[2];
  }
  return out;
}

const PRE = 6; // seconds of the outgoing take shown before the next one starts
const POST = 6; // seconds of the incoming take shown after the outgoing one has ended
/** When the player starts the next take (manifest `crossfadeAt`, else `fadeOut` before the end). */
const crossfadeAt = (t, dur) => t.crossfadeAt ?? dur - (t.fadeOut ?? 4);
for (const [region, tracks] of Object.entries(manifest.regions)) {
  for (const t of tracks) {
    const f = path.join(MUSIC, t.file);
    const d = probe(f);
    const summary = ff(['-i', f, '-af', 'ebur128', '-f', 'null', '-']).stderr.split('Summary:')[1] ?? '';
    const lufs = +(/I:\s+(-?[\d.]+) LUFS/.exec(summary)?.[1] ?? Number.NaN);
    const fade = t.fadeOut ?? 4;
    const q = silences(f, -45, 0.3);
    // Under the baked fade-in, the first tenths of a second can read as silence at -45 dB.
    const lead = q[0] && q[0][0] === 0 ? q[0][1] : 0;
    const gaps = q.filter(([a, b]) => b - a >= 2 && a < d - fade - 0.5);
    check(
      Math.abs(d - t.duration) < 0.5 && Math.abs(lufs + 18) <= 1.5 && lead < 0.4 && !gaps.length,
      `${region}: ${t.file} ${d.toFixed(1)}s (manifest ${t.duration}s), ${lufs} LUFS, leading silence ${lead.toFixed(2)}s, gaps ${gaps.map(([a, b]) => `${a.toFixed(1)}–${b.toFixed(1)}s`).join(' ') || 'none'}`,
    );
  }
  // Each take hands over to the next, cycling (a single take loops onto itself).
  for (let i = 0; i < tracks.length; i++) {
    const a = tracks[i];
    const b = tracks[(i + 1) % tracks.length];
    const fa = path.join(MUSIC, a.file);
    const fb = path.join(MUSIC, b.file);
    const da = probe(fa);
    const at = crossfadeAt(a, da);
    const ov = da - at; // how long A plays on under B
    // The music's own quietest second either side: A's last 20 s before the seam, B's first 20 s.
    const ref = Math.min(
      ...smooth(levels(['-ss', (at - 20).toFixed(3), '-t', '20', '-i', fa], '[0]anull')),
      ...smooth(levels(['-ss', String(FADE_IN + 0.5), '-t', '20', '-i', fb], '[0]anull')),
    );
    const inputs = ['-ss', (at - PRE).toFixed(3), '-i', fa, '-t', String(POST + ov), '-i', fb];
    const mix = (delay) => `[1]adelay=${Math.round(delay * 1000)}:all=1[b];[0][b]amix=inputs=2:normalize=0:duration=longest`;
    // As the player does it, and as the old player did (B only once A had ended).
    const seam = (xs) => Math.min(...smooth(xs).slice(Math.floor((PRE - 1) / WIN), Math.ceil((PRE + ov + 1.5) / WIN)));
    const dipX = seam(levels(inputs, mix(PRE)));
    const dipR = seam(levels(inputs, mix(PRE + ov)));
    check(
      dipX >= ref - 4 && dipX > -45,
      `${region}: seam ${a.file} → ${b.file} at ${at.toFixed(1)}s (${ov.toFixed(1)}s overlap): quietest second ${dipX.toFixed(1)} dBFS, the music's own ${ref.toFixed(1)} dBFS; old restart seam ${dipR.toFixed(1)} dBFS`,
    );
    if (i === 0) {
      const png = path.join(OUT, `seam-${region}.png`);
      ff(['-y', '-v', 'error', ...inputs, '-filter_complex', `${mix(PRE)},showwavespic=s=900x110:scale=sqrt:colors=0x8fb3d9[out]`, '-map', '[out]', '-frames:v', '1', png]);
    }
  }
}

// ---------- In the browser ----------

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('vite preview did not start')), 20000);
  server.stdout.on('data', (d) => String(d).includes(String(PORT)) && (clearTimeout(t), resolve()));
});

const ENGINE = process.env.BROWSER === 'webkit' ? 'webkit' : 'chromium';
const browser = ENGINE === 'webkit' ? await webkit.launch() : await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});

/** A page that records every media element played and taps the audio output level. */
async function musicPage() {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const fetched = new Set();
  page.on('pageerror', (e) => errors.push(String(e)));
  const warns = [];
  page.on('console', (m) => m.type() === 'warning' && warns.push(m.text()));
  page.on('request', (r) => {
    const m = /\/music\/([^/?#]+\.mp3)/.exec(r.url());
    if (m) fetched.add(m[1]);
  });
  await page.addInitScript(() => {
    const seen = [];
    window.__media = seen;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!seen.includes(this)) seen.push(this);
      return play.call(this);
    };
    // Everything the player sends to the speakers also goes through this analyser.
    const connect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dest, ...rest) {
      if (dest instanceof AudioDestinationNode) {
        const an = (window.__tap ??= dest.context.createAnalyser());
        an.fftSize = 2048;
        connect.call(this, an);
      }
      return connect.call(this, dest, ...rest);
    };
    window.__level = () => {
      const a = window.__tap;
      if (!a) return -120;
      const buf = new Float32Array(a.fftSize);
      a.getFloatTimeDomainData(buf);
      let s = 0;
      for (const v of buf) s += v * v;
      return Math.max(-120, 10 * Math.log10(s / buf.length + 1e-12));
    };
  });
  const playing = () =>
    page.evaluate(() => window.__media.filter((m) => !m.paused).map((m) => ({ src: m.src.split('/').pop(), t: +m.currentTime.toFixed(1) })));
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
  const label = () => page.locator('.music-label').textContent();
  const session = () => page.evaluate(() => ({ title: navigator.mediaSession.metadata?.title ?? null, state: navigator.mediaSession.playbackState }));
  return { page, errors, warns, fetched, playing, until, label, session };
}

const slotOf = (src) => src?.replace(/-\d+\.mp3$/, '');

try {
  // 1. Every track decodes in the browser at the duration the manifest claims.
  {
    const page = await browser.newPage();
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
        check(Math.abs(d - t.duration) < 1, `${region}: ${t.file} decodes in ${ENGINE} (${d.toFixed(1)}s)`);
      }
    }
    await page.close();
  }

  const { page, errors, warns, fetched, playing, until, label, session } = await musicPage();
  await page.goto(`${BASE}/?year=1066&lang=en`);

  // 2. Enter with music: one track starts, for the region where the intro lands, and no track
  //    starts for the regions the intro swing passes over on the way.
  await page.locator('.intro .btn-primary:not([disabled])').click({ timeout: 30000 });
  const started = new Set();
  // Generous upper bounds: the music waits for the intro to land, which under software WebGL on a
  // busy machine can take many times its 3.2 s. A normal run leaves these loops within seconds.
  const end = Date.now() + 45000;
  let now = [];
  while (Date.now() < end) {
    now = await playing();
    for (const p of now) started.add(p.src);
    if (now.length === 1 && now[0].t > 2) break;
    await page.waitForTimeout(250);
  }
  const region1 = await page.evaluate(() => document.querySelector('.region-chip.on')?.textContent?.trim());
  check(now.length === 1 && now[0].t > 0 && started.size === 1, `enter with music: ${[...started].join(', ')} started; region chip ${region1}`);
  const first = now[0]?.src;
  const s1 = await session();
  check(s1.state === 'playing' && !!s1.title && manifest.regions[slotOf(first)]?.some((t) => t.title === s1.title), `Media Session: “${s1.title}”, ${s1.state}`);
  await page.screenshot({ path: path.join(OUT, 'music-on-intro.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });

  // 3. Loop seam: jump to 3 s before the crossfade point and watch the hand-over.
  {
    const track = manifest.regions[slotOf(first)].find((t) => t.file === first);
    const at = crossfadeAt(track, track.duration);
    await page.evaluate(
      ([src, at]) => {
        const el = window.__media.find((m) => !m.paused && m.src.endsWith(src));
        el.currentTime = at - 3;
      },
      [first, at],
    );
    await page.waitForTimeout(400); // let the seek land
    const samples = [];
    for (let i = 0; i < 90; i++) {
      samples.push({ p: await playing(), db: await page.evaluate(() => window.__level()) });
      await page.waitForTimeout(100);
    }
    const counts = samples.map((s) => s.p.length);
    const overlap = samples.some((s) => s.p.length === 2 && s.p.every((x) => slotOf(x.src) === slotOf(first)));
    const last = samples.at(-1).p;
    const quietest = Math.min(...samples.map((s) => s.db));
    const handed = last.length === 1 && slotOf(last[0].src) === slotOf(first) && last[0].t > 1 && last[0].t < 10;
    check(
      Math.min(...counts) >= 1 && overlap && handed && quietest > -50,
      `loop seam: ${first} → ${last[0]?.src} at ${last[0]?.t}s, overlapped: ${overlap}, never silent: ${Math.min(...counts) >= 1}, quietest output ${quietest.toFixed(1)} dBFS${handed ? '' : ` (decks over time: ${JSON.stringify(samples.filter((_, i) => i % 15 === 0).map((s) => s.p))}; warnings: ${JSON.stringify(warns)})`}`,
    );
  }

  // 4. Fly to East Asia: both regions sound during the crossfade, then only East Asia.
  await page.getByRole('button', { name: 'East Asia', exact: true }).click();
  const mid = await until((n) => new Set(n.map((x) => slotOf(x.src))).size === 2, 20000);
  check(new Set(mid.map((x) => slotOf(x.src))).size === 2, `crossfade overlaps both regions: ${JSON.stringify(mid)}`);
  now = await until((n) => n.length === 1 && n[0].src.startsWith('east-asia'), 25000);
  check(now.length === 1 && now[0].src.startsWith('east-asia') && slotOf(now[0].src) !== slotOf(first), `after flying to East Asia: ${JSON.stringify(now)}`);
  const lab = await label();
  check(lab === 'Guzheng, dizi & erhu', `label names the music: “${lab}”`);
  await page.screenshot({ path: path.join(OUT, 'music-on-east-asia.png') });

  // 5. Music off pauses everything; move to Europe while it is off; on again plays Europe.
  await page.locator('.music-btn').click();
  await page.waitForTimeout(1500);
  now = await playing();
  check(now.length === 0 && (await session()).state === 'paused', `music off: ${JSON.stringify(now)}, Media Session ${(await session()).state}`);
  await page.getByRole('button', { name: 'Europe', exact: true }).click();
  // Wait for the camera to arrive (the flight is slow under software WebGL), not a fixed time:
  // turned on mid-flight, the player rightly starts the region the camera is still over.
  await page.waitForFunction(() => document.querySelector('.region-chip.on')?.textContent?.trim() === 'Europe', null, { timeout: 20000 });
  await page.waitForTimeout(1000);
  await page.locator('.music-btn').click();
  now = await until((n) => n.length === 1 && n[0].src.startsWith('europe'), 20000);
  check(now.length === 1 && now[0].src.startsWith('europe'), `music on again over Europe: ${JSON.stringify(now)}`);

  // 6. Bandwidth: only the regions visited were fetched, through a bounded element pool.
  const visited = new Set([slotOf(first), 'east-asia', 'europe']);
  const extra = [...fetched].filter((f) => !visited.has(slotOf(f)));
  const pool = await page.evaluate(() => window.__media.length);
  check(!extra.length && pool <= 4, `fetched ${[...fetched].join(', ')}; ${extra.length ? `unexpected: ${extra.join(', ')}; ` : ''}${pool} media elements used`);
  check(errors.length === 0, `no page errors${errors.length ? `: ${errors.join(' | ')}` : ''}`);
  await page.close();

  // 7. A region whose tracks fail to load falls back to the open-sea score.
  {
    const { page, errors, until, label } = await musicPage();
    await page.route(/\/music\/east-asia-\d+\.mp3/, (r) => r.fulfill({ status: 404, body: 'not found' }));
    await page.goto(`${BASE}/?year=1066&lang=en`);
    await page.locator('.intro .btn-primary:not([disabled])').click({ timeout: 30000 });
    await until((n) => n.length === 1 && n[0].t > 1, 45000);
    await page.getByRole('button', { name: 'East Asia', exact: true }).click();
    const fb = await until((n) => n.length === 1 && n[0].src.startsWith('ocean') && n[0].t > 1, 40000);
    const lab = await label();
    check(fb.length === 1 && fb[0].src.startsWith('ocean') && lab === 'Open sea', `East Asia 404s: falls back to ${JSON.stringify(fb)}, label “${lab}”`);
    check(errors.length === 0, `no page errors on load failure${errors.length ? `: ${errors.join(' | ')}` : ''}`);
    await page.screenshot({ path: path.join(OUT, 'music-fallback.png'), clip: { x: 0, y: 0, width: 1440, height: 120 } });
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
