import * as THREE from 'three';
import { Kit, jitter, pick } from '../kit';
import { TREES, archBridge, plinth, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Amsterdam, 1600s */

export const amsterdam: Style = {
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
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#6f9a48', '#86a858'), density: 1.6, scale: [0.8, 1.3] },
    { zone: 'grass', kit: SCATTER.flowers('#5a7a3a', ['#f2d23a', '#f4f0e6']), density: 0.3 },
    { zone: 'shore', kit: SCATTER.stones('#8a8070', '#6e665a'), density: 0.15 },
    { zone: 'shallows', kit: SCATTER.lily('#5a7f4a'), density: 0.08, float: true },
  ],
  paving: { kind: 'brick', color: '#9a5e48', joint: '#6e5648' },
  people: { clothes: ['#2a2a2e', '#3a3430', '#5a3a2a', '#2e3a4a', '#7a2a24', '#2a2a2e'], skin: '#e8c4a8' },
  clouds: { color: '#fbf6ee', shade: '#c4c8cf', shadow: 0.34 },
};
