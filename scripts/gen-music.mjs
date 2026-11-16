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
//   node scripts/gen-music.mjs import europe track.mp3 [--title "…"]   add a track made elsewhere
//   node scripts/gen-music.mjs status
//
// Prompts live in music/prompts.json. Raw downloads are kept in music/raw/ (gitignored).
// Every track is loudness-normalised (-18 LUFS), given short fades and encoded as 128 kbps MP3.
import { execFileSync } from 'node:child_process';
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

/** Normalise loudness, add fades, encode MP3. Returns the encoded duration in seconds. */
function encode(src, dst) {
  const fadeOut = Math.max(0, probe(src) - 4);
  execFileSync('ffmpeg', [
    '-y', '-v', 'error', '-i', src,
    '-af', `loudnorm=I=-18:TP=-1.5:LRA=11,afade=t=in:d=1.5,afade=t=out:st=${fadeOut.toFixed(2)}:d=4`,
    '-ac', '2', '-ar', '44100', '-codec:a', 'libmp3lame', '-b:a', '128k', dst,
  ]);
  return Math.round(probe(dst));
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
  const takes = Number(flag(args, '--takes', 1));
  const seconds = Number(flag(args, '--seconds', PROMPTS.defaults.duration));
  const manifest = loadManifest();
  const regions = Object.keys(PROMPTS.regions).filter((k) => !only || only.includes(k)).filter((k) => force || !manifest.regions[k]?.length);
  if (!regions.length) return console.log('Nothing to generate: every region already has tracks (use --force).');
  console.log(`${provider.label()}: ${regions.join(', ')} · ${takes} take(s) × ${seconds}s`);
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
      const duration = encode(raw, path.join(OUT, file));
      (manifest.regions[region] ??= []).push({ file, title: o.title || PROMPTS.regions[region].title, duration, model: provider.model, id: o.id });
      console.log(`✓ ${region}: ${file} (${duration}s)`);
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
  const duration = encode(src, path.join(OUT, file));
  (manifest.regions[region] ??= []).push({ file, title: flag(rest, '--title', PROMPTS.regions[region].title), duration, model: 'imported' });
  saveManifest(manifest);
  console.log(`✓ ${region}: ${file} (${duration}s)`);
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
  else if (cmd === 'status') status();
  else await generate(cmd ? [cmd, ...args] : args);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
