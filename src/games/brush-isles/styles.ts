import * as THREE from 'three';
import type { L10n } from '../../types';
import type { Grade } from '../shared/stage';
import { Kit, jitter, type Rng } from './kit';

/**
 * The style contract for the four places you can build (each with its own light, water, ground,
 * seed map and a kit of houses, trees, boats, bridges and one landmark), plus the pieces they
 * share. The cities themselves live in `cities/`, one file each.
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
  /** Small things strewn over open ground and shallows (grass, flowers, stones, lily pads, cattle). */
  scatter?: Scatter[];
  /** The surface of the town's streets and yards, drawn by the terrain shader under the houses. */
  paving?: { kind: 'stucco' | 'brick' | 'flag' | 'earth'; color: string; joint: string };
  /** Townsfolk walking the lanes between houses: clothing colours and skin tone. */
  people?: { clothes: string[]; skin: string };
  /** Cloud banks on the horizon and how dark their shadows are as they pass over the map (0–1). */
  clouds?: { color: string; shade: string; shadow: number };
}

export type ScatterZone = 'grass' | 'shore' | 'shallows' | 'hill';
export interface Scatter {
  /** Where it grows: open flat land, the beach / bank, high ground, or shallow water. */
  zone: ScatterZone;
  /** One small model (built once, instanced everywhere; tinted ±10% per copy). */
  kit: (k: Kit) => void;
  /** Mean copies per 1 × 1 cell of that zone. */
  density: number;
  scale?: [number, number];
  /** Sits on the water surface rather than the lake bed (lily pads). */
  float?: boolean;
  /** Keep its shadow off (tiny things: cheaper and cleaner). Default false. */
  shadow?: boolean;
}

/* ---------------------------------------------------------------- shared pieces */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const plinth = (k: Kit, w: number, d: number, color: THREE.ColorRepresentation) => k.box(w, 0.34, d, 0, -0.32, 0, color);

/**
 * The part over one cell of an arched deck along x, with rails. The whole arch spans `n` water
 * cells (plus a little of each bank); this cell is the `j`-th of them.
 */
export function archBridge(k: Kit, j: number, n: number, o: { rise: number; width: number; deck: THREE.ColorRepresentation; rail: THREE.ColorRepresentation; base?: number; thick?: number; posts?: boolean }) {
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

export function mountains(k: Kit, rng: Rng, o: { count: number; r0: number; r1: number; h0: number; h1: number; color: string; snow?: string; arc?: [number, number] }) {
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

/* ---------------------------------------------------------------- ground scatter */

/** Ready-made scatter models; each city picks and tints its own. */
export const SCATTER = {
  /** A tuft of grass: a dozen thin, flattened blades arching out from one point. */
  tuft: (a: string, b: string) => (k: Kit) => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < 12; i++) {
      const ang = i * 2.39996;
      const lean = 0.18 + (i % 4) * 0.12;
      const hh = 0.045 + ((i * 7) % 5) * 0.009;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.cos(ang) * lean, ang, Math.sin(ang) * lean, 'YXZ'));
      const r = 0.012 + (i % 3) * 0.01;
      m.compose(new THREE.Vector3(Math.cos(ang) * r, hh / 2, Math.sin(ang) * r), q, new THREE.Vector3(1, 1, 0.25));
      k.add(new THREE.ConeGeometry(0.012, hh, 3), i % 3 ? a : b, m);
    }
  },
  /** A few stems with flower heads. */
  flowers: (stem: string, petals: string[]) => (k: Kit) => {
    for (let i = 0; i < 5; i++) {
      const ang = i * 2.4;
      const r = 0.025 + (i % 2) * 0.035;
      const hh = 0.07 + (i % 3) * 0.03;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      k.cyl(0.004, 0.006, hh, 3, x, 0, z, stem);
      k.sphere(0.022, x, hh + 0.01, z, petals[i % petals.length], 0.7, 0);
    }
  },
  /** A cluster of rounded stones. */
  stones: (a: string, b: string) => (k: Kit) => {
    k.sphere(0.06, 0, 0.02, 0, a, 0.6, 0);
    k.sphere(0.04, 0.07, 0.01, 0.03, b, 0.6, 0);
    k.sphere(0.03, -0.05, 0.01, 0.05, a, 0.7, 0);
  },
  /** A round floating leaf, optionally with a flower in the middle. */
  lily: (pad: string, flower?: string) => (k: Kit) => {
    k.cyl(0.08, 0.08, 0.008, 9, 0, 0, 0, pad);
    k.cyl(0.05, 0.05, 0.008, 7, 0.1, 0, 0.04, pad);
    if (flower) {
      k.sphere(0.03, 0.01, 0.025, 0, flower, 0.8, 0);
      k.sphere(0.012, 0.01, 0.045, 0, '#f2d65a', 1, 0);
    }
  },
  /** A fern: arching fronds from the ground. */
  fern: (a: string, b: string) => (k: Kit) => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.9, ang, 0, 'YXZ'));
      const dir = new THREE.Vector3(0, 0, 0.09).applyQuaternion(q);
      m.compose(new THREE.Vector3(dir.x, 0.05 + dir.y * 0.3, dir.z), q, new THREE.Vector3(1, 1, 1));
      k.add(new THREE.BoxGeometry(0.05, 0.006, 0.2), i % 2 ? a : b, m);
    }
  },
};

/* ---------------------------------------------------------------- trees */

export const trunk = (k: Kit, h: number, r = 0.035, color = '#6b4a32') => k.cyl(r * 0.7, r, h, 5, 0, 0, 0, color);

export const TREES: Record<string, (k: Kit) => void> = {
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
