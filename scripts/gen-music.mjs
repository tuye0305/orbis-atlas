#!/usr/bin/env node
// Generate the per-region soundtrack and write public/music/*.mp3 + manifest.json.
//
// Providers (MUSIC_PROVIDER, default "wavespeed"):
//   wavespeed  ElevenLabs Music on WaveSpeed: POST /api/v3/elevenlabs/music, then poll
//              /api/v3/predictions/{id}/result. Needs WAVESPEED_API_KEY. About $0.01 per second.
//   suno       A Suno API gateway (sunoapi.org interface). Suno itself has no self-serve API.
//              Needs SUNO_API_KEY, plus optional SUNO_API_BASE, SUNO_MODEL and SUNO_CALLBACK_URL.
// Keys are read from the environment or .env.local (gitignored), and are never printed.
//
//   node scripts/gen-music.mjs                         every region missing from the manifest
//   node scripts/gen-music.mjs --only europe,africa --force [--takes 2] [--seconds 150]
//   node scripts/gen-music.mjs --only europe --append  add take(s) to a region that already has some
//   node scripts/gen-music.mjs import europe track.mp3 [--title "…"]   add a track made elsewhere
//   node scripts/gen-music.mjs reencode                re-encode every track from music/raw/
//   node scripts/gen-music.mjs status
// Generation prints its cost estimate first and refuses to start above --budget (default $15).
//
// Prompts live in music/prompts.json. Raw downloads are kept in music/raw/ (gitignored).
// Every track has its leading and trailing silence trimmed (generated pieces often end a few
// seconds early and then sit in silence), is loudness-normalised (-18 LUFS), given a short
// FADE_IN and a FADE_OUT, and is encoded as 128 kbps MP3. The manifest records `crossfadeAt` for
// each track: where its ending has died away, at the latest where the fade-out begins. The player
// starts the next take there, so the takes overlap instead of leaving a gap.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROMPTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'music/prompts.json'), 'utf8'));
const OUT = path.join(ROOT, 'public/music');
const RAW = path.join(ROOT, 'music/raw');
const MANIFEST = path.join(OUT, 'manifest.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const envFile = path.join(ROOT, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

/** JSON request with retries on rate limits and transient errors. Returns the parsed body. */
async function request(method, url, key, body, retryable) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`${method} ${new URL(url).pathname}: HTTP ${res.status}, not JSON: ${text.slice(0, 160)}`);
    }
    if (retryable(res.status, json) && attempt < 5) {
      await sleep(4000 * 2 ** attempt);
      continue;
    }
    return { status: res.status, json };
  }
}

/** Prompt text for a region: its style plus the shared suffix. */
function styleFor(region) {
  return `${PROMPTS.regions[region].style}, ${PROMPTS.defaults.styleSuffix}`;
}

const PROVIDERS = {
  wavespeed: {
    keyVar: 'WAVESPEED_API_KEY',
    label: () => 'ElevenLabs Music via WaveSpeed',
    async submit(region, seconds, key) {
      const avoid = PROMPTS.defaults.negativeTags;
      const body = {
        prompt: `${styleFor(region)}. Avoid: ${avoid}.`,
        music_length_ms: Math.round(Math.min(300, Math.max(5, seconds)) * 1000),
        force_instrumental: true,
        output_format: 'mp3_high_quality',
      };
      const { status, json } = await request('POST', 'https://api.wavespeed.ai/api/v3/elevenlabs/music', key, body, (s) => s === 429 || s >= 500);
      const id = json.data?.id ?? json.id;
      if (status !== 200 || !id) throw new Error(`${region}: submit failed (${status}) ${json.message ?? json.error ?? ''}`.trim());
      return id;
    },
    async wait(region, id, key) {
      const until = Date.now() + 15 * 60_000;
      while (Date.now() < until) {
        await sleep(4000);
        const { json } = await request('GET', `https://api.wavespeed.ai/api/v3/predictions/${id}/result`, key, null, (s) => s === 429 || s >= 500);
        const d = json.data ?? json;
        if (d.status === 'completed') return (d.outputs ?? []).map((url) => ({ url, id }));
        if (['failed', 'cancelled', 'timeout', 'deleted'].includes(d.status)) throw new Error(`${region}: ${d.status} ${d.error ?? ''}`.trim());
      }
      throw new Error(`${region}: timed out (prediction ${id})`);
    },
    model: 'elevenlabs/music',
  },

  suno: {
    keyVar: 'SUNO_API_KEY',
    base: () => (process.env.SUNO_API_BASE ?? 'https://api.sunoapi.org').replace(/\/$/, ''),
    label() {
      return `Suno ${this.model} via ${new URL(this.base()).host}`;
    },
    get model() {
      return process.env.SUNO_MODEL ?? 'V5';
    },
    async submit(region, seconds, key) {
      const body = {
        customMode: true,
        instrumental: true,
        model: this.model,
        callBackUrl: process.env.SUNO_CALLBACK_URL ?? 'https://example.com/orbis-suno-callback',
        title: PROMPTS.regions[region].title.slice(0, 80),
        style: styleFor(region).slice(0, 1000),
        negativeTags: PROMPTS.defaults.negativeTags,
      };
      if (/^V(5_5|6)/.test(this.model)) body.duration = seconds;
      const { json } = await request('POST', `${this.base()}/api/v1/generate`, key, body, (_s, j) => [405, 430, 455, 500].includes(j.code));
      if (json.code !== 200 || !json.data?.taskId) throw new Error(`${region}: submit failed (${json.code}) ${json.msg ?? ''}`.trim());
      return json.data.taskId;
    },
    async wait(region, taskId, key) {
      const failed = new Set(['CREATE_TASK_FAILED', 'GENERATE_AUDIO_FAILED', 'CALLBACK_EXCEPTION', 'SENSITIVE_WORD_ERROR']);
      const until = Date.now() + 20 * 60_000;
      while (Date.now() < until) {
        await sleep(15_000);
        const { json } = await request('GET', `${this.base()}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`, key, null, (_s, j) => [405, 430, 455, 500].includes(j.code));
        const d = json.data ?? {};
        if (failed.has(d.status)) throw new Error(`${region}: ${d.status} ${d.errorMessage ?? ''}`.trim());
        const tracks = (d.response?.sunoData ?? []).filter((t) => t.audio_url || t.stream_audio_url);
        if (d.status === 'SUCCESS' && tracks.length) return tracks.map((t) => ({ url: t.audio_url || t.stream_audio_url, id: t.id, title: t.title }));
      }
      throw new Error(`${region}: timed out (task ${taskId})`);
    },
  },
};

function loadManifest() {
  if (!fs.existsSync(MANIFEST)) return { generated: null, regions: {} };
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}
function saveManifest(m) {
  m.generated = new Date().toISOString().slice(0, 10);
  m.regions = Object.fromEntries(Object.keys(PROMPTS.regions).filter((k) => m.regions[k]?.length).map((k) => [k, m.regions[k]]));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(MANIFEST, `${JSON.stringify(m, null, 1)}\n`);
}

const probe = (file) => Number.parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }));

// The fade-in only guards against a click: with the leading silence trimmed, the first note is
// right at the start, and a long fade would swallow its attack. Region changes and the first
// start fade in through Web Audio anyway.
const FADE_IN = 0.3;
// The next take starts this long before the current one has died away, so its first notes land
// while the last ones still ring.
const LEAD = 1;
const FADE_OUT = 4;

/** Silent stretches of a file as [start, end] pairs (ffmpeg silencedetect). */
function silences(file, { db = -45, min = 2 } = {}) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', `silencedetect=n=${db}dB:d=${min}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = [];
  for (const m of r.stderr.matchAll(/silence_(start|end): (-?[0-9.]+)/g)) {
    if (m[1] === 'start') out.push([Math.max(0, +m[2]), Number.POSITIVE_INFINITY]);
    else if (out.length) out[out.length - 1][1] = +m[2];
  }
  return out;
}

/**
 * Trim leading and trailing silence, normalise loudness, add fades, encode MP3. Returns the
 * encoded duration, the seconds trimmed at each end, and any silent gap (≥ 2 s) left mid-track.
 */
function encode(src, dst) {
  const len = probe(src);
  const quiet = silences(src, { db: -50, min: 0.25 });
  // Keep a breath either side (0.05 s before the first note, 0.3 s of the last decay).
  const head = quiet[0] && quiet[0][0] < 0.05 ? Math.max(0, quiet[0][1] - 0.05) : 0;
  const last = quiet.at(-1);
  const tail = last && last[1] >= len - 0.05 && last[0] > head ? Math.min(len, last[0] + 0.3) : len;
  const dur = tail - head;
  execFileSync('ffmpeg', [
    '-y', '-v', 'error', '-i', src,
    '-af', [
      `atrim=start=${head.toFixed(3)}:end=${tail.toFixed(3)}`,
      'asetpts=PTS-STARTPTS',
      'loudnorm=I=-18:TP=-1.5:LRA=11',
      `afade=t=in:d=${FADE_IN}`,
      `afade=t=out:st=${Math.max(0, dur - FADE_OUT).toFixed(2)}:d=${FADE_OUT}`,
    ].join(','),
    '-ac', '2', '-ar', '44100', '-codec:a', 'libmp3lame', '-b:a', '128k', dst,
  ]);
  const duration = probe(dst);
  const gaps = silences(dst, { db: -45, min: 2 }).filter(([a]) => a < duration - FADE_OUT - 0.5);
  return { duration: Math.round(duration * 100) / 100, crossfadeAt: crossfadePoint(dst, duration), trimmed: [+head.toFixed(2), +(len - tail).toFixed(2)], gaps };
}

/** RMS level (dBFS) of a file in `win`-second windows. */
function levels(file, win = 0.2) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', `asetnsamples=n=${Math.round(44100 * win)},astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-`, '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  return [...r.stdout.matchAll(/RMS_level=(-?[\d.]+|-inf)/g)].map((m) => (m[1] === '-inf' ? -120 : Math.max(-120, +m[1])));
}

/**
 * When the player should start the next take: LEAD seconds before this one's ending has died
 * away (its 1 s peak level last falls 8 dB under the track's median), and at the latest LEAD
 * before the baked fade-out begins. Generated pieces end with a ritardando and a long decay, so a
 * fixed point would leave a soft hole between the last chord and the next take's first note.
 */
function crossfadePoint(file, duration) {
  const win = 0.2;
  const lv = levels(file, win);
  const median = [...lv].sort((a, b) => a - b)[lv.length >> 1];
  const peak = (i) => Math.max(...lv.slice(Math.max(0, i - 4), i + 1)); // trailing 1 s
  let i = lv.length - 1;
  while (i > 0 && peak(i) < median - 8) i--;
  const at = Math.min(duration - FADE_OUT - LEAD, Math.max(duration - 15, (i + 1) * win - LEAD));
  return Math.round(at * 100) / 100;
}

function report(region, file, enc) {
  const gaps = enc.gaps.map(([a, b]) => `${a.toFixed(1)}–${b.toFixed(1)}s`).join(', ');
  console.log(`${gaps ? '⚠' : '✓'} ${region}: ${file} (${enc.duration}s, next take at ${enc.crossfadeAt}s, trimmed ${enc.trimmed[0]}s + ${enc.trimmed[1]}s)${gaps ? `, silent gaps ${gaps}` : ''}`);
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

function nextFile(manifest, region) {
  const used = new Set((manifest.regions[region] ?? []).map((t) => t.file));
  let i = 1;
  while (used.has(`${region}-${i}.mp3`) || fs.existsSync(path.join(OUT, `${region}-${i}.mp3`))) i++;
  return `${region}-${i}.mp3`;
}

const flag = (args, name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);

async function generate(args) {
  const provider = PROVIDERS[process.env.MUSIC_PROVIDER ?? 'wavespeed'];
  if (!provider) throw new Error(`unknown MUSIC_PROVIDER (one of ${Object.keys(PROVIDERS).join(', ')})`);
  const key = process.env[provider.keyVar];
  if (!key) throw new Error(`${provider.keyVar} is not set (put it in .env.local)`);
  const only = flag(args, '--only', null)?.split(',');
  const force = args.includes('--force');
  const append = args.includes('--append');
  if (force && append) throw new Error('--force replaces a region’s tracks and --append adds to them: pick one');
  const takes = Number(flag(args, '--takes', 1));
  const seconds = Number(flag(args, '--seconds', PROMPTS.defaults.duration));
  const budget = Number(flag(args, '--budget', 15));
  const manifest = loadManifest();
  const regions = Object.keys(PROMPTS.regions)
    .filter((k) => !only || only.includes(k))
    .filter((k) => force || append || !manifest.regions[k]?.length);
  if (!regions.length) return console.log('Nothing to generate: every region already has tracks (use --force or --append).');
  // Billed per second of audio (about $0.01/s for ElevenLabs Music on WaveSpeed).
  const cost = regions.length * takes * seconds * 0.01;
  console.log(`${provider.label()}: ${regions.join(', ')} · ${takes} take(s) × ${seconds}s ≈ $${cost.toFixed(2)}`);
  if (cost > budget) throw new Error(`estimated $${cost.toFixed(2)} is over the --budget of $${budget}`);
  fs.mkdirSync(RAW, { recursive: true });

  // Submit everything first so the provider works in parallel, then collect.
  const jobs = [];
  for (const region of regions) {
    for (let n = 0; n < takes; n++) {
      try {
        jobs.push({ region, id: await provider.submit(region, seconds, key) });
      } catch (e) {
        console.error(`✗ ${e.message}`);
      }
      await sleep(800);
    }
  }
  const results = await Promise.allSettled(jobs.map(async (j) => ({ ...j, outputs: await provider.wait(j.region, j.id, key) })));

  const replaced = new Set();
  let ok = 0;
  for (const r of results) {
    if (r.status === 'rejected') {
      console.error(`✗ ${r.reason.message}`);
      continue;
    }
    const { region, outputs } = r.value;
    if (force && !replaced.has(region)) {
      replaced.add(region);
      for (const t of manifest.regions[region] ?? []) fs.rmSync(path.join(OUT, t.file), { force: true });
      manifest.regions[region] = [];
    }
    for (const o of outputs) {
      const raw = path.join(RAW, `${region}-${o.id}.mp3`);
      await download(o.url, raw);
      const file = nextFile(manifest, region);
      const enc = encode(raw, path.join(OUT, file));
      (manifest.regions[region] ??= []).push({ file, title: o.title || PROMPTS.regions[region].title, duration: enc.duration, crossfadeAt: enc.crossfadeAt, fadeOut: FADE_OUT, model: provider.model, id: o.id });
      report(region, file, enc);
      ok++;
    }
  }
  saveManifest(manifest);
  console.log(`${ok} track(s) written to public/music/`);
  if (results.some((r) => r.status === 'rejected') || jobs.length < regions.length * takes) process.exitCode = 1;
}

function importTrack([region, src, ...rest]) {
  if (!PROMPTS.regions[region]) throw new Error(`unknown region "${region}" (one of ${Object.keys(PROMPTS.regions).join(', ')})`);
  if (!src || !fs.existsSync(src)) throw new Error(`file not found: ${src}`);
  const manifest = loadManifest();
  const file = nextFile(manifest, region);
  fs.mkdirSync(OUT, { recursive: true });
  const enc = encode(src, path.join(OUT, file));
  (manifest.regions[region] ??= []).push({ file, title: flag(rest, '--title', PROMPTS.regions[region].title), duration: enc.duration, crossfadeAt: enc.crossfadeAt, fadeOut: FADE_OUT, model: 'imported' });
  saveManifest(manifest);
  report(region, file, enc);
}

/** Re-encode every generated track from its raw download in music/raw/ (after changing encode()). */
function reencode() {
  const manifest = loadManifest();
  for (const [region, tracks] of Object.entries(manifest.regions)) {
    for (const t of tracks) {
      const raw = path.join(RAW, `${region}-${t.id}.mp3`);
      if (!t.id || !fs.existsSync(raw)) {
        console.log(`· ${region}: ${t.file} has no raw download in music/raw/, left as it is`);
        continue;
      }
      const enc = encode(raw, path.join(OUT, t.file));
      Object.assign(t, { duration: enc.duration, crossfadeAt: enc.crossfadeAt, fadeOut: FADE_OUT });
      report(region, t.file, enc);
    }
  }
  saveManifest(manifest);
}

function status() {
  const m = loadManifest();
  for (const k of Object.keys(PROMPTS.regions)) {
    const tracks = m.regions[k] ?? [];
    console.log(`${tracks.length ? '✓' : '·'} ${k.padEnd(15)} ${tracks.map((t) => `${t.file} ${t.duration}s`).join(', ') || 'no tracks'}`);
  }
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === 'import') importTrack(args);
  else if (cmd === 'reencode') reencode();
  else if (cmd === 'status') status();
  else await generate(cmd ? [cmd, ...args] : args);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
