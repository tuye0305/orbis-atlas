import * as THREE from 'three';
import type { L10n } from '../../types';
import type { Grade } from '../shared/stage';
import { Kit, jitter, pick, type Rng } from './kit';

/**
 * The four places you can build, each with its own light, water, ground, seed map and a kit of
 * houses, trees, boats, bridges and one landmark, drawn from what the period's sources and
 * surviving buildings show (simplified to a few boxes and lofted roofs).
 */

export type StyleId = 'tenochtitlan' | 'kaifeng' | 'raiatea' | 'amsterdam';

/** What a seed function may set at a point of the map: land (0 deep water … 1 plain … 3 peak) and the paint masks. */
export interface SeedCell {
  L?: number;
  town?: number;
  field?: number;
  tree?: number;
}
export type Noise = (x: number, z: number) => number;

export interface HouseCtx {
  rng: Rng;
  /** Houses among the 8 neighbouring cells. */
  neighbours: number;
  /** Next to a canal / river / shore. */
  waterside: boolean;
}

export interface Bed {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y?: number;
  color: THREE.ColorRepresentation;
}

export interface Stats {
  houses: number;
  fields: number;
  chinampas: number;
  trees: number;
  shoreTrees: number;
  bridges: number;
  windmills: number;
  boats: number;
  shaped: number;
  landmark: boolean;
  landmarkTown: number;
}

export interface Style {
  id: StyleId;
  /** City name for the HUD title. */
  name: L10n;
  /** `short` labels the toolbar button. */
  landmark: { name: L10n; short: L10n; note: L10n };
  sky: { top: string; horizon: string; sun: string };
  fog: { color: string; near: number; far: number };
  sun: { color: string; intensity: number; dir: [number, number, number] };
  hemi: { sky: string; ground: string; intensity: number };
  exposure: number;
  grade: Partial<Grade>;
  water: { shallow: string; deep: string; foam: string; outside: number };
  ground: { sand: string; grass: string; grass2: string; hill: string; rock: string; town: string; field: string };
  /** Land value the Water brush digs down to (the lake or lagoon floor). */
  floorL: number;
  /** Fields painted on shallow water become chinampas. */
  chinampas?: boolean;
  /** How houses turn: toward the nearest water, on the city grid, or any way. */
  orient: 'water' | 'grid' | 'free';
  seed: (x: number, z: number, n: Noise) => SeedCell;
  /** A decoration at the start (the eagle on the cactus), removed when the landmark covers it. */
  prop?: { x: number; z: number; build: (k: Kit) => void };
  house: (k: Kit, c: HouseCtx) => void;
  field: (rng: Rng, onWater: boolean) => Bed[];
  trees: { shore: string[]; land: string[]; hill: string[]; chinampa?: string };
  treeKits: Record<string, (k: Kit) => void>;
  /** The piece of an arched deck (along x) over cell `j` of a crossing `n` cells long. */
  bridge?: (k: Kit, j: number, n: number) => void;
  windmill?: (rng: Rng) => { body: THREE.BufferGeometry; sails: THREE.BufferGeometry; hub: THREE.Vector3 };
  boat: (k: Kit, rng: Rng) => void;
  buildLandmark: (k: Kit) => void;
  /** Far scenery, in world units around the 40 × 40 map. */
  backdrop: (k: Kit, rng: Rng) => void;
  notes: number[];
  bonus: { label: L10n; test: (s: Stats) => boolean };
  /** Wing colour of the birds over the water (egrets, swallows, terns, gulls). */
  bird: string;
  /** Share of houses with a hearth smoking at any time. */
  smoke: number;
}

/* ---------------------------------------------------------------- shared pieces */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const plinth = (k: Kit, w: number, d: number, color: THREE.ColorRepresentation) => k.box(w, 0.34, d, 0, -0.32, 0, color);

/**
 * The part over one cell of an arched deck along x, with rails. The whole arch spans `n` water
 * cells (plus a little of each bank); this cell is the `j`-th of them.
 */
function archBridge(k: Kit, j: number, n: number, o: { rise: number; width: number; deck: THREE.ColorRepresentation; rail: THREE.ColorRepresentation; base?: number; thick?: number; posts?: boolean }) {
  const base = o.base ?? 0.28;
  const A = -0.5 - j - 0.18;
  const B = n - j - 0.5 + 0.18;
  const a = j === 0 ? A : -0.5;
  const b = j === n - 1 ? B : 0.5;
  const rise = o.rise * (1 + (n - 1) * 0.3);
  const y = (x: number) => base + rise * Math.sin((Math.PI * (x - A)) / (B - A));
  const SEG = 9;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const zAxis = new THREE.Vector3(0, 0, 1);
  for (let i = 0; i < SEG; i++) {
    const x0 = a + ((b - a) * i) / SEG;
    const x1 = a + ((b - a) * (i + 1)) / SEG;
    const y0 = y(x0);
    const y1 = y(x1);
    const len = Math.hypot(x1 - x0, y1 - y0) + 0.01;
    q.setFromAxisAngle(zAxis, Math.atan2(y1 - y0, x1 - x0));
    const mid = new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, 0);
    const th = o.thick ?? 0.07;
    m.compose(mid, q, new THREE.Vector3(1, 1, 1));
    k.add(new THREE.BoxGeometry(len, th, o.width), o.deck, m);
    for (const s of [-1, 1]) {
      m.compose(new THREE.Vector3(mid.x, mid.y + 0.11, (s * o.width) / 2), q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.BoxGeometry(len, 0.03, 0.03), o.rail, m);
      if (o.posts !== false && i % 2 === 0) k.box(0.03, 0.12, 0.03, x0, y0, (s * o.width) / 2, o.rail);
    }
  }
}

function mountains(k: Kit, rng: Rng, o: { count: number; r0: number; r1: number; h0: number; h1: number; color: string; snow?: string; arc?: [number, number] }) {
  for (let i = 0; i < o.count; i++) {
    const [a0, a1] = o.arc ?? [0, Math.PI * 2];
    const a = a0 + (a1 - a0) * rng();
    const r = o.r0 + (o.r1 - o.r0) * rng();
    const hh = o.h0 + (o.h1 - o.h0) * rng();
    const w = hh * (2.2 + rng() * 1.6);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    k.cyl(0.6, w, hh, 7, x, -0.5, z, jitter(o.color, rng, 0.01, 0.05, 0.05), rng() * 3);
    if (o.snow && hh > o.h1 * 0.8) k.cyl(0, w * 0.32, hh * 0.32, 7, x, hh * 0.68 - 0.5, z, o.snow, rng() * 3);
  }
}

/* ---------------------------------------------------------------- trees */

const trunk = (k: Kit, h: number, r = 0.035, color = '#6b4a32') => k.cyl(r * 0.7, r, h, 5, 0, 0, 0, color);

const TREES: Record<string, (k: Kit) => void> = {
  willow(k) {
    trunk(k, 0.55, 0.045, '#5d4a36');
    k.sphere(0.24, 0, 0.8, 0, '#93b562', 0.7);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const r = 0.2 + (i % 2) * 0.06;
      k.sphere(0.1, Math.cos(a) * r, 0.52 + (i % 3) * 0.04, Math.sin(a) * r, i % 2 ? '#a9c873' : '#b9d483', 2.6);
    }
  },
  elm(k) {
    trunk(k, 0.45, 0.04);
    k.sphere(0.3, 0, 0.7, 0, '#4f7a3a', 0.9);
    k.sphere(0.22, 0.16, 0.86, 0.08, '#5f8a44', 0.9);
    k.sphere(0.2, -0.14, 0.62, -0.1, '#47703a', 0.9);
  },
  poplar(k) {
    trunk(k, 0.3, 0.03);
    k.sphere(0.16, 0, 0.78, 0, '#5c8442', 3.2);
  },
  pine(k) {
    trunk(k, 0.3, 0.035, '#5b4030');
    k.cyl(0, 0.3, 0.42, 7, 0, 0.22, 0, '#2f5536');
    k.cyl(0, 0.24, 0.38, 7, 0, 0.46, 0, '#36603c');
    k.cyl(0, 0.16, 0.32, 7, 0, 0.68, 0, '#3c6a42');
  },
  peach(k) {
    trunk(k, 0.38, 0.035, '#5a3d30');
    k.sphere(0.24, 0, 0.56, 0, '#f2b8c9', 0.85);
    k.sphere(0.16, 0.13, 0.66, 0.06, '#f7d0dc', 0.85);
    k.sphere(0.12, -0.12, 0.5, -0.06, '#9dbb72', 0.85);
  },
  palm(k) {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const SEG = 6;
    let px = 0;
    let py = 0;
    for (let i = 0; i < SEG; i++) {
      const t = i / SEG;
      const ang = 0.08 + t * 0.32;
      const len = 0.19;
      e.set(0, 0, -ang);
      q.setFromEuler(e);
      m.compose(new THREE.Vector3(px + Math.sin(ang) * len * 0.5, py + Math.cos(ang) * len * 0.5, 0), q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.CylinderGeometry(0.026, 0.034, len, 5), i % 2 ? '#8a7356' : '#7b664c', m);
      px += Math.sin(ang) * len;
      py += Math.cos(ang) * len;
    }
    for (let f = 0; f < 8; f++) {
      const a = (f / 8) * Math.PI * 2;
      e.set(0.5 + (f % 2) * 0.3, a, 0, 'YXZ');
      q.setFromEuler(e);
      const dir = new THREE.Vector3(0, 0, 0.24).applyQuaternion(q);
      m.compose(new THREE.Vector3(px + dir.x, py + dir.y - 0.02, dir.z), q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.BoxGeometry(0.11, 0.012, 0.5), f % 2 ? '#4f8a3a' : '#5f9a44', m);
    }
    k.sphere(0.05, px, py - 0.03, 0, '#6b5a30');
  },
  breadfruit(k) {
    trunk(k, 0.4, 0.05, '#6a5a44');
    k.sphere(0.34, 0, 0.7, 0, '#2f6b35', 0.85);
    k.sphere(0.24, 0.2, 0.62, 0.1, '#3a7a3c', 0.85);
  },
  banana(k) {
    trunk(k, 0.36, 0.035, '#7c8a4a');
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    for (let f = 0; f < 5; f++) {
      const a = (f / 5) * Math.PI * 2;
      q.setFromEuler(new THREE.Euler(-0.7, a, 0, 'YXZ'));
      const dir = new THREE.Vector3(0, 0, 0.18).applyQuaternion(q);
      m.compose(new THREE.Vector3(dir.x, 0.38 + dir.y, dir.z), q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.BoxGeometry(0.16, 0.01, 0.38), '#7fb04a', m);
    }
  },
  pandanus(k) {
    for (let r = 0; r < 3; r++) {
      const a = (r / 3) * Math.PI * 2;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * 0.06, 0.08, Math.sin(a) * 0.06), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4)), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.CylinderGeometry(0.01, 0.012, 0.2, 4), '#7a6650', m);
    }
    k.cyl(0.03, 0.035, 0.42, 5, 0, 0.14, 0, '#7a6650');
    for (let f = 0; f < 9; f++) {
      const a = (f / 9) * Math.PI * 2;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * 0.1, 0.62, Math.sin(a) * 0.1), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9)), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.ConeGeometry(0.025, 0.36, 3), '#5b8a40', m);
    }
  },
  forest(k) {
    trunk(k, 0.3, 0.04);
    k.sphere(0.32, 0, 0.55, 0, '#2c5a30', 0.85);
    k.sphere(0.25, 0.18, 0.48, -0.12, '#356a36', 0.85);
  },
  ahuehuete(k) {
    trunk(k, 0.5, 0.07, '#5a4434');
    k.sphere(0.36, 0, 0.82, 0, '#3d5b35', 0.7);
    k.sphere(0.26, 0.2, 0.66, 0.1, '#46663a', 0.7);
    k.sphere(0.22, -0.18, 0.7, -0.06, '#365231', 0.7);
  },
  ahuejote(k) {
    trunk(k, 0.25, 0.028, '#6a5640');
    k.sphere(0.13, 0, 0.75, 0, '#86a85a', 3.6);
  },
  maguey(k) {
    const m = new THREE.Matrix4();
    for (let f = 0; f < 10; f++) {
      const a = (f / 10) * Math.PI * 2;
      const tilt = 0.35 + (f % 3) * 0.2;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, a, 0, 'YXZ'));
      const dir = new THREE.Vector3(0, 0.2, 0).applyQuaternion(q);
      m.compose(dir, q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.ConeGeometry(0.045, 0.42, 3), f % 2 ? '#6f9e90' : '#7fae9c', m);
    }
  },
  nopal(k) {
    k.sphere(0.12, 0, 0.14, 0, '#5f8f46', 1.2, 1);
    k.sphere(0.09, 0.09, 0.32, 0.02, '#6a9a4c', 1.2, 1);
    k.sphere(0.08, -0.08, 0.3, -0.02, '#578a42', 1.2, 1);
    k.sphere(0.025, 0.1, 0.43, 0, '#e2b23a');
  },
  tule(k) {
    const m = new THREE.Matrix4();
    for (let f = 0; f < 9; f++) {
      const a = (f / 9) * Math.PI * 2;
      const r = 0.04 + (f % 3) * 0.05;
      const hgt = 0.3 + (f % 4) * 0.08;
      m.compose(new THREE.Vector3(Math.cos(a) * r, hgt / 2 - 0.05, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * 0.15, 0, Math.cos(a) * 0.15)), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.CylinderGeometry(0.004, 0.014, hgt, 3), f % 2 ? '#8b9a52' : '#a0a85c', m);
    }
  },
};

/* ---------------------------------------------------------------- Tenochtitlan, 1325–1519 */

const tenochtitlan: Style = {
  id: 'tenochtitlan',
  name: { en: 'Tenochtitlan', zh: '特诺奇提特兰' },
  landmark: {
    name: { en: 'Templo Mayor', zh: '大神庙' },
    short: { en: 'Temple', zh: '大神庙' },
    note: { en: 'Twin shrines to Tlaloc (rain) and Huitzilopochtli (sun and war), said to stand where the eagle was seen.', zh: '双神庙：左祀雨神特拉洛克，右祀太阳与战神维齐洛波奇特利——相传就建在鹰落仙人掌之处。' },
  },
  sky: { top: '#3f7fcf', horizon: '#d7e7f0', sun: '#fff4dc' },
  fog: { color: '#cfe1ea', near: 55, far: 190 },
  sun: { color: '#ffecd0', intensity: 2.0, dir: [0.55, 0.72, 0.4] },
  hemi: { sky: '#bcd8f0', ground: '#8a7a5a', intensity: 0.75 },
  exposure: 0.92,
  grade: { shadows: [0.0, 0.01, 0.03], highlights: [1.03, 1.0, 0.96], contrast: 1.05, saturation: 1.08, vignette: 0.28 },
  water: { shallow: '#6fb3a2', deep: '#2f6f86', foam: '#eef6f0', outside: -0.5 },
  ground: { sand: '#c9b48a', grass: '#7f9f4a', grass2: '#9aa956', hill: '#6f7f48', rock: '#7a6e60', town: '#c9bc9c', field: '#6f8a3c' },
  floorL: 0.32,
  chinampas: true,
  orient: 'grid',
  seed(x, z, n) {
    const d = Math.hypot(x - 0.5, z - 0.5);
    const c: SeedCell = { L: 0.26 + n(x * 0.12 + 3, z * 0.12) * 0.16 };
    if (d < 2.4 + n(x * 0.4, z * 0.4) * 1.2) c.L = 1;
    else if (d < 3.4) c.tree = 0.6;
    const west = -14.5 + n(0.2, z * 0.15) * 3;
    if (x < west) c.L = 1 + Math.min(1.8, (west - x) * 0.35);
    return c;
  },
  prop: {
    x: 0.5,
    z: 0.5,
    build(k) {
      k.cyl(0.18, 0.26, 0.12, 7, 0, 0, 0, '#857a6a');
      k.sphere(0.12, 0, 0.26, 0, '#5f8f46', 1.25, 1);
      k.sphere(0.1, 0.12, 0.42, 0.02, '#6a9a4c', 1.25, 1);
      k.sphere(0.09, -0.1, 0.4, -0.02, '#578a42', 1.25, 1);
      // the eagle, wings half open
      k.sphere(0.06, 0.02, 0.62, 0, '#4a3524', 1.3);
      k.sphere(0.035, 0.02, 0.72, 0.03, '#efe6d0');
      k.tri({ x: 0.02, y: 0.64, z: 0 }, { x: -0.2, y: 0.78, z: -0.1 }, { x: -0.06, y: 0.6, z: 0 }, '#3e2c1e');
      k.tri({ x: 0.02, y: 0.64, z: 0 }, { x: 0.24, y: 0.8, z: -0.1 }, { x: 0.1, y: 0.6, z: 0 }, '#3e2c1e');
    },
  },
  house(k, c) {
    const r = c.rng;
    const wall = pick(r, ['#e2d8c4', '#dccfb4', '#d6c6a6', '#e6dece']);
    plinth(k, 0.92, 0.92, '#a39478');
    if (r() < 0.32 && c.neighbours < 6) {
      // jacal: wattle-and-daub hut with a thatched roof
      const w = 0.5 + r() * 0.12;
      k.box(w, 0.26, w * 0.85, 0, 0, 0, jitter('#c7ab7c', r));
      k.hip(w + 0.16, w * 0.85 + 0.16, 0.34, { ridge: w * 0.3, k: 0.8, y: 0.24 }, jitter('#c4a15c', r));
      k.box(0.12, 0.17, 0.02, 0, 0, w * 0.425 + 0.01, '#3a2a1e');
      return;
    }
    const w = 0.66 + r() * 0.22;
    const d = 0.62 + r() * 0.24;
    const hh = 0.3 + r() * 0.1;
    k.box(w, hh, d, 0, 0, 0, jitter(wall, r, 0.01, 0.03, 0.03));
    const band = pick(r, ['#b4512f', '#c98a3a', '#9a3b2a', '#b4512f', '#c98a3a', '#3f7fb0']);
    // a painted stripe under the roof line, and a low parapet round the flat roof
    k.box(w + 0.02, 0.04, d + 0.02, 0, hh - 0.08, 0, band);
    for (const [px, pz, pw, pd] of [[0, d / 2, w, 0.04], [0, -d / 2, w, 0.04], [w / 2, 0, 0.04, d], [-w / 2, 0, 0.04, d]] as const) k.box(pw + 0.02, 0.05, pd + 0.02, px, hh, pz, jitter(wall, r, 0.01, 0.02, 0.04));
    k.box(0.14, 0.2, 0.02, 0, 0, d / 2 + 0.01, '#2e2219');
    if (r() < 0.5) k.box(w * 0.4, 0.05, d * 0.4, w * 0.15, hh + 0.05, -d * 0.12, '#6f9a48');
    if (c.neighbours >= 4 && r() < 0.4) {
      // two-storey house of a noble, set back on its roof terrace
      const w2 = w * 0.55;
      k.box(w2, 0.24, d * 0.5, -w * 0.18, hh + 0.05, -d * 0.18, jitter(wall, r));
      k.box(w2 + 0.02, 0.04, d * 0.5 + 0.02, -w * 0.18, hh + 0.2, -d * 0.18, band);
    } else if (r() < 0.25) {
      // a small courtyard wing
      k.box(w * 0.35, hh * 0.85, d * 0.5, w * 0.55, 0, d * 0.2, jitter(wall, r));
    }
  },
  field(rng, onWater) {
    if (onWater) {
      // chinampa: two long beds of lake mud built up in the shallows, a canal between
      const beds: Bed[] = [];
      for (const z of [-0.23, 0.23]) {
        beds.push({ x: 0, z, w: 0.96, d: 0.36, h: 0.16, y: -0.1, color: '#5b4a34' });
        beds.push({ x: 0, z, w: 0.9, d: 0.3, h: 0.04, y: 0.06, color: jitter(pick(rng, ['#6f9a3a', '#86a844', '#a3a548', '#5e8a3a']), rng) });
      }
      return beds;
    }
    return [-0.3, 0, 0.3].map((z) => ({ x: 0, z, w: 0.92, d: 0.24, h: 0.06, color: jitter(pick(rng, ['#7a9a3a', '#9aa848', '#b4a84a', '#6f8f3a']), rng) }));
  },
  trees: { shore: ['tule', 'tule', 'ahuejote'], land: ['ahuehuete', 'maguey', 'maguey', 'nopal'], hill: ['pine', 'pine', 'ahuehuete'], chinampa: 'ahuejote' },
  treeKits: TREES,
  bridge(k, j, n) {
    archBridge(k, j, n, { rise: 0.04, width: 0.34, deck: '#7a5a3a', rail: '#6a4a2e', base: 0.24, thick: 0.05 });
  },
  boat(k, rng) {
    k.box(0.72, 0.06, 0.13, 0, -0.02, 0, '#5b3b25');
    k.box(0.6, 0.02, 0.09, 0, 0.03, 0, '#3e281a');
    k.cyl(0.025, 0.03, 0.1, 5, 0.14, 0.03, 0, '#b4865a');
    k.sphere(0.025, 0.14, 0.16, 0, '#3a2a1e');
    if (rng() < 0.6) k.box(0.22, 0.05, 0.1, -0.14, 0.03, 0, pick(rng, ['#7c9a3a', '#d9c07a', '#b84a2a']));
  },
  buildLandmark(k) {
    const stucco = '#e3dccb';
    const W = 2.7;
    const T = 4;
    const th = 0.36;
    plinth(k, W + 0.3, W + 0.3, '#c9bfa8');
    k.box(W + 0.3, 0.04, W + 0.3, 0, 0, 0, '#d9d0bc');
    for (let i = 0; i < T; i++) {
      const w = W - i * 0.38;
      k.box(w, th, w * 0.92, 0, 0.04 + i * th, -i * 0.04, i % 2 ? '#e2dacb' : stucco);
      k.box(w + 0.02, 0.04, w * 0.92 + 0.02, 0, 0.04 + i * th + th - 0.04, -i * 0.04, '#cfc4ad');
    }
    const top = 0.04 + T * th;
    const topW = W - (T - 1) * 0.38;
    // two stairways climbing the west face (here: +z), with red balustrades
    for (const sx of [-0.36, 0.36]) {
      for (let s = 0; s < 12; s++) {
        const y = (top * (s + 1)) / 12;
        const z = THREE.MathUtils.lerp(W * 0.46 + 0.2, topW * 0.46 - 0.12, s / 12);
        k.box(0.5, y, 0.12, sx, 0, z, '#f3eee3');
      }
    }
    for (const bx of [-0.64, 0, 0.64]) {
      for (let s = 0; s < 12; s++) {
        const y = (top * (s + 1)) / 12 + 0.04;
        const z = THREE.MathUtils.lerp(W * 0.46 + 0.2, topW * 0.46 - 0.12, s / 12);
        k.box(0.1, y, 0.12, bx, 0, z, '#b0462e');
      }
    }
    // Tlaloc's shrine (blue and white) and Huitzilopochtli's (red and white)
    const shrine = (x: number, a: string, b: string) => {
      k.box(0.62, 0.42, 0.56, x, top, -0.12, '#f2ede2');
      k.box(0.2, 0.26, 0.02, x, top, 0.17, '#241a14');
      for (let i = 0; i < 3; i++) k.box(0.66 - i * 0.06, 0.1, 0.6 - i * 0.06, x, top + 0.42 + i * 0.1, -0.12, i % 2 ? b : a);
      for (let i = -2; i <= 2; i++) k.box(0.06, 0.08, 0.06, x + i * 0.12, top + 0.72, 0.13, b);
      k.cyl(0.05, 0.06, 0.08, 6, x, top, 0.32, '#3a2a20');
    };
    shrine(-0.38, '#3f7fb5', '#f2ede2');
    shrine(0.38, '#b8322a', '#f2ede2');
  },
  backdrop(k, rng) {
    mountains(k, rng, { count: 22, r0: 95, r1: 140, h0: 6, h1: 14, color: '#7f94a6' });
    // Popocatépetl and Iztaccíhuatl to the south-east, snow on top
    k.cyl(1.2, 34, 28, 9, 70, -0.5, 95, '#8a9db2');
    k.cyl(0, 11, 9, 9, 70, 18.5, 95, '#f4f6f8');
    k.cyl(2, 30, 20, 9, 30, -0.5, 112, '#8799ae');
    k.cyl(1, 12, 6, 9, 30, 13.5, 112, '#f0f3f6');
    mountains(k, rng, { count: 10, r0: 60, r1: 80, h0: 2, h1: 5, color: '#8fa17a', arc: [Math.PI * 0.75, Math.PI * 1.3] });
  },
  notes: [392, 440, 523.25, 587.33, 659.25, 784],
  bonus: { label: { en: 'Chinampas feed the city', zh: '浮田养城' }, test: (s) => s.chinampas >= 12 },
  bird: '#f4f1ea',
  smoke: 0.16,
};

/* ---------------------------------------------------------------- Bianjing (Kaifeng), c. 1100 */

const kaifeng: Style = {
  id: 'kaifeng',
  name: { en: 'Bianjing (Kaifeng)', zh: '东京汴梁' },
  landmark: {
    name: { en: 'Iron Pagoda', zh: '铁塔（开宝寺塔）' },
    short: { en: 'Pagoda', zh: '铁塔' },
    note: { en: 'Built 1049 of glazed bricks the colour of iron: thirteen storeys over the Song capital.', zh: '建于皇祐元年（1049），通体琉璃砖色如铁，十三层，俯瞰汴京。' },
  },
  sky: { top: '#9fb3bf', horizon: '#ece9dd', sun: '#fff1d2' },
  fog: { color: '#e4e2d6', near: 38, far: 140 },
  sun: { color: '#fff0d8', intensity: 2.1, dir: [-0.5, 0.75, 0.45] },
  hemi: { sky: '#dfe6e6', ground: '#8f8a70', intensity: 1.1 },
  exposure: 1.0,
  grade: { shadows: [0.01, 0.015, 0.02], highlights: [1.02, 1.0, 0.95], contrast: 0.98, saturation: 0.9, vignette: 0.3 },
  water: { shallow: '#9cbca8', deep: '#55807a', foam: '#f2f2e8', outside: -1.4 },
  ground: { sand: '#cdbf9c', grass: '#8fae66', grass2: '#a8b878', hill: '#7d935c', rock: '#8a8274', town: '#d9cfb8', field: '#88a65a' },
  floorL: 0.18,
  orient: 'water',
  seed(x, z, n) {
    const r = Math.hypot(x, z * 1.1);
    const c: SeedCell = { L: 0.1 };
    if (r < 12.5 + n(x * 0.12, z * 0.12) * 4) c.L = 1;
    const rz = 0.32 * x + 2.6 * Math.sin(x * 0.2) - 1;
    const dr = Math.abs(z - rz);
    if (dr < 1.5) c.L = 0.18;
    else if (dr < 2.3 && c.L === 1 && n(x * 0.7, 3) > 0.35) c.tree = 0.6;
    if (c.L === 1 && r > 8 && n(x * 0.25 + 9, z * 0.25) > 0.58) c.field = 0.7;
    return c;
  },
  house(k, c) {
    const r = c.rng;
    const w = 0.72 + r() * 0.2;
    const d = 0.6 + r() * 0.2;
    const hh = 0.3 + r() * 0.08;
    const wall = pick(r, ['#ece7da', '#e6e0d0', '#efe9dd', '#8a6446', '#9a7452']);
    const roof = jitter(pick(r, ['#5a6068', '#636970', '#545a62', '#6c6a66']), r, 0.01, 0.03, 0.05);
    plinth(k, w + 0.08, d + 0.08, '#9a958a');
    k.box(w + 0.06, 0.06, d + 0.06, 0, 0, 0, '#a6a196');
    k.box(w, hh, d, 0, 0.06, 0, wall);
    for (const sx of [-1, 1]) k.box(0.05, hh, 0.05, (sx * w) / 2, 0.06, d / 2, '#7e3427');
    k.box(w * 0.4, hh * 0.8, 0.02, 0, 0.06, d / 2 + 0.005, '#4a3326');
    const two = c.neighbours >= 3 && r() < 0.45;
    const top = 0.06 + hh;
    if (two) {
      k.hip(w + 0.3, d + 0.3, 0.14, { ridge: w + 0.1, k: 1.4, lift: 0.04, y: top - 0.02 }, roof);
      const w2 = w * 0.78;
      const d2 = d * 0.72;
      k.box(w2, hh * 0.8, d2, 0, top + 0.06, 0, wall);
      k.box(w2 + 0.04, 0.04, 0.04, 0, top + 0.1, d2 / 2 + 0.02, '#7e3427');
      k.hip(w2 + 0.32, d2 + 0.32, 0.26, { ridge: w2 * 0.55, k: 1.9, lift: 0.07, y: top + 0.06 + hh * 0.8 - 0.02 }, roof);
      k.box(w2 * 0.55, 0.04, 0.04, 0, top + 0.06 + hh * 0.8 + 0.22, 0, '#3d4248');
      // red lanterns under the lower eaves of an inn
      if (r() < 0.5) for (const sx of [-1, 1]) k.sphere(0.035, sx * w * 0.36, top - 0.12, d / 2 + 0.11, '#c8402a', 1.35);
    } else {
      k.hip(w + 0.3, d + 0.3, 0.23, { ridge: w * 0.62, k: 1.9, lift: 0.07, y: top - 0.02 }, roof);
      k.box(w * 0.62, 0.04, 0.04, 0, top + 0.19, 0, '#3d4248');
      for (const sx of [-1, 1]) k.box(0.03, 0.07, 0.03, (sx * w * 0.62) / 2, top + 0.19, 0, '#3d4248');
    }
    if (r() < 0.3) {
      // a shopfront: a cloth awning on two poles over the door, as along the scroll's streets
      const aw = w * 0.7;
      const m = new THREE.Matrix4().compose(new THREE.Vector3(0, 0.06 + hh * 0.78, d / 2 + 0.13), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.35), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.BoxGeometry(aw, 0.015, 0.28), pick(r, ['#d9cba4', '#c9b98e', '#b8a47a']), m);
      for (const sx of [-1, 1]) k.box(0.02, hh * 0.66, 0.02, (sx * aw) / 2 - sx * 0.02, 0.06, d / 2 + 0.25, '#5a3d2a');
    }
    if (c.waterside && r() < 0.35) {
      // a wine-shop banner on a pole
      k.cyl(0.012, 0.015, 0.9, 4, w / 2 + 0.06, 0, d / 2 + 0.06, '#5a3d2a');
      k.box(0.02, 0.3, 0.12, w / 2 + 0.06, 0.52, d / 2 + 0.13, pick(r, ['#c83a2a', '#3f6fa8', '#e8dcc0']));
    }
  },
  field(rng) {
    return [-0.31, 0, 0.31].map((z) => ({ x: 0, z, w: 0.92, d: 0.26, h: 0.05, color: jitter(pick(rng, ['#8fb050', '#a6bc5c', '#7fa048', '#b9b76a']), rng) }));
  },
  trees: { shore: ['willow', 'willow', 'willow', 'peach'], land: ['willow', 'elm', 'peach', 'elm'], hill: ['pine', 'pine', 'elm'] },
  treeKits: TREES,
  bridge(k, j, n) {
    // the rainbow bridge: a pierless timber arch
    archBridge(k, j, n, { rise: 0.42, width: 0.42, deck: '#7b5434', rail: '#8e3a2a', thick: 0.09 });
  },
  boat(k, rng) {
    k.box(0.92, 0.09, 0.24, 0, -0.03, 0, '#6e4b30');
    k.box(0.12, 0.07, 0.2, 0.46, 0.0, 0, '#6e4b30');
    k.box(0.12, 0.07, 0.2, -0.46, 0.0, 0, '#6e4b30');
    const cover = new THREE.CylinderGeometry(0.12, 0.12, 0.42, 8, 1, true, 0, Math.PI);
    cover.rotateZ(Math.PI / 2);
    cover.rotateX(Math.PI / 2);
    cover.translate(-0.05, 0.06, 0);
    k.add(cover, '#a08c62');
    if (rng() < 0.45) {
      k.cyl(0.012, 0.016, 0.9, 4, 0.18, 0.05, 0, '#5a3d2a');
      k.box(0.03, 0.46, 0.34, 0.18, 0.36, 0, '#d9c9a3');
    }
  },
  buildLandmark(k) {
    // the temple courtyard
    plinth(k, 2.9, 2.9, '#9a958a');
    k.box(2.9, 0.06, 2.9, 0, 0, 0, '#cfc6b0');
    for (const [x, z, w, d] of [[0, -1.4, 2.9, 0.1], [-1.4, 0, 0.1, 2.9], [1.4, 0, 0.1, 2.9], [-0.95, 1.4, 1.0, 0.1], [0.95, 1.4, 1.0, 0.1]] as const) {
      k.box(w, 0.26, d, x, 0.06, z, '#e6e0d2');
      k.box(w + 0.06, 0.05, d + 0.06, x, 0.32, z, '#5a6068');
    }
    k.box(0.7, 0.34, 0.24, 0, 0.06, 1.4, '#8a3a2a');
    k.hip(0.95, 0.5, 0.2, { ridge: 0.5, k: 1.8, lift: 0.05, y: 0.4, z: 1.4 }, '#545a62');
    // the pagoda: an octagon of thirteen storeys in iron-brown glaze
    k.cyl(0.8, 0.86, 0.14, 8, 0, 0.06, 0, '#8d8677', Math.PI / 8);
    let y = 0.2;
    for (let i = 0; i < 13; i++) {
      const r = 0.6 - i * 0.026;
      const hh = i === 0 ? 0.42 : 0.24 - i * 0.004;
      k.cyl(r * 0.97, r, hh, 8, 0, y, 0, i % 2 ? '#6a4a36' : '#73513a', Math.PI / 8);
      k.box(0.12, hh * 0.55, 0.02, 0, y + hh * 0.2, r * 0.93, '#2a1d16');
      y += hh;
      k.flare(8, r * 0.9, r + 0.2, 0.09, 0, y - 0.03, 0, '#4b3426', 0.05);
      y += 0.04;
    }
    k.cyl(0.05, 0.12, 0.2, 8, 0, y, 0, '#4b3426');
    k.sphere(0.07, 0, y + 0.26, 0, '#d9b048');
    k.cyl(0.012, 0.02, 0.42, 5, 0, y + 0.2, 0, '#d9b048');
  },
  backdrop(k, rng) {
    mountains(k, rng, { count: 26, r0: 85, r1: 150, h0: 4, h1: 11, color: '#9aa7a6' });
    mountains(k, rng, { count: 14, r0: 60, r1: 80, h0: 1.5, h1: 4, color: '#a9b4a0' });
  },
  notes: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
  bonus: { label: { en: 'Bridges over the Bian', zh: '汴河上的桥' }, test: (s) => s.bridges >= 2 },
  bird: '#3a3632',
  smoke: 0.18,
};

/* ---------------------------------------------------------------- Raʻiatea, c. 1000 */

const raiatea: Style = {
  id: 'raiatea',
  name: { en: 'Raʻiatea', zh: '赖阿特阿岛' },
  landmark: {
    name: { en: 'Marae Taputapuātea', zh: '塔普塔普阿特阿马拉埃' },
    short: { en: 'Marae', zh: '马拉埃' },
    note: { en: 'A paved sacred court with its stepped ahu of coral and basalt, where voyagers gathered.', zh: '以珊瑚与玄武岩砌成的神圣广场与阶梯石台“阿胡”，远航者在此聚会。' },
  },
  sky: { top: '#2f7fd0', horizon: '#c7ecf2', sun: '#fff1cf' },
  fog: { color: '#c9e8ef', near: 60, far: 210 },
  sun: { color: '#fff0d0', intensity: 2.9, dir: [0.35, 0.75, -0.5] },
  hemi: { sky: '#bfe6f6', ground: '#6a8a5a', intensity: 1.0 },
  exposure: 1.02,
  grade: { shadows: [0.0, 0.01, 0.03], highlights: [1.02, 1.0, 0.96], contrast: 1.04, saturation: 1.12, vignette: 0.26 },
  water: { shallow: '#5fe0cf', deep: '#0f4f8c', foam: '#f4fbf8', outside: -2.2 },
  ground: { sand: '#efe1bc', grass: '#5f9a3c', grass2: '#76aa44', hill: '#3f7a36', rock: '#5c5a52', town: '#d9c9a0', field: '#3f7a38' },
  floorL: 0.36,
  orient: 'free',
  seed(x, z, n) {
    const dx = x + 1;
    const dz = z + 1;
    const r = Math.hypot(dx, dz);
    const a = Math.atan2(dz, dx);
    const Ri = 7.2 + n(Math.cos(a) * 2 + 5, Math.sin(a) * 2 + 5) * 2.6;
    const c: SeedCell = { L: 0.05 };
    if (r < Ri) {
      // a coastal plain round a steep green peak
      const t = clamp01(1 - r / (Ri * 0.62));
      c.L = 1 + Math.pow(t, 1.15) * 3.1 + Math.max(0, n(x * 0.5, z * 0.5) - 0.45) * 2 * t;
      if (r > Ri - 0.9) c.tree = 0.6;
      else if (t > 0.2) c.tree = 0.55;
    } else if (r < Ri + 0.5) c.L = 0.75;
    else if (r < 14.6) c.L = 0.36;
    else if (r < 16) {
      c.L = 0.46;
      if (n(Math.cos(a) * 3 + 11, Math.sin(a) * 3 + 11) > 0.66 && r > 14.9 && r < 15.7) {
        c.L = 0.9;
        c.tree = 0.65;
      }
    }
    return c;
  },
  house(k, c) {
    const r = c.rng;
    plinth(k, 0.8, 0.6, '#6e6a60');
    k.box(0.78, 0.05, 0.58, 0, 0, 0, '#8a8478');
    const oval = r() < 0.45;
    const w = oval ? 0.72 + r() * 0.12 : 0.58 + r() * 0.12;
    const d = oval ? 0.48 : 0.42;
    const thatch = jitter(pick(r, ['#b89455', '#a8844a', '#c4a15e', '#9c7a44']), r);
    if (c.waterside && r() < 0.22) {
      // a canoe shed (fare va'a): a long open roof on posts, a hull drawn up under it
      for (const sx of [-1, 0, 1]) for (const sz of [-1, 1]) k.box(0.03, 0.2, 0.03, sx * 0.36, 0.05, sz * 0.2, '#5a4632');
      k.box(0.72, 0.06, 0.1, 0, 0.05, 0, '#6a4628');
      k.box(0.1, 0.06, 0.07, 0.4, 0.08, 0, '#6a4628');
      k.hip(0.98, 0.58, 0.28, { ridge: 0.72, k: 0.7, y: 0.22 }, thatch);
      return;
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) k.box(0.03, 0.16, 0.03, (sx * w) / 2.4, 0.05, (sz * d) / 2.4, '#5a4632');
    k.box(w * 0.8, 0.12, d * 0.8, 0, 0.05, 0, jitter('#c8ad78', r, 0.01, 0.05, 0.08));
    k.hip(w + 0.2, d + 0.24, oval ? 0.42 : 0.5, { ridge: oval ? w * 0.25 : w * 0.55, k: oval ? 0.6 : 0.75, y: 0.1 }, thatch);
    if (r() < 0.3) k.box(0.32, 0.03, 0.22, w * 0.6, 0.05, d * 0.5, '#d9c08a');
  },
  field(rng) {
    // taro patches in wet beds
    const beds: Bed[] = [];
    for (const x of [-0.24, 0.24]) for (const z of [-0.24, 0.24]) {
      beds.push({ x, z, w: 0.42, d: 0.42, h: 0.03, color: '#5a7a64' });
      beds.push({ x, z, w: 0.34, d: 0.34, h: 0.1, y: 0.02, color: jitter(pick(rng, ['#2f6a34', '#3a7a3c', '#477f3a']), rng) });
    }
    return beds;
  },
  trees: { shore: ['palm', 'palm', 'palm', 'pandanus'], land: ['breadfruit', 'palm', 'banana', 'breadfruit'], hill: ['forest', 'forest', 'breadfruit'] },
  treeKits: TREES,
  boat(k, rng) {
    const dbl = rng() < 0.35;
    const hulls = dbl ? [-0.13, 0.13] : [0];
    for (const z of hulls) {
      k.box(0.82, 0.07, 0.1, 0, -0.02, z, '#6a4628');
      k.box(0.12, 0.07, 0.06, 0.45, 0.02, z, '#6a4628');
    }
    if (!dbl) {
      k.box(0.56, 0.05, 0.06, 0.02, -0.02, 0.34, '#7a5634');
      k.box(0.04, 0.03, 0.38, 0.14, 0.04, 0.17, '#5a3d24');
      k.box(0.04, 0.03, 0.38, -0.12, 0.04, 0.17, '#5a3d24');
    } else k.box(0.4, 0.03, 0.36, 0, 0.04, 0, '#8a6a44');
    // crab-claw sail
    const s = dbl ? 1.35 : 1;
    const sail = '#d9c28e';
    k.tri({ x: 0.05, y: 0.04, z: 0 }, { x: -0.32 * s, y: 0.72 * s, z: 0 }, { x: -0.08 * s, y: 0.52 * s, z: 0 }, sail);
    k.tri({ x: 0.05, y: 0.04, z: 0 }, { x: 0.18 * s, y: 0.76 * s, z: 0 }, { x: 0.04 * s, y: 0.54 * s, z: 0 }, sail);
    k.tri({ x: 0.05, y: 0.04, z: 0 }, { x: -0.08 * s, y: 0.52 * s, z: 0 }, { x: 0.04 * s, y: 0.54 * s, z: 0 }, sail);
  },
  buildLandmark(k) {
    plinth(k, 2.9, 2.3, '#6e6b62');
    k.box(2.9, 0.07, 2.3, 0, 0, 0, '#bdb4a0');
    // a low kerb of coral slabs round the court
    for (const [x, z, w, d] of [[0, 1.12, 2.9, 0.08], [-1.42, 0.2, 0.08, 1.9], [1.42, 0.2, 0.08, 1.9]] as const) k.box(w, 0.1, d, x, 0.07, z, '#a9a08c');
    // the stepped ahu at the far end: coral slabs faced on basalt
    for (let i = 0; i < 3; i++) {
      k.box(2.3 - i * 0.42, 0.22, 0.7 - i * 0.16, 0, 0.07 + i * 0.22, -0.65 + i * 0.04, i % 2 ? '#cfc6b2' : '#6f6b62');
      k.box(2.3 - i * 0.42 + 0.02, 0.04, 0.7 - i * 0.16 + 0.02, 0, 0.07 + i * 0.22 + 0.2, -0.65 + i * 0.04, '#d8d0bd');
    }
    // upright backrest stones for the chiefs and priests
    for (let i = 0; i < 7; i++) k.box(0.07, 0.24 + (i % 3) * 0.05, 0.05, -0.81 + i * 0.27, 0.07, 0.3, '#b9b09c');
    // carved wooden figures on the ahu
    for (let i = 0; i < 3; i++) {
      k.box(0.06, 0.26, 0.06, -0.3 + i * 0.3, 0.73, -0.6, '#8a6a4a');
      k.sphere(0.05, -0.3 + i * 0.3, 1.02, -0.6, '#7a5a3e');
    }
    k.box(0.6, 0.03, 0.06, 0, 0.92, -0.6, '#c9a53a');
    // a sacred fare at the side of the court
    k.box(0.32, 0.12, 0.26, 1.0, 0.07, 0.55, '#c8ad78');
    k.hip(0.48, 0.4, 0.3, { ridge: 0.2, k: 0.7, y: 0.17, x: 1.0, z: 0.55 }, '#b89455');
  },
  backdrop(k, rng) {
    // Tahaʻa and Bora Bora on the horizon
    k.cyl(2, 26, 16, 9, -40, -0.5, -95, '#5f8aa0');
    k.cyl(1, 16, 22, 7, -95, -0.5, -110, '#6f95ab');
    k.cyl(0.5, 7, 9, 7, -100, 21, -112, '#6f95ab');
    mountains(k, rng, { count: 5, r0: 120, r1: 160, h0: 4, h1: 10, color: '#7ea2b4', arc: [Math.PI * 0.1, Math.PI * 0.6] });
  },
  notes: [349.23, 392, 440, 523.25, 587.33, 698.46],
  bonus: { label: { en: 'Palms line the lagoon', zh: '椰林环绕泻湖' }, test: (s) => s.shoreTrees >= 16 },
  bird: '#f7f6f2',
  smoke: 0.08,
};

/* ---------------------------------------------------------------- Amsterdam, 1600s */

const amsterdam: Style = {
  id: 'amsterdam',
  name: { en: 'Amsterdam', zh: '阿姆斯特丹' },
  landmark: {
    name: { en: 'Zuiderkerk', zh: '南教堂' },
    short: { en: 'Church', zh: '南教堂' },
    note: { en: 'Hendrick de Keyser’s church of 1603–1611, the first built for Protestant worship in the city.', zh: '亨德里克·德·凯泽设计，1603—1611 年建成，城中第一座为新教礼拜而建的教堂。' },
  },
  sky: { top: '#7f9fbe', horizon: '#f1dfc6', sun: '#ffe2b0' },
  fog: { color: '#dcd4c6', near: 40, far: 150 },
  sun: { color: '#ffd9a6', intensity: 2.4, dir: [-0.6, 0.5, 0.55] },
  hemi: { sky: '#c9d6e2', ground: '#7a705a', intensity: 1.0 },
  exposure: 1.0,
  grade: { shadows: [0.015, 0.02, 0.04], highlights: [1.05, 1.0, 0.93], contrast: 1.04, saturation: 0.95, vignette: 0.32 },
  water: { shallow: '#7f9a8e', deep: '#3a5656', foam: '#eef0e8', outside: -1.2 },
  ground: { sand: '#bfae86', grass: '#6f9a48', grass2: '#86a858', hill: '#62884a', rock: '#7a7466', town: '#9c8f80', field: '#76a04a' },
  floorL: 0.2,
  orient: 'water',
  seed(x, z, n) {
    const c: SeedCell = { L: 0.2 };
    const shore = -4.5 + (n(x * 0.15, 1) - 0.5) * 4;
    if (z > shore && Math.hypot(x, z - 4) < 17 + n(x * 0.1, z * 0.1) * 3) c.L = 0.95;
    const rx = 1.6 * Math.sin(z * 0.16);
    if (z > shore - 1 && Math.abs(x - rx) < 1.3) c.L = 0.2;
    // the dam across the Amstel that gave the city its name
    if (Math.abs(z - (shore + 1.6)) < 0.9 && Math.abs(x - rx) < 2) c.L = 0.95;
    if (c.L === 0.95 && z > 10 && n(x * 0.3, z * 0.3 + 4) > 0.6) c.field = 0.7;
    if (c.L === 0.95 && Math.abs(Math.abs(x - rx) - 1.9) < 0.4 && z > 4 && n(z, 2) > 0.5) c.tree = 0.55;
    return c;
  },
  house(k, c) {
    const r = c.rng;
    const w = 0.8 + r() * 0.12;
    const d = 0.86;
    const n = 2 + (c.neighbours >= 4 ? 1 : 0) + (r() < 0.35 ? 1 : 0);
    const sh = 0.3;
    const H = 0.06 + n * sh;
    const brick = jitter(pick(r, ['#7c2f22', '#8e3b28', '#6d2a20', '#9a4a32', '#5a2a22', '#7a3a2a']), r, 0.01, 0.04, 0.05);
    const wall = r() < 0.1 ? '#e6dfd0' : brick;
    const stone = '#d8cdb6';
    const roof = pick(r, ['#3b3f46', '#46423e', '#7a3c2a', '#3f4448']);
    plinth(k, w + 0.02, d + 0.02, '#5d5850');
    k.box(w, H, d, 0, 0, 0, wall);
    for (let s = 1; s < n; s++) k.box(w + 0.01, 0.025, 0.02, 0, 0.06 + s * sh - 0.02, d / 2 + 0.005, stone);
    const rh = w * 0.8;
    k.gable(d, w, rh, 0, H, 0, roof, Math.PI / 2);
    const type = r();
    const fz = d / 2 - 0.03;
    if (type < 0.38) {
      // stepped gable
      const steps = 5;
      for (let i = 0; i < steps; i++) k.box(w * (1 - i / steps) + 0.02, rh / steps, 0.07, 0, H + (i * rh) / steps, fz, wall);
      k.box(0.08, 0.06, 0.08, 0, H + rh, fz, stone);
    } else if (type < 0.66) {
      // neck gable with stone shoulders
      k.box(w * 0.46, rh * 0.95, 0.07, 0, H, fz, wall);
      for (const sx of [-1, 1]) k.box(w * 0.22, rh * 0.28, 0.07, sx * w * 0.32, H, fz, wall);
      for (const sx of [-1, 1]) k.sphere(0.05, sx * w * 0.32, H + rh * 0.3, fz, stone, 0.9, 0);
      k.box(w * 0.5, 0.05, 0.08, 0, H + rh * 0.95, fz, stone);
    } else if (type < 0.86) {
      // bell gable: a tall centre with a rounded top, low shoulders, a stone finial
      const bw = w * 0.5;
      const bh = rh * 0.7;
      k.box(bw, bh, 0.07, 0, H, fz, wall);
      const cap = new THREE.CylinderGeometry(bw / 2, bw / 2, 0.07, 12, 1, false, Math.PI / 2, Math.PI);
      cap.rotateX(Math.PI / 2);
      cap.translate(0, H + bh, fz);
      k.add(cap, wall);
      for (const sx of [-1, 1]) k.box(w * 0.2, rh * 0.26, 0.07, sx * w * 0.34, H, fz, wall);
      k.box(bw + 0.04, 0.03, 0.08, 0, H + bh - 0.03, fz, stone);
      k.sphere(0.035, 0, H + bh + bw / 2 + 0.01, fz, stone);
    } else {
      k.box(w + 0.02, 0.04, 0.08, 0, H - 0.02, fz, stone);
    }
    // windows: white frames, dark glass, a door on the ground floor
    const cols = w > 0.86 ? 3 : 2;
    for (let s = 0; s < n; s++) {
      for (let ci = 0; ci < cols; ci++) {
        const x = (ci - (cols - 1) / 2) * (w / cols);
        const y = 0.08 + s * sh + 0.04;
        if (s === 0 && ci === Math.floor(cols / 2) && cols === 3) continue;
        k.box(0.15, 0.2, 0.02, x, y, d / 2 + 0.005, '#efe9dc');
        k.box(0.1, 0.07, 0.02, x, y + 0.03, d / 2 + 0.014, '#2a3038');
        k.box(0.1, 0.06, 0.02, x, y + 0.12, d / 2 + 0.014, '#2a3038');
      }
    }
    for (let s = 1; s < n; s++)
      for (const x of [-w / 4, w / 4]) {
        k.box(0.13, 0.18, 0.02, x, 0.12 + s * sh, -d / 2 - 0.005, '#e6dfd0');
        k.box(0.08, 0.13, 0.02, x, 0.145 + s * sh, -d / 2 - 0.014, '#2a3038');
      }
    k.box(0.15, 0.22, 0.02, cols === 3 ? 0 : w / 4, 0, d / 2 + 0.012, '#2f4a3a');
    k.box(0.1, 0.12, 0.02, 0, H + rh * 0.25, d / 2 + 0.015, '#efe9dc');
    k.box(0.03, 0.03, 0.12, 0, H + rh * 0.58, d / 2 + 0.05, '#3a2a20');
    k.box(0.22, 0.05, 0.12, cols === 3 ? 0 : w / 4, -0.03, d / 2 + 0.06, '#8a8478');
  },
  field(rng) {
    const tulips = rng() < 0.3;
    if (tulips) {
      const cols = ['#d8323a', '#f2c230', '#e86fa0', '#f4f0e8', '#9a2b6a', '#e8762a'];
      return [-0.36, -0.12, 0.12, 0.36].map((z) => ({ x: 0, z, w: 0.92, d: 0.18, h: 0.07, color: pick(rng, cols) }));
    }
    return [
      { x: 0, z: -0.22, w: 0.94, d: 0.42, h: 0.03, color: jitter(pick(rng, ['#7fa84e', '#8fb558', '#6f9a44']), rng) },
      { x: 0, z: 0.25, w: 0.94, d: 0.42, h: 0.03, color: jitter(pick(rng, ['#86ad52', '#9bbd62', '#a7a85a']), rng) },
      { x: 0, z: 0.015, w: 0.96, d: 0.05, h: 0.012, y: -0.02, color: '#5f7f80' },
    ];
  },
  trees: { shore: ['elm', 'elm', 'poplar'], land: ['elm', 'poplar', 'elm'], hill: ['elm'] },
  treeKits: TREES,
  bridge(k, j, n) {
    archBridge(k, j, n, { rise: 0.24, width: 0.44, deck: '#8a4632', rail: '#f0ece2', thick: 0.13 });
  },
  windmill(rng) {
    const k = new Kit();
    plinth(k, 0.7, 0.7, '#6d675c');
    k.cyl(0.42, 0.44, 0.12, 8, 0, 0, 0, '#8a8274');
    k.cyl(0.2, 0.32, 1.05, 8, 0, 0.12, 0, jitter('#4f5a4a', rng, 0.01, 0.04, 0.06));
    k.cyl(0.36, 0.36, 0.05, 8, 0, 0.46, 0, '#6a5a44');
    k.hip(0.42, 0.5, 0.2, { ridge: 0.14, k: 0.8, y: 1.15 }, '#3f4842');
    k.box(0.12, 0.18, 0.02, 0, 0.12, 0.31, '#2f2a24');
    const body = k.build();
    const s = new Kit();
    s.box(0.06, 0.06, 0.08, 0, -0.03, 0, '#3a2a20');
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const m = new THREE.Matrix4().makeRotationZ(a);
      const arm = new THREE.BoxGeometry(0.03, 0.72, 0.02);
      arm.translate(0, 0.38, 0);
      s.add(arm, '#5a4636', m);
      const sail = new THREE.BoxGeometry(0.13, 0.56, 0.01);
      sail.translate(0.08, 0.44, 0);
      s.add(sail, '#efe6d2', m);
    }
    return { body, sails: s.build(), hub: new THREE.Vector3(0, 1.22, 0.3) };
  },
  boat(k, rng) {
    k.box(0.92, 0.12, 0.26, 0, -0.04, 0, '#4b3526');
    k.box(0.14, 0.1, 0.22, 0.46, -0.01, 0, '#4b3526');
    k.box(0.8, 0.02, 0.22, 0, 0.08, 0, '#8a6a44');
    k.cyl(0.012, 0.016, 1.0, 4, 0.08, 0.08, 0, '#3a2a20');
    const sail = pick(rng, ['#ece2cc', '#cfa46a', '#e6d8b8']);
    k.tri({ x: 0.08, y: 0.18, z: 0 }, { x: 0.08, y: 1.02, z: 0 }, { x: -0.42, y: 0.2, z: 0 }, sail);
    k.tri({ x: 0.08, y: 1.02, z: 0 }, { x: -0.38, y: 0.86, z: 0 }, { x: -0.42, y: 0.2, z: 0 }, sail);
    k.tri({ x: 0.1, y: 0.18, z: 0 }, { x: 0.1, y: 0.8, z: 0 }, { x: 0.46, y: 0.12, z: 0 }, sail);
    k.box(0.18, 0.22, 0.02, 0, -0.1, 0.14, '#3a2a20');
  },
  buildLandmark(k) {
    plinth(k, 2.6, 2.9, '#6d675c');
    k.box(2.6, 0.05, 2.9, 0, 0, 0, '#9c9284');
    const brick = '#8a3a2a';
    const stone = '#e4dccb';
    // nave
    k.box(1.3, 0.95, 2.1, 0, 0.05, -0.35, brick);
    for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) k.box(0.02, 0.5, 0.16, (sx * 1.3) / 2 + sx * 0.005, 0.25, -1.2 + i * 0.42, '#2f3640');
    for (let i = 0; i < 5; i++) for (const sx of [-1, 1]) k.box(0.03, 0.06, 0.2, (sx * 1.3) / 2 + sx * 0.01, 0.75, -1.2 + i * 0.42, stone);
    k.gable(2.1, 1.36, 0.75, 0, 1.0, -0.35, '#3b3f46', Math.PI / 2);
    // tower: brick base, then stone stages, an octagonal lantern with a clock, a lead spire
    const tz = 0.95;
    k.box(0.72, 1.6, 0.72, 0, 0.05, tz, brick);
    k.box(0.78, 0.06, 0.78, 0, 1.65, tz, stone);
    k.box(0.6, 0.6, 0.6, 0, 1.71, tz, stone);
    for (const [x, z] of [[0, 0.31], [0.31, 0], [-0.31, 0], [0, -0.31]] as const) k.box(z ? 0.16 : 0.02, 0.36, z ? 0.02 : 0.16, x, 1.82, tz + z, '#2f3640');
    k.cyl(0.36, 0.38, 0.06, 8, 0, 2.31, tz, stone, Math.PI / 8);
    k.cyl(0.26, 0.28, 0.5, 8, 0, 2.37, tz, stone, Math.PI / 8);
    k.cyl(0.1, 0.1, 0.02, 12, 0, 2.55, tz + 0.27, '#f1e2b0');
    k.cyl(0.21, 0.23, 0.36, 8, 0, 2.87, tz, '#4f5d5c', Math.PI / 8);
    k.cyl(0, 0.22, 1.2, 8, 0, 3.23, tz, '#4d5b5a', Math.PI / 8);
    k.sphere(0.05, 0, 4.45, tz, '#d9b048');
    k.cyl(0.008, 0.012, 0.3, 4, 0, 4.45, tz, '#d9b048');
  },
  backdrop(k, rng) {
    // the flat land across the IJ: a low line of dunes and woods
    for (let i = 0; i < 40; i++) {
      const a = rng() * Math.PI * 2;
      const r = 70 + rng() * 40;
      k.sphere(4 + rng() * 6, Math.cos(a) * r, -1.5, Math.sin(a) * r, jitter('#7f8f70', rng), 0.35);
    }
  },
  notes: [523.25, 659.25, 783.99, 1046.5, 880, 1174.66],
  bonus: { label: { en: 'Windmills drain the polder', zh: '风车排干圩田' }, test: (s) => s.windmills >= 3 },
  bird: '#eef0f0',
  smoke: 0.22,
};

export const STYLES: Record<StyleId, Style> = { tenochtitlan, kaifeng, raiatea, amsterdam };
