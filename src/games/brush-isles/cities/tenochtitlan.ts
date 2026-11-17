import * as THREE from 'three';
import { jitter, pick } from '../kit';
import { TREES, archBridge, mountains, plinth, type Bed, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Tenochtitlan, 1325–1519 */

export const tenochtitlan: Style = {
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
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#9aa456', '#b3b064'), density: 1.6, scale: [0.8, 1.3] },
    { zone: 'grass', kit: SCATTER.flowers('#6a8a3a', ['#f2a51a', '#f7c33a', '#e8751a']), density: 0.35 },
    { zone: 'shore', kit: SCATTER.stones('#9a8e7c', '#7d7262'), density: 0.25 },
    { zone: 'shallows', kit: SCATTER.lily('#5f8f4a', '#f4f0e6'), density: 0.12, float: true },
  ],
  paving: { kind: 'stucco', color: '#e2d9c4', joint: '#c4b89e' },
  people: { clothes: ['#efe9dc', '#e9e1cd', '#efe9dc', '#c8452f', '#2f7fa8', '#e0b23a'], skin: '#9a6a48' },
  clouds: { color: '#ffffff', shade: '#c9d6e6', shadow: 0.3 },
};
