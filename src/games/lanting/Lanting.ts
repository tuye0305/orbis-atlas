import { createSfx } from '../shared/sfx';
import { clamp, h, lerp, makeToast } from '../shared/stage';
import type { GameCtx, GameResult, MountGame } from '../types';
import { CHARS, GROUPS, LEVELS, ZHI, type Level, type Pt, type StrokeDef } from './chars';

/*
 * 兰亭 · 习字 — the brush.
 *
 * A 2-D canvas game. The player picks a level from a copybook (字帖): single characters that
 * teach the basic strokes, 永 and its eight principles, 之 written three ways, and lines of poetry
 * written one character per square. Each level ends on a finished sheet with the poem line as the
 * inscription and a seal.
 *
 * Everything on the paper lives in "cell space": the writing square (米字格) is 0..1 on both axes,
 * y down. Stroke templates (see chars.ts) are Catmull-Rom splines through [x, y, r] control points,
 * r being the brush radius as a fraction of the cell.
 *
 * The brush is a round brush of ~40 bristles. Each step draws an opaque core (shrinking as the
 * brush dries) and one short line per bristle, so a drying brush breaks into streaks parallel to
 * the motion — 飞白. Fast = thin and dry, slow = heavy and wet, a pause lets the ink bleed into
 * the paper, and lifting while moving fast leaves a sharp tip (出锋).
 */

const L = (lang: GameCtx['lang'], zh: string, en: string) => (lang === 'zh' ? zh : en);

const GRADES = [
  { min: 0.85, zh: '神品', en: 'Divine', color: '#e0412f' },
  { min: 0.7, zh: '妙品', en: 'Wonderful', color: '#e8743a' },
  { min: 0.5, zh: '能品', en: 'Capable', color: '#c9a25a' },
  { min: -1, zh: '再写', en: 'Try again', color: '#8a8a8a' },
];
const gradeOf = (s: number) => GRADES.find((g) => s >= g.min)!;

// ---------- spline helpers ----------

function catmull(pts: Pt[], perSeg = 28): Pt[] {
  const out: Pt[] = [];
  const P = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    for (let k = 0; k < perSeg; k++) {
      const t = k / perSeg;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (j: number) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
      out.push([f(0), f(1), Math.max(0, f(2))]);
    }
  }
  out.push([...pts[pts.length - 1]] as Pt);
  return out;
}

function pathLen(p: Pt[]) {
  let l = 0;
  for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return l;
}

/** n points evenly spaced by arc length. */
function resample(p: Pt[], n: number): Pt[] {
  if (p.length < 2) return Array.from({ length: n }, () => [...(p[0] ?? [0, 0, 0])] as Pt);
  const cum = [0];
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  const total = cum[cum.length - 1] || 1e-9;
  const out: Pt[] = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const d = (k / (n - 1)) * total;
    while (j < p.length - 1 && cum[j] < d) j++;
    const seg = cum[j] - cum[j - 1] || 1e-9;
    const t = clamp((d - cum[j - 1]) / seg, 0, 1);
    out.push([lerp(p[j - 1][0], p[j][0], t), lerp(p[j - 1][1], p[j][1], t), lerp(p[j - 1][2], p[j][2], t)]);
  }
  return out;
}

const dense = (pts: Pt[]) => resample(catmull(pts), 180);

function smoothstep(a: number, b: number, x: number) {
  const k = clamp((x - a) / (b - a), 0, 1);
  return k * k * (3 - 2 * k);
}

/** Cheap smooth 1-D value noise in 0..1. */
function noise1(x: number) {
  const i = Math.floor(x);
  const f = x - i;
  const r = (n: number) => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  return lerp(r(i), r(i + 1), f * f * (3 - 2 * f));
}

const mkCanvas = (w: number, hgt: number) => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(hgt));
  return c;
};

/** Paint a stroke shape (union of discs along a dense centre line). */
function fillShape(g: CanvasRenderingContext2D, p: Pt[], S: number, ox: number, oy: number) {
  g.beginPath();
  for (const [x, y, w] of p) {
    const r = Math.max(0.6, w * S);
    g.moveTo(ox + x * S + r, oy + y * S);
    g.arc(ox + x * S, oy + y * S, r, 0, Math.PI * 2);
  }
  g.fill();
}

// ---------- paper, desk, seal ----------

function paintDesk(g: CanvasRenderingContext2D, w: number, hgt: number) {
  const grd = g.createLinearGradient(0, 0, w, hgt);
  grd.addColorStop(0, '#2b1d15');
  grd.addColorStop(0.5, '#21160f');
  grd.addColorStop(1, '#160e09');
  g.fillStyle = grd;
  g.fillRect(0, 0, w, hgt);
  // wood grain
  g.lineWidth = Math.max(1, w / 1400);
  for (let i = 0; i < 70; i++) {
    const y0 = (i / 70) * hgt * 1.2 - hgt * 0.1;
    g.strokeStyle = `rgba(${i % 3 ? '90,60,38' : '20,12,8'},${0.05 + (i % 5) * 0.012})`;
    g.beginPath();
    for (let x = 0; x <= w; x += w / 40) {
      const y = y0 + Math.sin(x / (w * 0.13) + i * 1.7) * hgt * 0.012 + Math.sin(x / (w * 0.031) + i) * hgt * 0.003;
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  const v = g.createRadialGradient(w / 2, hgt / 2, Math.min(w, hgt) * 0.3, w / 2, hgt / 2, Math.max(w, hgt) * 0.75);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.55)');
  g.fillStyle = v;
  g.fillRect(0, 0, w, hgt);
}

let grainTile: HTMLCanvasElement | null = null;
function paintPaper(g: CanvasRenderingContext2D, x: number, y: number, w: number, hgt: number, scale: number) {
  g.save();
  g.shadowColor = 'rgba(0,0,0,0.55)';
  g.shadowBlur = 30 * scale;
  g.shadowOffsetY = 10 * scale;
  g.fillStyle = '#eee5cf';
  g.fillRect(x, y, w, hgt);
  g.restore();
  g.save();
  g.beginPath();
  g.rect(x, y, w, hgt);
  g.clip();
  // mottling
  for (let i = 0; i < 36; i++) {
    const cx = x + Math.random() * w;
    const cy = y + Math.random() * hgt;
    const r = (0.08 + Math.random() * 0.25) * w;
    const rg = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, Math.random() < 0.5 ? 'rgba(214,198,160,0.10)' : 'rgba(255,251,240,0.12)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  // fibres
  g.lineCap = 'round';
  const n = Math.round((w * hgt) / (700 * scale * scale));
  for (let i = 0; i < n; i++) {
    const fx = x + Math.random() * w;
    const fy = y + Math.random() * hgt;
    const len = (5 + Math.random() * 26) * scale;
    const a = Math.random() * Math.PI * 2;
    g.strokeStyle = `rgba(${Math.random() < 0.7 ? '130,108,74' : '255,255,250'},${0.04 + Math.random() * 0.08})`;
    g.lineWidth = (0.4 + Math.random() * 0.5) * scale;
    g.beginPath();
    g.moveTo(fx, fy);
    g.quadraticCurveTo(fx + Math.cos(a + 0.6) * len * 0.5, fy + Math.sin(a + 0.6) * len * 0.5, fx + Math.cos(a) * len, fy + Math.sin(a) * len);
    g.stroke();
  }
  // fine grain
  if (!grainTile) {
    grainTile = mkCanvas(128, 128);
    const tg = grainTile.getContext('2d')!;
    const id = tg.createImageData(128, 128);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.random();
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v < 0.5 ? 90 : 255;
      id.data[i + 3] = Math.random() * 16;
    }
    tg.putImageData(id, 0, 0);
  }
  const pat = g.createPattern(grainTile, 'repeat');
  if (pat) {
    g.fillStyle = pat;
    g.fillRect(x, y, w, hgt);
  }
  // edge tone
  const eg = g.createLinearGradient(x, 0, x + w, 0);
  eg.addColorStop(0, 'rgba(150,120,80,0.10)');
  eg.addColorStop(0.08, 'rgba(0,0,0,0)');
  eg.addColorStop(0.92, 'rgba(0,0,0,0)');
  eg.addColorStop(1, 'rgba(150,120,80,0.10)');
  g.fillStyle = eg;
  g.fillRect(x, y, w, hgt);
  g.restore();
}

function paintGrid(g: CanvasRenderingContext2D, x: number, y: number, S: number, scale: number) {
  g.save();
  g.strokeStyle = 'rgba(196,52,40,0.55)';
  g.lineWidth = 1.6 * scale;
  g.strokeRect(x, y, S, S);
  g.strokeStyle = 'rgba(196,52,40,0.26)';
  g.lineWidth = 1 * scale;
  g.setLineDash([7 * scale, 6 * scale]);
  g.beginPath();
  g.moveTo(x + S / 2, y);
  g.lineTo(x + S / 2, y + S);
  g.moveTo(x, y + S / 2);
  g.lineTo(x + S, y + S / 2);
  g.moveTo(x, y);
  g.lineTo(x + S, y + S);
  g.moveTo(x + S, y);
  g.lineTo(x, y + S);
  g.stroke();
  g.restore();
}

/** A brush resting on the desk: bamboo handle, dark tip. */
function paintBrush(g: CanvasRenderingContext2D, x: number, y: number, len: number, ang: number) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const w = len * 0.045;
  g.shadowColor = 'rgba(0,0,0,0.5)';
  g.shadowBlur = len * 0.04;
  g.shadowOffsetY = len * 0.015;
  const bam = g.createLinearGradient(0, -w, 0, w);
  bam.addColorStop(0, '#d8b985');
  bam.addColorStop(0.5, '#b48a52');
  bam.addColorStop(1, '#7a5630');
  g.fillStyle = bam;
  g.beginPath();
  g.roundRect(0, -w / 2, len * 0.78, w, w / 2);
  g.fill();
  g.shadowColor = 'transparent';
  g.strokeStyle = 'rgba(80,50,25,0.6)';
  g.lineWidth = len * 0.004;
  for (const k of [0.22, 0.5]) {
    g.beginPath();
    g.moveTo(len * k, -w / 2);
    g.lineTo(len * k, w / 2);
    g.stroke();
  }
  // ferrule + tip
  g.fillStyle = '#3a2a1c';
  g.fillRect(len * 0.76, -w * 0.55, len * 0.04, w * 1.1);
  const tip = g.createLinearGradient(len * 0.8, 0, len, 0);
  tip.addColorStop(0, '#4a3b2c');
  tip.addColorStop(0.4, '#141110');
  tip.addColorStop(1, '#050404');
  g.fillStyle = tip;
  g.beginPath();
  g.moveTo(len * 0.8, -w * 0.62);
  g.quadraticCurveTo(len * 0.9, -w * 0.7, len, 0);
  g.quadraticCurveTo(len * 0.9, w * 0.7, len * 0.8, w * 0.62);
  g.closePath();
  g.fill();
  g.restore();
}

/** A square red seal, white characters, eroded edges. */
function makeSeal(px: number, text: string[]) {
  const c = mkCanvas(px, px);
  const g = c.getContext('2d')!;
  g.fillStyle = '#c3291d';
  g.beginPath();
  g.roundRect(px * 0.03, px * 0.03, px * 0.94, px * 0.94, px * 0.06);
  g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = '#000';
  g.font = `700 ${px * 0.4}px 'Noto Serif SC', 'Songti SC', serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  // two characters read top-to-bottom, right column first
  if (text.length === 2) {
    g.fillText(text[0], px * 0.5, px * 0.29);
    g.fillText(text[1], px * 0.5, px * 0.71);
  } else {
    g.fillText(text[0], px * 0.7, px * 0.29);
    g.fillText(text[1], px * 0.7, px * 0.71);
    g.fillText(text[2], px * 0.3, px * 0.29);
    g.fillText(text[3], px * 0.3, px * 0.71);
  }
  for (let i = 0; i < px * 1.6; i++) {
    const r = Math.random() * px * 0.012;
    g.globalAlpha = Math.random() * 0.6;
    g.beginPath();
    g.arc(Math.random() * px, Math.random() * px, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
  return c;
}

// ---------- scoring ----------

interface Sample {
  u: number;
  v: number;
  r: number; // radius, cell fraction
  t: number; // ms
}
interface Written {
  samples: Sample[];
  sharp: boolean;
  /** Mean speed, cells/s. */
  speed: number;
}
interface StrokeScore {
  total: number;
  shape: number;
  width: number;
  end: number;
  pace: number;
  reversed: boolean;
}

function toPts(s: Sample[]): Pt[] {
  return s.map((q) => [q.u, q.v, q.r]);
}

function scoreStroke(w: Written, def: StrokeDef): StrokeScore {
  const N = 40;
  const T = resample(catmull(def.pts), N);
  const P = resample(toPts(w.samples), N);
  const dist = (A: Pt[], B: Pt[]) => A.reduce((a, p, i) => a + Math.hypot(p[0] - B[i][0], p[1] - B[i][1]), 0) / N;
  const dF = dist(P, T);
  const dR = dist([...P].reverse(), T);
  const reversed = dR + 0.03 < dF && pathLen(T) > 0.08;
  const d = Math.min(dF, dR);
  const shape = clamp(1 - (d - 0.015) / 0.07, 0, 1);
  // pressure profile (提按): compare shapes of the width curves, and overall weight
  const mp = P.reduce((a, p) => a + p[2], 0) / N || 1e-6;
  const mt = T.reduce((a, p) => a + p[2], 0) / N || 1e-6;
  const prof = P.reduce((a, p, i) => a + Math.abs(p[2] / mp - T[i][2] / mt), 0) / N;
  const ratio = mp / mt;
  const weight = ratio < 0.55 ? ratio / 0.55 : ratio > 1.9 ? clamp(1.9 / ratio, 0, 1) : 1;
  const width = clamp(1 - (prof - 0.12) / 0.6, 0, 1) * (0.5 + 0.5 * weight);
  const end = def.end === 'sharp' ? (w.sharp ? 1 : 0.35) : w.sharp ? 0.55 : 1;
  const pace = Math.exp(-Math.abs(Math.log(Math.max(0.05, w.speed) / def.speed)) / 1.1);
  let total = 0.5 * shape + 0.2 * width + 0.15 * end + 0.15 * pace;
  if (reversed) total = Math.min(total, 0.35);
  return { total, shape, width, end, pace, reversed };
}

function advice(sc: StrokeScore, def: StrokeDef, w: Written, lang: GameCtx['lang']) {
  if (sc.reversed) return L(lang, '方向写反了——注意起笔处的红圈和箭头。', 'Wrong direction — start at the red ring and follow the arrow.');
  const parts: [number, string][] = [
    [sc.shape, L(lang, '再贴近描红的位置与形状。', 'Stay closer to the red guide.')],
    [sc.width, L(lang, '注意提按：该重处重，该轻处轻。', 'Mind the pressure: heavy where the guide is thick, light where it thins.')],
    [
      sc.end,
      def.end === 'sharp'
        ? L(lang, '收笔要出锋：抬笔时别停，顺势送出。', 'End sharp: keep moving as you lift.')
        : L(lang, '收笔要稳：停一下再抬笔，不要甩出。', 'End round: stop, then lift — no flick.'),
    ],
    [sc.pace, w.speed > def.speed ? L(lang, '行笔再慢一些。', 'Slow down a little.') : L(lang, '行笔再果断、快一些。', 'Move more decisively, a little faster.')],
  ];
  parts.sort((a, b) => a[0] - b[0]);
  return sc.total >= 0.85 ? L(lang, '笔力劲健，形神兼备。', 'Strong and true — form and spirit both.') : parts[0][1];
}

/** 64×64 coverage mask of a written character, for comparing the 之s. */
function rasterize(strokes: Written[]) {
  const n = 48;
  const m = new Uint8Array(n * n);
  for (const w of strokes)
    for (const s of resample(toPts(w.samples), 120)) {
      const r = Math.max(1, s[2] * n * 1.3);
      const cx = s[0] * n;
      const cy = s[1] * n;
      for (let y = Math.floor(cy - r); y <= cy + r; y++)
        for (let x = Math.floor(cx - r); x <= cx + r; x++)
          if (x >= 0 && y >= 0 && x < n && y < n && (x - cx) ** 2 + (y - cy) ** 2 <= r * r) m[y * n + x] = 1;
    }
  return m;
}
function iou(a: Uint8Array, b: Uint8Array) {
  let i = 0;
  let u = 0;
  for (let k = 0; k < a.length; k++) {
    i += a[k] & b[k];
    u += a[k] | b[k];
  }
  return u ? i / u : 1;
}

/** How much a free-hand 之 still reads as 之 (chamfer distance to the template), 0..1. */
function recognise(strokes: Written[]) {
  const T: Pt[] = ZHI.flatMap((s) => resample(catmull(s), 40));
  const P: Pt[] = strokes.flatMap((w) => resample(toPts(w.samples), 40));
  if (!P.length) return 0;
  const near = (p: Pt, set: Pt[]) => set.reduce((m, q) => Math.min(m, Math.hypot(p[0] - q[0], p[1] - q[1])), 9);
  const cover = T.reduce((a, p) => a + near(p, P), 0) / T.length;
  const prec = P.reduce((a, p) => a + near(p, T), 0) / P.length;
  return clamp(1 - (Math.max(cover, prec) - 0.045) / 0.11, 0, 1);
}

function features(strokes: Written[]) {
  const all = strokes.flatMap((w) => w.samples);
  const meanR = all.reduce((a, s) => a + s.r, 0) / Math.max(1, all.length);
  const speed = strokes.reduce((a, w) => a + w.speed, 0) / Math.max(1, strokes.length);
  const us = all.map((s) => s.u);
  const vs = all.map((s) => s.v);
  const bw = Math.max(...us) - Math.min(...us);
  const bh = Math.max(...vs) - Math.min(...vs);
  return { meanR, speed, aspect: bw / Math.max(0.05, bh), drags: strokes.length };
}

// ---------- progress ----------

const PROGRESS_KEY = 'orbis.lanting.progress';
type Progress = Record<string, { stars: number; score: number }>;
function readProgress(): Progress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
function saveProgress(id: string, stars: number, score: number) {
  try {
    const all = readProgress();
    const old = all[id];
    all[id] = { stars: Math.max(stars, old?.stars ?? 0), score: Math.max(score, old?.score ?? 0) };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
  } catch {
    /* private mode: progress just isn't kept */
  }
}

const starRow = (n: number) => [0, 1, 2].map((k) => `<span class="${k < n ? 'on' : ''}">★</span>`).join('');
const PUNCT = /[，。；、！？：“”《》·\s]/g;
/** "李白《静夜思》" → 李白, "《诗经·王风·采葛》" → 诗经. */
const authorOf = (by: string) => (by.startsWith('《') ? by.slice(1).split(/[·》]/)[0] : by.split('《')[0]);

interface Mark {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rings: number;
  seed: number;
  t: number;
}

interface Outcome {
  score: number;
  stars: GameResult['stars'];
  headline: { zh: string; en: string };
  lines: { zh: string; en: string }[];
}

// ---------- the game ----------

type Phase = 'menu' | 'intro' | 'write' | 'char-done' | 'zhi' | 'final';

export const mount: MountGame = (root, ctx: GameCtx) => {
  const { lang } = ctx;
  const sfx = createSfx();
  const scratch = sfx.bed(2600, 0.8, 'bandpass');

  const canvas = h('canvas', 'lt-canvas', root);
  const g = canvas.getContext('2d')!;
  const hud = h('div', 'g-hud lt-hud', root);
  h('div', 'g-title', hud, L(lang, '兰亭 · 习字', 'Orchid Pavilion · The Brush'));
  const btnMenu = h('button', 'g-btn ghost lt-back', hud, L(lang, '‹ 字帖', '‹ Copybook'));
  const side = h('div', 'lt-side', hud);
  const stepEl = h('div', 'lt-step', side);
  const bigEl = h('div', 'lt-big', side);
  const modernEl = h('div', 'lt-modern', side);
  const tipEl = h('div', 'lt-tip', side);
  const howEl = h('div', 'lt-how', side);
  const gradeEl = h('div', 'lt-grade', side);
  const dotsEl = h('div', 'lt-dots', side);
  const charsEl = h('div', 'lt-zhis', side);
  const poemEl = h('div', 'lt-poem', side);
  const actions = h('div', 'lt-actions', hud);
  const btnRedo = h('button', 'g-btn ghost', actions, L(lang, '重写', 'Redo'));
  const btnNext = h('button', 'g-btn', actions, L(lang, '下一笔', 'Next'));
  btnRedo.style.visibility = btnNext.style.visibility = 'hidden';
  const menu = h('div', 'lt-menu', hud);
  const result = h('div', 'lt-result', hud);
  const toast = makeToast(hud);
  let dots: HTMLElement[] = [];
  let slots: HTMLElement[] = [];

  // ---------- layout ----------
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const M = 0.12; // ink canvas margin around the cell, cell fractions
  const lay = { W: 1, H: 1, S: 1, cx: 0, cy: 0, portrait: false };
  let bg = mkCanvas(1, 1);
  let desk = mkCanvas(1, 1);
  let ink = mkCanvas(1, 1);
  let ig = ink.getContext('2d')!;
  let guide = mkCanvas(1, 1);
  const cellX = () => lay.cx - lay.S / 2;
  const cellY = () => lay.cy - lay.S / 2;

  function layout() {
    const W = Math.max(1, root.clientWidth);
    const H = Math.max(1, root.clientHeight);
    const portrait = W < H * 0.95;
    const S = Math.round(portrait ? Math.min(W * 0.84, H * 0.5) : Math.min(H * 0.64, W * 0.46, 620));
    Object.assign(lay, { W, H, S, portrait, cx: portrait ? W / 2 : Math.max(W * 0.6, W - S * 0.75 - 40), cy: portrait ? H * 0.585 : H * 0.53 });
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    root.classList.toggle('lt-portrait', portrait);
    // landscape side panel: anchored under the back button below 800px, compact below 600px
    root.classList.toggle('lt-low', !portrait && H < 800);
    root.classList.toggle('lt-short', !portrait && H < 600);
    // landscape: Redo / Next sit under the grade in the side panel, clear of the paper
    if (portrait) hud.insertBefore(actions, menu);
    else side.insertBefore(actions, dotsEl);
    // background: desk, paper, grid, brush
    bg = mkCanvas(W * dpr, H * dpr);
    const bgc = bg.getContext('2d')!;
    paintDesk(bgc, bg.width, bg.height);
    desk = mkCanvas(bg.width, bg.height);
    desk.getContext('2d')!.drawImage(bg, 0, 0);
    const pw = S * 1.34;
    const ph = S * 1.34;
    paintPaper(bgc, (lay.cx - pw / 2) * dpr, (lay.cy - ph / 2) * dpr, pw * dpr, ph * dpr, dpr);
    paintGrid(bgc, cellX() * dpr, cellY() * dpr, S * dpr, dpr);
    if (!portrait) paintBrush(bgc, (lay.cx + pw / 2 + 18) * dpr, (lay.cy - ph * 0.42) * dpr, Math.min(S * 0.95, (W - lay.cx - pw / 2) * 4) * dpr, 1.42);
    // ink: keep what is written, rescaled
    const old = ink;
    ink = mkCanvas(S * (1 + 2 * M) * dpr, S * (1 + 2 * M) * dpr);
    ig = ink.getContext('2d')!;
    if (old.width > 1) ig.drawImage(old, 0, 0, ink.width, ink.height);
    // the undo copy and the 之 snapshot must follow, or Redo after a resize wipes the character
    const rescale = (c: HTMLCanvasElement) => {
      const n = mkCanvas(ink.width, ink.height);
      if (c.width > 1) n.getContext('2d')!.drawImage(c, 0, 0, n.width, n.height);
      return n;
    };
    undo = rescale(undo);
    if (charSnap) charSnap = rescale(charSnap);
    drawGuide();
    if (phase === 'final') buildSheet();
  }

  // ---------- state ----------
  let phase: Phase = 'menu';
  let level: Level = LEVELS[0];
  let ci = 0; // character within the level
  let idx = 0; // stroke within the character (trace) or which 之 (variety)
  let strokes: StrokeDef[] = [];
  let scores: (StrokeScore | null)[][] = [];
  let written: (Written | null)[][] = [];
  let zhiWritten: Written[][] = [[], [], []];
  /** Each finished character at full resolution, with its teacher's circles. */
  let charInks: HTMLCanvasElement[] = [];
  let charMarks: Mark[][] = [];
  let undo = mkCanvas(1, 1);
  let graded = false;
  let autoNext = 0;
  /** Clock of the teacher's demonstration stroke. */
  let demoT = 0;
  let phaseT = 0;
  let introLen = 2;
  let finalSheet: HTMLCanvasElement | null = null;
  let finalAt: [number, number] = [0, 0];
  let finalT = 0;
  let sealed = false;
  let resultShown = false;
  let resultFocus: HTMLButtonElement | null = null;
  let resultStars = 0;
  /** Teacher's red circles (朱批) around good strokes, in cell space. */
  let marks: Mark[] = [];
  let finalSeal: HTMLCanvasElement | null = null;
  let finalSealAt: [number, number] = [0, 0];
  let charSnap: HTMLCanvasElement | null = null;
  const session: { level: Level; score: number; stars: number }[] = [];

  const levelNo = () => LEVELS.indexOf(level) + 1;
  const curChar = () => level.chars[ci];

  function drawGuide() {
    guide = mkCanvas(ink.width, ink.height);
    const gg = guide.getContext('2d')!;
    const S = lay.S * dpr;
    const o = M * S;
    if (phase === 'write' || phase === 'intro') {
      strokes.forEach((d, i) => {
        if (i < idx && phase === 'write') return;
        gg.fillStyle = i === idx && phase === 'write' ? 'rgba(214,64,48,0.26)' : 'rgba(214,64,48,0.1)';
        fillShape(gg, dense(d.pts), S, o, o);
      });
    } else if (phase === 'zhi' && idx === 0) {
      gg.fillStyle = 'rgba(214,64,48,0.13)';
      for (const st of ZHI) fillShape(gg, dense(st), S, o, o);
    }
  }

  // ---------- the brush ----------
  type Bristle = { ox: number; oy: number; th: number; seed: number; ink: number };
  const BR = 40;
  const bristles: Bristle[] = [];
  for (let i = 0; i < BR; i++) {
    // sunflower spread over the unit disc
    const rr = Math.sqrt((i + 0.5) / BR);
    const a = i * 2.39996;
    bristles.push({ ox: Math.cos(a) * rr, oy: Math.sin(a) * rr, th: clamp(0.18 + rr * 0.55 + Math.random() * 0.2, 0, 1), seed: Math.random() * 100, ink: 1 });
  }
  const R_MAX = 0.043; // cell fractions
  const brush = { down: false, u: 0, v: 0, r: 0, ink: 1, sp: 0, lastT: 0, lastMove: 0, dwell: 0, along: 0, pressure: 0.5, pen: false, du: 0, dv: 0 };
  let cur: Sample[] = [];
  let prevPts: { u: number; v: number }[] = [];
  let pointerId = -1;

  const toInk = (u: number, v: number) => [(u + M) * lay.S * dpr, (v + M) * lay.S * dpr] as const;

  function wetness() {
    // a fast brush lays down less ink than it carries: the paper shows through (飞白)
    return brush.ink * clamp(1 - 0.24 * Math.max(0, brush.sp - 0.9), 0.25, 1);
  }

  /** One small step of the brush from (u0,v0) to (u1,v1) in cell space, radius r (cells). */
  function stamp(u0: number, v0: number, u1: number, v1: number, r: number, converge = 1) {
    const [x0, y0] = toInk(u0, v0);
    const [x1, y1] = toInk(u1, v1);
    const rp = r * lay.S * dpr;
    const wet = wetness();
    const len = Math.hypot(u1 - u0, v1 - v0);
    brush.along += len;
    // feathered edge while wet and slow: xuan paper drinks the ink
    if (wet > 0.6 && brush.sp < 1.2) {
      ig.strokeStyle = `rgba(40,34,30,${0.016 * wet})`;
      ig.lineCap = 'butt';
      ig.lineWidth = rp * 2.18;
      ig.beginPath();
      ig.moveTo(x0, y0);
      ig.lineTo(x1, y1);
      ig.stroke();
    }
    // opaque core, shrinking as the brush dries
    const core = smoothstep(0.3, 0.75, wet) * 0.86 * converge;
    if (core > 0.02) {
      const tone = Math.round(lerp(58, 18, smoothstep(0.2, 0.9, wet)));
      ig.strokeStyle = `rgb(${tone},${tone - 4},${tone - 7})`;
      ig.lineCap = 'round';
      ig.lineWidth = Math.max(0.6, rp * 2 * core);
      ig.beginPath();
      ig.moveTo(x0, y0);
      ig.lineTo(x1, y1);
      ig.stroke();
    }
    // bristles: opaque, each its own tone, so round caps never bead
    ig.lineCap = 'round';
    const bw = Math.max(0.6 * dpr, rp * 0.13);
    for (const b of bristles) {
      const need = b.th * 0.9;
      let on = wet > need;
      // a bristle running dry skips in long dashes, so the streaks follow the stroke
      if (!on && wet > need - 0.45) on = noise1(b.seed + brush.along * 20) > (need - wet) * 2 + 0.3;
      if (!on) continue;
      const tone = Math.round(lerp(92, 20, clamp(wet * 1.3, 0, 1)) + (b.seed % 1) * 22 * (1 - wet));
      ig.strokeStyle = `rgb(${tone},${tone - 4},${tone - 8})`;
      ig.lineWidth = bw;
      const k = rp * 0.98 * converge;
      ig.beginPath();
      ig.moveTo(x0 + b.ox * k, y0 + b.oy * k);
      ig.lineTo(x1 + b.ox * k, y1 + b.oy * k);
      ig.stroke();
    }
    // ink use
    brush.ink = Math.max(0, brush.ink - len * (0.55 + 0.3 * brush.sp) * (r / R_MAX));
  }

  function targetR() {
    const pf = brush.pen ? 0.4 + 1.2 * brush.pressure : 1;
    return R_MAX * pf * (1 / (1 + 0.5 * brush.sp)) * (0.78 + 0.22 * brush.ink);
  }

  /** Walk from the last drawn point to (u,v) in small steps. */
  function walk(u: number, v: number) {
    const d = Math.hypot(u - brush.u, v - brush.v);
    const n = Math.max(1, Math.ceil(d / Math.max(0.002, brush.r * 0.3)));
    let pu = brush.u;
    let pv = brush.v;
    const rt = targetR();
    for (let i = 1; i <= n; i++) {
      const nu = lerp(brush.u, u, i / n);
      const nv = lerp(brush.v, v, i / n);
      brush.r += (rt - brush.r) * clamp(d / n / Math.max(0.004, brush.r * 1.4), 0.05, 1);
      stamp(pu, pv, nu, nv, brush.r);
      pu = nu;
      pv = nv;
    }
    brush.u = u;
    brush.v = v;
  }

  function begin(u: number, v: number, t: number, pressure: number, pen: boolean) {
    const ug = undo.getContext('2d')!;
    ug.clearRect(0, 0, undo.width, undo.height);
    ug.drawImage(ink, 0, 0);
    Object.assign(brush, { down: true, u, v, ink: 1, sp: 0, lastT: t, lastMove: t, dwell: 0, along: 0, pressure, pen, du: 0, dv: 0 });
    brush.r = targetR() * 0.5;
    for (const b of bristles) b.ink = 0.8 + Math.random() * 0.25;
    cur = [{ u, v, r: brush.r, t }];
    prevPts = [{ u, v }];
    stamp(u, v, u + 0.0005, v + 0.0005, brush.r);
    sfx.noise({ dur: 0.08, freq: 1800, type: 'bandpass', gain: 0.05, attack: 0.005 });
  }

  function move(u: number, v: number, t: number, pressure: number) {
    const dt = Math.max(1, t - brush.lastT);
    const du = u - prevPts[prevPts.length - 1].u;
    const dv = v - prevPts[prevPts.length - 1].v;
    const d = Math.hypot(du, dv);
    if (d < 0.0008) return;
    const inst = d / (dt / 1000);
    brush.sp = lerp(brush.sp, Math.min(inst, 8), clamp(dt / 45, 0.12, 1));
    brush.pressure = pressure;
    brush.lastT = t;
    brush.lastMove = t;
    brush.dwell = 0;
    brush.du = du / d;
    brush.dv = dv / d;
    prevPts.push({ u, v });
    // midpoint smoothing: walk a quadratic from the previous midpoint to this one
    if (prevPts.length >= 3) {
      const p0 = prevPts[prevPts.length - 3];
      const p1 = prevPts[prevPts.length - 2];
      const m1u = (p0.u + p1.u) / 2;
      const m1v = (p0.v + p1.v) / 2;
      const m2u = (p1.u + u) / 2;
      const m2v = (p1.v + v) / 2;
      const segs = Math.max(2, Math.ceil(Math.hypot(m2u - m1u, m2v - m1v) / 0.006));
      for (let i = 1; i <= segs; i++) {
        const k = i / segs;
        const a = (1 - k) * (1 - k);
        const b = 2 * (1 - k) * k;
        const c = k * k;
        walk(a * m1u + b * p1.u + c * m2u, a * m1v + b * p1.v + c * m2v);
      }
    } else walk((prevPts[0].u + u) / 2, (prevPts[0].v + v) / 2);
    cur.push({ u: brush.u, v: brush.v, r: brush.r, t });
    scratch.set(clamp(brush.sp * 0.05, 0, 0.12) * (0.4 + wetness() * 0.6), 2200 + brush.sp * 400);
  }

  function end(t: number): Written {
    brush.down = false;
    scratch.set(0);
    const last = prevPts[prevPts.length - 1];
    walk(last.u, last.v);
    // speed over the last moment decides the ending: still moving → a sharp tip (出锋)
    const recent = t - brush.lastMove < 60 ? brush.sp : brush.sp * Math.exp(-(t - brush.lastMove) / 50);
    const sharp = recent > 1.1;
    if (sharp) {
      const len = clamp(recent * 0.022, 0.015, 0.075);
      const n = 14;
      let pu = brush.u;
      let pv = brush.v;
      const r0 = brush.r;
      for (let i = 1; i <= n; i++) {
        const k = i / n;
        const nu = brush.u + brush.du * len * k;
        const nv = brush.v + brush.dv * len * k;
        const r = r0 * (1 - k) ** 1.4;
        stamp(pu, pv, nu, nv, Math.max(0.0008, r), 1 - k * 0.85);
        pu = nu;
        pv = nv;
        cur.push({ u: nu, v: nv, r, t: t + k * 30 });
      }
    }
    const L0 = pathLen(toPts(cur));
    const dur = Math.max(0.05, (cur[cur.length - 1].t - cur[0].t) / 1000);
    return { samples: cur, sharp, speed: L0 / dur };
  }

  // dwelling: the brush rests and the ink bleeds into the paper
  function dwell(dt: number, now: number) {
    if (!brush.down || now - brush.lastMove < 70) return;
    brush.dwell += dt;
    brush.sp *= Math.exp(-dt * 8);
    if (brush.dwell > 1.4) return;
    const [x, y] = toInk(brush.u, brush.v);
    const grow = Math.min(R_MAX * 1.15, brush.r + dt * R_MAX * 0.5);
    brush.r = grow;
    const rp = grow * lay.S * dpr;
    ig.fillStyle = 'rgb(20,17,14)';
    ig.beginPath();
    ig.arc(x, y, rp * 0.95 * smoothstep(0.1, 0.6, brush.ink), 0, Math.PI * 2);
    ig.fill();
    const halo = rp * (1.15 + brush.dwell * 0.55);
    const rg = ig.createRadialGradient(x, y, rp * 0.8, x, y, halo);
    rg.addColorStop(0, `rgba(30,26,22,${0.06 * brush.ink})`);
    rg.addColorStop(1, 'rgba(30,26,22,0)');
    ig.fillStyle = rg;
    ig.beginPath();
    ig.arc(x, y, halo, 0, Math.PI * 2);
    ig.fill();
    if (cur.length) cur[cur.length - 1].r = brush.r;
  }

  // ---------- input ----------
  const evCell = (e: PointerEvent) => {
    const rc = canvas.getBoundingClientRect();
    return { u: (e.clientX - rc.left - cellX()) / lay.S, v: (e.clientY - rc.top - cellY()) / lay.S };
  };
  /** A passing stroke that is not the character's last: the player may simply write the next one. */
  const canWriteOn = () => phase === 'write' && graded && autoNext > 0 && idx < strokes.length - 1;
  const accepting = () => (phase === 'write' && !graded) || phase === 'zhi' || canWriteOn();
  const onDown = (e: PointerEvent) => {
    if (!accepting() || brush.down) return;
    const p = evCell(e);
    if (p.u < -M || p.v < -M || p.u > 1 + M || p.v > 1 + M) return;
    if (canWriteOn()) next();
    // another drag on this 之: wait for it before moving on
    if (phase === 'zhi') autoNext = 0;
    pointerId = e.pointerId;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic events have no active pointer */
    }
    e.preventDefault();
    if (phase === 'zhi' && zhiWritten[idx].length === 0) snapshotChar();
    begin(p.u, p.v, e.timeStamp, e.pressure || 0.5, e.pointerType === 'pen');
  };
  const onMove = (e: PointerEvent) => {
    if (!brush.down || e.pointerId !== pointerId) return;
    const evs = e.getCoalescedEvents?.() ?? [];
    for (const ev of evs.length ? evs : [e]) {
      const p = evCell(ev);
      move(p.u, p.v, ev.timeStamp, ev.pressure || 0.5);
    }
  };
  const onUp = (e: PointerEvent) => {
    if (!brush.down || e.pointerId !== pointerId) return;
    const w = end(e.timeStamp);
    pointerId = -1;
    finishStroke(w);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  // ---------- the copybook (level select) ----------
  function showMenu() {
    phase = 'menu';
    autoNext = 0;
    brush.down = false;
    scratch.set(0);
    ig.clearRect(0, 0, ink.width, ink.height);
    marks = [];
    finalSheet = null;
    side.style.display = 'none';
    actions.style.display = 'none';
    btnMenu.style.display = 'none';
    result.classList.remove('show', 'wait');
    renderMenu();
    menu.classList.add('show');
    menu.scrollTop = 0;
  }

  function renderMenu() {
    const prog = readProgress();
    const total = LEVELS.reduce((a, lv) => a + (prog[lv.id]?.stars ?? 0), 0);
    const nextId = LEVELS.find((lv) => !prog[lv.id])?.id;
    menu.innerHTML = '';
    const head = h('div', 'lt-menu-head', menu);
    h('h2', '', head, L(lang, '字帖', 'Copybook'));
    h('p', '', head, L(lang, '任选一个字开始写。每一关都配有一句诗，写完题在纸上。', 'Pick any character to start. Each comes with a line of poetry, written on the finished sheet.'));
    h('span', 'lt-total', head, `★ ${total} / ${LEVELS.length * 3}`);
    GROUPS.forEach((gr, gi) => {
      const sec = h('section', 'lt-group', menu);
      h('h3', '', sec, `${lang === 'zh' ? gr.name.zh : `${gr.name.en} <i>${gr.name.zh}</i>`}<small>${gr.desc[lang]}</small>`);
      const grid = h('div', 'lt-cards', sec);
      for (const lv of LEVELS.filter((x) => x.group === gi)) {
        const n = LEVELS.indexOf(lv) + 1;
        const multi = lv.mode === 'trace' && lv.chars.length > 1;
        const b = h('button', `lt-card${multi ? ' multi' : ''}${lv.id === nextId ? ' next' : ''}`, grid);
        const st = prog[lv.id]?.stars ?? 0;
        b.innerHTML = `<span class="lt-card-ch">${lv.mode === 'variety' ? '之' : lv.chars}</span><b>${lv.name[lang]}</b><em>${starRow(st)}</em>`;
        b.title = `${lv.poem.text} — ${lv.poem.by[lang]}`;
        b.setAttribute('aria-label', `${n}. ${lv.chars} · ${lv.name[lang]} · ${st}/3 ★`);
        b.addEventListener('click', () => {
          sfx.tone({ freq: 659, to: 656, dur: 0.5, type: 'triangle', gain: 0.05 });
          startLevel(lv);
        });
      }
    });
  }

  // ---------- flow ----------
  function startLevel(lv: Level) {
    level = lv;
    ci = 0;
    idx = 0;
    autoNext = 0;
    graded = false;
    resultShown = false;
    finalSheet = null;
    sealed = false;
    charInks = [];
    charMarks = [];
    marks = [];
    charSnap = null;
    zhiWritten = [[], [], []];
    scores = [...lv.chars].map((ch) => (lv.mode === 'trace' ? CHARS[ch].strokes.map(() => null) : []));
    written = scores.map((r) => r.map(() => null));
    ig.clearRect(0, 0, ink.width, ink.height);
    menu.classList.remove('show');
    result.classList.remove('show', 'wait');
    side.style.display = '';
    side.classList.remove('fade');
    actions.style.display = '';
    btnMenu.style.display = '';
    poemEl.innerHTML = poemHtml(lv, true);
    // slots for the characters of a poem line, or the three 之
    charsEl.innerHTML = '';
    slots = lv.chars.length > 1 ? [...lv.chars].map((ch) => h('div', 'lt-zhi', charsEl, `<div class="lt-slot">${ch}</div><span></span>`)) : [];
    const sub = lv.mode === 'variety' ? lv.poem.text : `${lv.poem.text}<small>${lv.poem.by.zh}</small>`;
    toast(lv.mode === 'variety' ? L(lang, '之 · 三变', 'Three 之') : lv.chars, lang === 'zh' ? sub : lv.poem.en, 3000);
    beginChar(2);
  }

  function beginChar(intro: number) {
    graded = false;
    btnRedo.style.visibility = btnNext.style.visibility = 'hidden';
    gradeEl.innerHTML = '';
    slots.forEach((el, i) => el.classList.toggle('cur', i === ci));
    if (level.mode === 'variety') {
      phase = 'zhi';
      dotsEl.style.display = 'none';
      setZhiHud();
      drawGuide();
      return;
    }
    strokes = CHARS[curChar()].strokes;
    idx = 0;
    phase = 'intro';
    phaseT = 0;
    introLen = intro;
    dotsEl.style.display = '';
    dotsEl.innerHTML = '';
    dots = strokes.map((d) => h('span', 'lt-dot', dotsEl, d.key));
    stepEl.textContent = levelLabel();
    bigEl.textContent = curChar();
    bigEl.classList.remove('long');
    modernEl.textContent = L(lang, `共 ${strokes.length} 笔`, `${strokes.length} stroke${strokes.length > 1 ? 's' : ''}`);
    tipEl.innerHTML = '';
    howEl.textContent = level.id === 'yong' ? L(lang, '八笔包含楷书的基本笔法。', 'Eight strokes hold every basic brush movement.') : '';
    drawGuide();
  }

  function levelLabel() {
    const multi = level.chars.length > 1 && level.mode === 'trace';
    const zh = `第 ${levelNo()} 关 · ${multi ? `「${level.chars}」第 ${ci + 1} 字` : level.name.zh}`;
    const en = `Level ${levelNo()} · ${multi ? `${level.chars} · ${ci + 1} of ${level.chars.length}` : level.name.en}`;
    return L(lang, zh, en);
  }

  /** The poem line with the level's characters picked out. */
  function poemHtml(lv: Level, withEn: boolean) {
    const want = new Set(lv.chars);
    const line = [...lv.poem.text].map((c) => (want.has(c) ? `<em>${c}</em>` : c)).join('');
    return `<p>${line}</p><small>— ${lv.poem.by[lang]}</small>${withEn && lang === 'en' ? `<span>${lv.poem.en}</span>` : ''}`;
  }

  function snapshotChar() {
    charSnap = mkCanvas(ink.width, ink.height);
    charSnap.getContext('2d')!.drawImage(ink, 0, 0);
  }

  function setStrokeHud() {
    const d = strokes[idx];
    stepEl.textContent = `${levelLabel()}　${idx + 1} / ${strokes.length}`;
    bigEl.textContent = d.name.zh;
    bigEl.classList.toggle('long', d.name.zh.length > 1);
    modernEl.textContent =
      lang === 'zh'
        ? level.id === 'yong'
          ? `“${d.key}” 即 ${d.modern.zh}`
          : `“${curChar()}”字第 ${idx + 1} 笔${d.modern.zh !== d.name.zh ? ` · ${d.modern.zh}` : ''}`
        : `${d.name.en} · ${d.modern.en}`;
    tipEl.innerHTML = `“${d.tip[lang]}”${d.src ? `<small>— ${d.src[lang]}</small>` : ''}`;
    howEl.textContent = d.how[lang];
    gradeEl.innerHTML = '';
    btnRedo.style.visibility = 'hidden';
    btnNext.style.visibility = 'hidden';
    dots.forEach((el, i) => el.classList.toggle('cur', i === idx));
    demoT = 0;
  }

  function setZhiHud() {
    stepEl.textContent = L(lang, `第 ${levelNo()} 关 · 之字三变　${idx + 1} / 3`, `Level ${levelNo()} · Three ways to write 之　${idx + 1} / 3`);
    bigEl.textContent = '之';
    bigEl.classList.remove('long');
    modernEl.textContent = L(lang, ['第一个：照着描红写', '第二个：换一种写法', '第三个：再变一次'][idx], ['First: follow the red guide', 'Second: write it differently', 'Third: change it once more'][idx]);
    tipEl.innerHTML = idx === 0 ? L(lang, '“变转悉异，遂无同者”<small>— 何延之《兰亭记》</small>', '“Each one transformed; no two alike”<small>— He Yanzhi, Record of the Orchid Pavilion</small>') : '';
    howEl.textContent =
      idx === 0
        ? L(lang, '一点、一折撇、一平捺；行书里后两笔可以一笔连写。', 'A dot, a folded sweep, a flat falling stroke; in running script the last two may join in one movement.')
        : L(lang, '可以更重或更轻、更快或更慢、更斜、更宽，或把笔画连起来——但仍要看得出是“之”。', 'Heavier or lighter, faster or slower, slanted, wider, or joined up — but it must still read as 之.');
    gradeEl.innerHTML = '';
    btnRedo.textContent = L(lang, '重写这个字', 'Rewrite');
    btnNext.textContent = L(lang, '写好了', 'Done');
    btnRedo.style.visibility = 'hidden';
    btnNext.style.visibility = 'hidden';
  }

  function finishStroke(w: Written) {
    if (phase === 'write') {
      const def = strokes[idx];
      const sc = scoreStroke(w, def);
      scores[ci][idx] = sc;
      written[ci][idx] = w;
      graded = true;
      const gr = gradeOf(sc.total);
      gradeEl.innerHTML = `<b style="color:${gr.color}">${lang === 'zh' ? gr.zh : gr.en}</b><span>${advice(sc, def, w, lang)}</span>`;
      gradeEl.classList.remove('pop');
      void gradeEl.offsetWidth;
      gradeEl.classList.add('pop');
      dots[idx].style.setProperty('--c', gr.color);
      dots[idx].classList.add('done');
      if (sc.total >= 0.7) {
        // the teacher's red ring (圈) goes beside the stroke, on the side away from the centre
        const P = resample(toPts(w.samples), 21);
        const [mu, mv] = P[10];
        let nu = -(P[12][1] - P[8][1]);
        let nv = P[12][0] - P[8][0];
        const nl = Math.hypot(nu, nv) || 1;
        nu /= nl;
        nv /= nl;
        if (nu * (mu - 0.5) + nv * (mv - 0.5) < 0) {
          nu = -nu;
          nv = -nv;
        }
        const off = 0.075;
        marks.push({ cx: mu + nu * off, cy: mv + nv * off, rx: 0.024, ry: 0.022, rings: sc.total >= 0.85 ? 2 : 1, seed: Math.random() * 10, t: 0 });
      }
      if (sc.total >= 0.85) {
        sfx.tone({ freq: 784, to: 780, dur: 0.9, type: 'triangle', gain: 0.07 });
        setTimeout(() => sfx.tone({ freq: 1175, to: 1170, dur: 1.1, type: 'triangle', gain: 0.05 }), 120);
      } else if (sc.total >= 0.5) sfx.tone({ freq: 587, to: 584, dur: 0.8, type: 'triangle', gain: 0.07 });
      else sfx.tone({ freq: 220, to: 200, dur: 0.4, type: 'sine', gain: 0.06 });
      const lastStroke = idx === strokes.length - 1;
      const lastChar = ci === level.chars.length - 1;
      btnRedo.textContent = L(lang, '重写', 'Redo');
      btnNext.textContent = !lastStroke
        ? L(lang, '下一笔', 'Next stroke')
        : !lastChar
          ? L(lang, `下一字「${level.chars[ci + 1]}」`, `Next: ${level.chars[ci + 1]}`)
          : L(lang, `完成「${curChar()}」`, `Finish ${curChar()}`);
      btnRedo.style.visibility = btnNext.style.visibility = 'visible';
      btnNext.classList.toggle('ghost', sc.total < 0.5);
      btnRedo.classList.toggle('ghost', sc.total >= 0.5);
      autoNext = sc.total >= 0.5 ? 1.7 : 0;
    } else if (phase === 'zhi') {
      zhiWritten[idx].push(w);
      btnRedo.style.visibility = 'visible';
      btnNext.style.visibility = zhiWritten[idx].length >= 2 ? 'visible' : 'hidden';
      if (zhiWritten[idx].length >= 3) autoNext = 1.1;
    }
  }

  function redo() {
    if (brush.down) return;
    autoNext = 0;
    if (phase === 'write' && graded) {
      ig.clearRect(0, 0, ink.width, ink.height);
      ig.drawImage(undo, 0, 0);
      if (scores[ci][idx] && scores[ci][idx]!.total >= 0.7) marks.pop();
      scores[ci][idx] = null;
      written[ci][idx] = null;
      dots[idx].classList.remove('done');
      graded = false;
      setStrokeHud();
    } else if (phase === 'zhi' && charSnap) {
      ig.clearRect(0, 0, ink.width, ink.height);
      ig.drawImage(charSnap, 0, 0);
      zhiWritten[idx] = [];
      btnRedo.style.visibility = btnNext.style.visibility = 'hidden';
    }
  }

  /** Copy of the ink canvas, and a small thumbnail of it in the character's slot. */
  function keepChar(n: number, label: string) {
    const full = mkCanvas(ink.width, ink.height);
    full.getContext('2d')!.drawImage(ink, 0, 0);
    charInks[n] = full;
    charMarks[n] = marks.map((m) => ({ ...m, t: 1 }));
    const slot = slots[n];
    if (!slot) return;
    const S = lay.S * dpr;
    const th = mkCanvas(132, 132);
    th.className = 'lt-thumb';
    th.getContext('2d')!.drawImage(ink, M * S * 0.6, M * S * 0.6, S * (1 + M * 0.8), S * (1 + M * 0.8), 0, 0, 132, 132);
    slot.querySelector('.lt-slot')?.replaceWith(th);
    slot.querySelector('span')!.textContent = label;
    slot.classList.add('done');
  }

  function next() {
    if (brush.down) return;
    autoNext = 0;
    if (phase === 'write' && graded) {
      graded = false;
      if (idx < strokes.length - 1) {
        idx++;
        setStrokeHud();
        drawGuide();
      } else charDone();
    } else if (phase === 'zhi' && zhiWritten[idx].length > 0) {
      const n = idx;
      const rec = recognise(zhiWritten[n]);
      keepChar(n, rec >= 0.45 ? L(lang, ['之一', '之二', '之三'][n], ['first', 'second', 'third'][n]) : L(lang, '不像“之”', 'not quite 之'));
      sfx.tone({ freq: [523, 587, 659][n], to: [520, 584, 656][n], dur: 0.8, type: 'triangle', gain: 0.06 });
      ig.clearRect(0, 0, ink.width, ink.height);
      if (idx < 2) {
        idx++;
        ci = idx;
        slots.forEach((el, i) => el.classList.toggle('cur', i === idx));
        setZhiHud();
        drawGuide();
      } else startFinal();
    }
  }
  btnRedo.addEventListener('click', redo);
  btnNext.addEventListener('click', next);
  btnMenu.addEventListener('click', showMenu);

  function charDone() {
    phase = 'char-done';
    phaseT = 0;
    drawGuide();
    btnRedo.style.visibility = btnNext.style.visibility = 'hidden';
    dots.forEach((el) => el.classList.remove('cur'));
    const row = scores[ci];
    const avg = row.reduce((a, s) => a + (s?.total ?? 0), 0) / row.length;
    const gr = gradeOf(avg);
    keepChar(ci, lang === 'zh' ? gr.zh : gr.en);
    const sub =
      level.id === 'yong'
        ? L(lang, '八法俱备，一字立成', 'All eight principles in a single character')
        : ci < level.chars.length - 1
          ? L(lang, `下一字：「${level.chars[ci + 1]}」`, `Next: ${level.chars[ci + 1]}`)
          : '';
    toast(`${curChar()} · ${lang === 'zh' ? gr.zh : gr.en}`, sub, 2000);
    sfx.tone({ freq: 523, to: 520, dur: 1.4, type: 'triangle', gain: 0.07 });
    setTimeout(() => sfx.tone({ freq: 784, to: 780, dur: 1.6, type: 'triangle', gain: 0.05 }), 180);
  }

  function afterChar() {
    if (ci < level.chars.length - 1) {
      ci++;
      ig.clearRect(0, 0, ink.width, ink.height);
      marks = [];
      beginChar(0.9);
    } else startFinal();
  }

  // ---------- final sheet ----------
  function startFinal() {
    phase = 'final';
    finalT = 0;
    sealed = false;
    resultShown = false;
    btnRedo.style.visibility = btnNext.style.visibility = 'hidden';
    side.classList.add('fade');
    // the card is laid out (hidden) now, so the sheet can be sized to the space it leaves
    prepareResult();
    buildSheet();
  }

  /**
   * The finished sheet, read right to left in columns: the characters (one big square for a single
   * character, two columns for a four-character line, one tall column for the three 之), then the
   * poem line as the inscription, the author and the seal.
   */
  function buildSheet() {
    const D = dpr;
    // the result card takes the right side (landscape) or the bottom (portrait)
    const top = 54;
    const cardTop = result.classList.contains('show') ? result.offsetTop : lay.H * 0.5;
    const area = lay.portrait ? { x: 0, y: top, w: lay.W, h: Math.max(lay.H * 0.3, cardTop - top - 10) } : { x: 0, y: 44, w: lay.W * 0.62, h: lay.H - 44 };
    const n = charInks.length;
    const rows = n === 4 ? 2 : n === 3 ? 3 : 1;
    const cols = Math.ceil(n / rows);
    const ins = level.poem.text.replace(PUNCT, '');
    const sign = `录${authorOf(level.poem.by.zh)}句`;
    let sheetH = Math.min(area.h * 0.86, 720) * D;
    let geo = { pad: 0, cell: 0, fs: 0, perCol: 1, insCols: 1, sheetW: 0 };
    for (let k = 0; k < 4; k++) {
      const pad = sheetH * 0.07;
      const cell = (sheetH - 2 * pad) / rows;
      const fs = sheetH * 0.048;
      const perCol = Math.max(4, Math.floor((sheetH - 2 * pad) / (fs * 1.22)));
      const insCols = Math.ceil(ins.length / perCol);
      const sheetW = pad * 2 + cols * cell + fs * 1.4 + insCols * fs * 1.5 + fs * 1.9;
      geo = { pad, cell, fs, perCol, insCols, sheetW };
      if (sheetW <= area.w * 0.94 * D) break;
      sheetH *= (area.w * 0.94 * D) / sheetW;
    }
    const { pad, cell, fs, perCol, insCols, sheetW } = geo;
    const c = mkCanvas(sheetW, sheetH);
    const sg = c.getContext('2d')!;
    paintPaper(sg, 0, 0, c.width, c.height, D);
    charInks.forEach((src, i) => {
      const col = Math.floor(i / rows);
      const row = i % rows;
      const x = c.width - pad - (col + 1) * cell;
      const y = pad + row * cell;
      const Sc = src.width / (1 + 2 * M);
      sg.drawImage(src, M * Sc * 0.5, M * Sc * 0.5, Sc * (1 + M), Sc * (1 + M), x, y, cell, cell);
      const k = cell / (1 + M);
      drawMarks(sg, charMarks[i] ?? [], x + (k * M) / 2, y + (k * M) / 2, k, 1);
    });
    sg.fillStyle = 'rgba(30,24,20,0.82)';
    sg.font = `500 ${fs}px 'Noto Serif SC', 'Songti SC', serif`;
    sg.textAlign = 'center';
    sg.textBaseline = 'top';
    const x0 = c.width - pad - cols * cell - fs * 1.4 - fs * 0.75;
    for (let j = 0; j < ins.length; j++) sg.fillText(ins[j], x0 - Math.floor(j / perCol) * fs * 1.5, pad + (j % perCol) * fs * 1.22);
    // signature column: smaller, lower, then the seal
    const sx = x0 - insCols * fs * 1.5 - fs * 0.35;
    const sfs = fs * 0.78;
    sg.fillStyle = 'rgba(30,24,20,0.7)';
    sg.font = `500 ${sfs}px 'Noto Serif SC', 'Songti SC', serif`;
    const sy = pad + fs * 1.5;
    for (let j = 0; j < sign.length; j++) sg.fillText(sign[j], sx, sy + j * sfs * 1.22);
    finalSheet = c;
    finalAt = [area.x * D + (area.w * D - c.width) / 2, area.y * D + (area.h * D - c.height) / 2];
    finalSeal = makeSeal(Math.round(fs * 1.55), level.seal ?? ['兰', '亭']);
    finalSealAt = [sx, Math.min(c.height - pad - fs * 1.6, sy + sign.length * sfs * 1.22 + fs * 0.4)];
  }

  function drawMarks(c: CanvasRenderingContext2D, list: Mark[], ox: number, oy: number, S: number, k: number) {
    c.save();
    c.lineCap = 'round';
    for (const m of list) {
      const prog = clamp(m.t / 0.5, 0, 1) * k + (1 - k);
      for (let ring = 0; ring < m.rings; ring++) {
        c.strokeStyle = 'rgba(204,42,30,0.85)';
        c.lineWidth = Math.max(1, S * 0.0055);
        const grow = 1 - ring * 0.45;
        const a0 = -1.9 + m.seed + ring * 0.7;
        const steps = 40;
        c.beginPath();
        for (let i = 0; i <= steps * prog; i++) {
          const a = a0 + (i / steps) * Math.PI * 2.1;
          const wob = 1 + (noise1(m.seed * 7 + i * 0.3 + ring * 3) - 0.5) * 0.14;
          const x = ox + (m.cx + Math.cos(a) * m.rx * grow * wob) * S;
          const y = oy + (m.cy + Math.sin(a) * m.ry * grow * wob) * S;
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      }
    }
    c.restore();
  }

  // ---------- scoring a level ----------
  function headlineOf(stars: number) {
    return stars === 3
      ? { zh: '笔走龙蛇', en: 'The brush moves like a dragon' }
      : stars === 2
        ? { zh: '颇得笔意', en: 'You have the feel of the brush' }
        : stars === 1
          ? { zh: '初窥门径', en: 'A first step through the gate' }
          : { zh: '墨犹未干', en: 'The ink is still wet' };
  }

  function scoreTrace(): Outcome {
    const all: { sc: StrokeScore; d: StrokeDef; ch: string; w: Written | null }[] = [];
    scores.forEach((row, i) => row.forEach((sc, j) => sc && all.push({ sc, d: CHARS[level.chars[i]].strokes[j], ch: level.chars[i], w: written[i][j] })));
    const total = scores.reduce((a, r) => a + r.length, 0);
    const avg = all.reduce((a, x) => a + x.sc.total, 0) / Math.max(1, total);
    const score = Math.round(clamp(avg * 100, 0, 100));
    // a faithful copy of the template scores ~0.8; most first attempts land at 0.5–0.7
    const stars = (avg >= 0.74 ? 3 : avg >= 0.6 ? 2 : avg >= 0.42 ? 1 : 0) as GameResult['stars'];
    const counts = { 神品: 0, 妙品: 0, 能品: 0 } as Record<string, number>;
    for (const x of all) if (x.sc.total >= 0.5) counts[gradeOf(x.sc.total).zh]++;
    const best = all.reduce((a, x) => (x.sc.total > a.sc.total ? x : a), all[0]);
    const lines = [
      { zh: `${total} 笔：神品 ${counts['神品']} · 妙品 ${counts['妙品']} · 能品 ${counts['能品']}`, en: `${total} strokes: ${counts['神品']} divine · ${counts['妙品']} wonderful · ${counts['能品']} capable` },
    ];
    if (best) {
      const bg = gradeOf(best.sc.total);
      lines.push(
        level.id === 'yong'
          ? { zh: `最佳一笔：${best.d.key}（${best.d.modern.zh}）· ${bg.zh}`, en: `Best stroke: ${best.d.name.en} (${best.d.modern.en}) · ${bg.en}` }
          : { zh: `最佳一笔：“${best.ch}”字的${best.d.name.zh} · ${bg.zh}`, en: `Best stroke: the ${best.d.modern.en} in ${best.ch} · ${bg.en}` },
      );
    }
    if (level.chars.length > 1) {
      const per = scores.map((r, i) => `${level.chars[i]} ${gradeOf(r.reduce((a, s) => a + (s?.total ?? 0), 0) / r.length)[lang]}`);
      lines.push({ zh: per.join(' · '), en: per.join(' · ') });
    }
    const dry = all.filter((x) => x.w && x.w.speed > 1.1).length;
    if (dry) lines.push({ zh: `快笔见飞白：${dry} 笔`, en: `Dry-brush streaks (飞白) in ${dry} fast stroke${dry > 1 ? 's' : ''}` });
    return { score, stars, headline: headlineOf(stars), lines };
  }

  function scoreVariety(): Outcome {
    const recs = zhiWritten.map((z) => recognise(z));
    const masks = zhiWritten.map((z) => rasterize(z));
    const ious = [iou(masks[0], masks[1]), iou(masks[0], masks[2]), iou(masks[1], masks[2])];
    const meanIou = (ious[0] + ious[1] + ious[2]) / 3;
    const fs = zhiWritten.map((z) => features(z));
    let fd = 0;
    for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
      const A = fs[a];
      const B = fs[b];
      fd += Math.min(1, Math.abs(A.meanR - B.meanR) / (0.35 * Math.max(1e-4, (A.meanR + B.meanR) / 2))) * 0.35;
      fd += Math.min(1, Math.abs(Math.log(Math.max(0.05, A.speed) / Math.max(0.05, B.speed))) / 0.7) * 0.35;
      fd += Math.min(1, Math.abs(Math.log(A.aspect / B.aspect)) / 0.4) * 0.15;
      fd += A.drags !== B.drags ? 0.15 : 0;
    }
    fd /= 3;
    const rasterVar = clamp((0.62 - meanIou) / 0.34, 0, 1);
    const recMean = (recs[0] + recs[1] + recs[2]) / 3;
    const variety = (0.6 * rasterVar + 0.4 * fd) * smoothstep(0.25, 0.55, Math.min(...recs));
    const zhiScore = 0.45 * recMean + 0.55 * variety;
    const score = Math.round(clamp(zhiScore * 100, 0, 100));
    const stars = (zhiScore >= 0.75 ? 3 : zhiScore >= 0.55 ? 2 : zhiScore >= 0.35 ? 1 : 0) as GameResult['stars'];
    const lines = [
      {
        zh: `三个“之”：${variety > 0.6 ? '各具姿态，颇得变化之妙' : variety > 0.3 ? '略有变化，还可以更大胆' : '彼此太像了，王羲之可是“无一雷同”'}（相似度 ${Math.round(meanIou * 100)}%）`,
        en: `The three 之: ${variety > 0.6 ? 'each with its own character' : variety > 0.3 ? 'some variety — be bolder' : 'too alike; Wang never repeated himself'} (overlap ${Math.round(meanIou * 100)}%)`,
      },
      { zh: `像不像“之”：${Math.round(recMean * 100)}%`, en: `How much they read as 之: ${Math.round(recMean * 100)}%` },
    ];
    return { score, stars, headline: headlineOf(stars), lines };
  }

  /** Score the level, record it, and lay out the result card, still hidden. */
  function prepareResult() {
    const out = level.mode === 'variety' ? scoreVariety() : scoreTrace();
    const before = readProgress()[level.id]?.stars ?? 0;
    saveProgress(level.id, out.stars, out.score);
    session.push({ level, score: out.score, stars: out.stars });
    const i = LEVELS.indexOf(level);
    const nxt = LEVELS[i + 1];
    result.innerHTML = '';
    h('div', 'gp-stars lt-stars', result, [0, 1, 2].map((k) => `<span class="${k < out.stars ? 'on' : ''}" style="animation-delay:${0.15 + k * 0.2}s">★</span>`).join(''));
    h('h2', '', result, out.headline[lang]);
    h('div', 'lt-score', result, `${L(lang, '得分', 'Score')} <b>${out.score}</b>${out.stars > before && before > 0 ? `<em>${L(lang, '新纪录', 'New best')}</em>` : ''}`);
    const ul = h('ul', '', result);
    for (const ln of out.lines) h('li', '', ul, ln[lang]);
    h('div', 'lt-poem lt-result-poem', result, poemHtml(level, true));
    const row = h('div', 'lt-result-actions', result);
    const bNext = nxt ? h('button', 'g-btn', row, L(lang, `下一关「${nxt.mode === 'variety' ? '之' : nxt.chars}」→`, `Next: ${nxt.mode === 'variety' ? '之' : nxt.chars} →`)) : null;
    const bAgain = h('button', `g-btn${nxt ? ' ghost' : ''}`, row, L(lang, '再写一次', 'Write it again'));
    const bMenu = h('button', 'g-btn ghost', row, L(lang, '换个字', 'Pick another'));
    const bEnd = h('button', 'lt-finish', result, L(lang, '收笔 · 看今日成绩', 'Put down the brush · see today’s scores'));
    bNext?.addEventListener('click', () => startLevel(nxt!));
    bAgain.addEventListener('click', () => startLevel(level));
    bMenu.addEventListener('click', showMenu);
    bEnd.addEventListener('click', finishSession);
    result.classList.add('show', 'wait');
    resultFocus = bNext ?? bAgain;
    resultStars = out.stars;
  }

  function showResult() {
    resultShown = true;
    result.classList.remove('wait');
    resultFocus?.focus({ preventScroll: true });
    if (resultStars >= 2) {
      sfx.tone({ freq: 659, to: 656, dur: 1.2, type: 'triangle', gain: 0.06 });
      setTimeout(() => sfx.tone({ freq: 988, to: 985, dur: 1.4, type: 'triangle', gain: 0.045 }), 160);
    }
  }

  /** Hand the session to the host's result screen. */
  function finishSession() {
    const n = session.length;
    const prog = readProgress();
    const total = LEVELS.reduce((a, lv) => a + (prog[lv.id]?.stars ?? 0), 0);
    const score = n ? Math.round(session.reduce((a, x) => a + x.score, 0) / n) : 0;
    const stars = (n ? clamp(Math.round(session.reduce((a, x) => a + x.stars, 0) / n), 0, 3) : 0) as GameResult['stars'];
    const lines = session.slice(-6).map((x) => {
      const ch = x.level.mode === 'variety' ? '之 ×3' : x.level.chars;
      const st = '★'.repeat(x.stars) + '☆'.repeat(3 - x.stars);
      return { zh: `${ch}　${st}　${x.score} 分`, en: `${ch}　${st}　${x.score}` };
    });
    lines.push({ zh: `字帖进度：★ ${total} / ${LEVELS.length * 3}`, en: `Copybook: ★ ${total} / ${LEVELS.length * 3}` });
    ctx.end({
      score,
      stars,
      headline: { zh: `今日习字 ${n} 关`, en: `${n} level${n === 1 ? '' : 's'} written today` },
      lines,
    });
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLButtonElement && (e.key === 'Enter' || e.key === ' ')) return; // let focused buttons click
    if (e.key === 'Enter' || e.key === ' ') {
      if (phase === 'final') {
        if (resultShown) resultFocus?.click();
      } else if (btnNext.style.visibility === 'visible' && phase !== 'menu') next();
      if (phase !== 'menu') e.preventDefault();
    } else if (e.key === 'Backspace' || e.key.toLowerCase() === 'z') {
      if (btnRedo.style.visibility === 'visible') redo();
    }
  };
  window.addEventListener('keydown', onKey);

  // ---------- frame ----------
  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    phaseT += dt;
    dwell(dt, now);
    for (const m of marks) m.t += dt;
    if (autoNext > 0 && !brush.down) {
      autoNext -= dt;
      if (autoNext <= 0) next();
    }
    if (phase === 'intro' && phaseT > introLen) {
      phase = 'write';
      setStrokeHud();
      drawGuide();
    }
    if (phase === 'char-done' && phaseT > (level.chars.length > 1 ? 1.6 : 2.4)) afterChar();
    if (phase === 'final') {
      finalT += dt;
      if (!sealed && finalT > 1.3) {
        sealed = true;
        sfx.noise({ dur: 0.3, freq: 140, type: 'lowpass', gain: 0.7, attack: 0.005 });
      }
      if (!resultShown && finalT > 2.2) showResult();
    }

    const D = dpr;
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (phase === 'menu') {
      g.drawImage(desk, 0, 0);
      return;
    }
    g.drawImage(bg, 0, 0);
    if (phase === 'final') {
      g.globalAlpha = smoothstep(0, 0.8, finalT);
      g.drawImage(desk, 0, 0);
      g.globalAlpha = 1;
    }
    const ox = (cellX() - M * lay.S) * D;
    const oy = (cellY() - M * lay.S) * D;
    if (phase !== 'final' || finalT < 0.8) {
      g.globalAlpha = phase === 'final' ? 1 - finalT / 0.8 : 1;
      g.drawImage(guide, ox, oy);
      g.drawImage(ink, ox, oy);
      drawMarks(g, marks, cellX() * D, cellY() * D, lay.S * D, 1);
      g.globalAlpha = 1;
    }
    // the teacher's demonstration of the current stroke
    if (phase === 'write' && !graded && !brush.down) drawDemo(strokes[idx].pts, strokes[idx].speed, dt);
    if (phase === 'final' && finalSheet) {
      const k = smoothstep(0.4, 1.3, finalT);
      g.globalAlpha = k;
      const x = finalAt[0];
      const y = finalAt[1] + (1 - k) * 20 * D;
      g.save();
      g.shadowColor = 'rgba(0,0,0,0.6)';
      g.shadowBlur = 40 * D;
      g.drawImage(finalSheet, x, y);
      g.restore();
      if (sealed && finalSeal) {
        const sk = ctx.reduced ? 1 : 1 + 0.5 * Math.exp(-(finalT - 1.3) * 9);
        const sw = finalSeal.width * sk;
        g.globalAlpha = k * 0.92;
        g.drawImage(finalSeal, x + finalSealAt[0] - sw / 2, y + finalSealAt[1], sw, sw);
      }
      g.globalAlpha = 1;
    }
  };

  function drawDemo(pts: Pt[], speed: number, dt: number) {
    const D = dpr;
    const p = dense(pts);
    const len = pathLen(p);
    const S = lay.S * D;
    const ox = cellX() * D;
    const oy = cellY() * D;
    // start ring
    g.strokeStyle = 'rgba(206,44,32,0.85)';
    g.lineWidth = 1.6 * D;
    const pulse = 1 + Math.sin(performance.now() / 260) * 0.12;
    g.beginPath();
    g.arc(ox + p[0][0] * S, oy + p[0][1] * S, (p[0][2] * S + 9 * D) * pulse, 0, Math.PI * 2);
    g.stroke();
    // arrow at the end
    const a = p[p.length - 12];
    const b = p[p.length - 1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const ax = ox + b[0] * S + Math.cos(ang) * 10 * D;
    const ay = oy + b[1] * S + Math.sin(ang) * 10 * D;
    g.fillStyle = 'rgba(206,44,32,0.85)';
    g.beginPath();
    g.moveTo(ax + Math.cos(ang) * 9 * D, ay + Math.sin(ang) * 9 * D);
    g.lineTo(ax + Math.cos(ang + 2.5) * 8 * D, ay + Math.sin(ang + 2.5) * 8 * D);
    g.lineTo(ax + Math.cos(ang - 2.5) * 8 * D, ay + Math.sin(ang - 2.5) * 8 * D);
    g.fill();
    if (ctx.reduced) return;
    // a moving red brush-point at the ideal pace, with a fading trail
    const dur = len / speed + 1.1;
    demoT = (demoT + dt) % dur;
    const k = clamp(demoT / (len / speed), 0, 1);
    if (demoT > len / speed + 0.6) return;
    const n = Math.floor(k * (p.length - 1));
    for (let i = Math.max(0, n - 40); i <= n; i++) {
      const q = p[i];
      g.fillStyle = `rgba(214,58,40,${0.35 * (1 - (n - i) / 40)})`;
      g.beginPath();
      g.arc(ox + q[0] * S, oy + q[1] * S, Math.max(1.5 * D, q[2] * S * 0.55), 0, Math.PI * 2);
      g.fill();
    }
  }

  const ro = new ResizeObserver(() => layout());
  ro.observe(root);
  layout();
  raf = requestAnimationFrame(frame);
  showMenu();

  // Dev-only hook so scripted runs can write with the template strokes.
  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__lanting = {
      state: () => ({ phase, level: level.id, ci, idx, graded, scores: scores.map((r) => r.map((s) => s && +s.total.toFixed(2))), zhi: zhiWritten.map((z) => z.length) }),
      cell: () => {
        const rc = canvas.getBoundingClientRect();
        return { x: rc.left + cellX(), y: rc.top + cellY(), S: lay.S };
      },
      stroke: (i: number) => resample(catmull(strokes[i].pts), 60).map((p) => [p[0], p[1]]),
      speed: (i: number) => strokes[i].speed,
      zhi: (i: number) => resample(catmull(ZHI[i]), 60).map((p) => [p[0], p[1]]),
      level: (id: string) => startLevel(LEVELS.find((lv) => lv.id === id)!),
      levels: () => LEVELS.map((lv) => lv.id),
      menu: showMenu,
      next,
    };

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
      scratch.stop();
      sfx.dispose();
      hud.remove();
      canvas.remove();
    },
  };
};
