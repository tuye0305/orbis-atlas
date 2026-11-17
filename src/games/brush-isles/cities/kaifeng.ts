import * as THREE from 'three';
import { jitter, pick } from '../kit';
import { TREES, archBridge, mountains, plinth, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Bianjing (Kaifeng), c. 1100 */

export const kaifeng: Style = {
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
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#8fae66', '#a6bd78'), density: 1.4, scale: [0.8, 1.3] },
    { zone: 'grass', kit: SCATTER.flowers('#6f8a4a', ['#f4f0e6', '#e9c8d6', '#f2d65a']), density: 0.25 },
    { zone: 'shore', kit: SCATTER.stones('#a39a88', '#867e70'), density: 0.2 },
    { zone: 'shallows', kit: SCATTER.lily('#6f9a5a', '#f2b8c9'), density: 0.18, float: true },
  ],
  paving: { kind: 'earth', color: '#cfbd98', joint: '#b39f78' },
  people: { clothes: ['#3b4a63', '#7a5a3a', '#e8e2d2', '#5a6e5a', '#9a3a2e', '#d9cfb8'], skin: '#d8b08a' },
  clouds: { color: '#f6f3ea', shade: '#cfd2cc', shadow: 0.2 },
};
