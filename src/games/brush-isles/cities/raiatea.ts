import { jitter, pick } from '../kit';
import { TREES, clamp01, mountains, plinth, type Bed, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Raʻiatea, c. 1000 */

export const raiatea: Style = {
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
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#5f9a3c', '#76aa44'), density: 1.2, scale: [0.9, 1.4] },
    { zone: 'grass', kit: SCATTER.flowers('#3f7a36', ['#e0382a', '#f26a3a', '#f4e04a']), density: 0.25 },
    { zone: 'hill', kit: SCATTER.fern('#3f7a36', '#4f8a3c'), density: 1.2, scale: [1, 1.6] },
    { zone: 'shore', kit: SCATTER.stones('#e9e1cf', '#5c5a52'), density: 0.3 },
  ],
  paving: { kind: 'earth', color: '#e6dcc0', joint: '#cbbd98' },
  people: { clothes: ['#d8c49a', '#b8863c', '#e9dcc0', '#8a4a2a'], skin: '#8a5a3a' },
  clouds: { color: '#ffffff', shade: '#bcd6e6', shadow: 0.32 },
};
