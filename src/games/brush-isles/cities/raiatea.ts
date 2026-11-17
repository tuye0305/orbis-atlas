import * as THREE from 'three';
import { Kit, jitter, loft, pick, type Rng } from '../kit';
import { TREES, clamp01, plinth, type Bed, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Raʻiatea, c. 1000 */

/* ---------- palette */

const THATCH = ['#b4935a', '#a58550', '#c2a265', '#9a7c48', '#ab8a52'];
const REED = ['#c9ae78', '#bfa26c', '#d2b986', '#b89a64'];
const POST = ['#5a4430', '#634a33', '#4e3b2a'];
const WOOD = '#6e4f33';
const HULL = ['#6a4628', '#5e3f25', '#734d2d'];
const MAT = ['#d9c48e', '#cdb47c', '#e0cd9c', '#c4a96e'];
const TAPA = ['#e8dbbc', '#dcc9a0', '#c99a5a', '#8e4a2c', '#e2d2ae'];
/** Weathered marae stone: dark basalt, grey basalt, cream and grey coral limestone. */
const BASALT = ['#5a5752', '#625e57', '#6c6860', '#55524d', '#736e64'];
const CORAL = ['#a3957c', '#988b74', '#ad9f86', '#8f846f', '#a69a82', '#a39580'];
const LICHEN = ['#a8a77a', '#b39a62', '#8d957a', '#bdb48c', '#7f8a68'];
const STAIN = '#3f3d38';
const SKIN = '#8a5a3a';
const PAEPAE = ['#6f6a60', '#7a746a', '#857e72', '#69645b'];
const PAVE_DARK = ['#77726a', '#7e796f', '#706b63'];
const PAVE_LIGHT = ['#a0967f', '#aa9f88', '#968c79', '#b2a68e'];

/* ---------- small modelling helpers (local to this city) */

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
const ONE = V(1, 1, 1);
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const lerp = THREE.MathUtils.lerp;

/** A cheap deterministic hash of a point, 0–1. */
const hash3 = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

/** A round rod from a to b (posts, spars, poles), open-ended. */
function rod(k: Kit, a: THREE.Vector3, b: THREE.Vector3, r: number, color: THREE.ColorRepresentation, seg = 4, rTop = r * 0.85) {
  const dir = V(b.x - a.x, b.y - a.y, b.z - a.z);
  const len = dir.length();
  _q.setFromUnitVectors(UP, dir.normalize());
  _m.compose(V((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2), _q, ONE);
  k.add(new THREE.CylinderGeometry(rTop, r, len, seg, 1, true), color, _m);
}

/** A thin box from a to b with square section t (rails, battens). */
function beam(k: Kit, a: THREE.Vector3, b: THREE.Vector3, t: number, color: THREE.ColorRepresentation) {
  const dir = V(b.x - a.x, b.y - a.y, b.z - a.z);
  const len = dir.length();
  _q.setFromUnitVectors(UP, dir.normalize());
  _m.compose(V((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2), _q, ONE);
  k.add(new THREE.BoxGeometry(t, len, t), color, _m);
}

/** A lumpy clump (foliage, rubble): an icosahedron with every vertex pushed in or out a little. */
function blob(k: Kit, r: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, sy = 1, lump = 0.2, detail = 1, seed = 0) {
  const g = new THREE.IcosahedronGeometry(r, detail);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const vx = p.getX(i);
    const vy = p.getY(i);
    const vz = p.getZ(i);
    const s = 1 + (hash3(vx * 9.1 + seed, vy * 9.7 + x, vz * 9.3 + z) - 0.5) * 2 * lump;
    p.setXYZ(i, vx * s, vy * s * sy, vz * s);
  }
  g.translate(x, y, z);
  k.add(g, color);
}

/**
 * A view of a kit that moves, turns and scales everything added through it, so a whole house
 * can be set down at the edge of the marae court. (Shares the parent's parts.)
 */
function placed(k: Kit, at: THREE.Vector3, ry: number, s: number): Kit {
  const m = new THREE.Matrix4().compose(at, new THREE.Quaternion().setFromAxisAngle(UP, ry), V(s, s, s));
  const view = Object.create(k) as Kit;
  view.add = (g, color, mm) => {
    if (mm) g.applyMatrix4(mm);
    g.applyMatrix4(m);
    return k.add(g, color);
  };
  return view;
}

/** A tilted upright slab standing on (x, y, z); its local +z face looks outward. Lichen and stains optional. */
function slab(k: Kit, x: number, y: number, z: number, w: number, h: number, t: number, ry: number, lean: number, color: THREE.ColorRepresentation, rng?: Rng) {
  _e.set(lean, ry, (rng ? rng() - 0.5 : 0) * 0.05, 'YXZ');
  _q.setFromEuler(_e);
  const m = new THREE.Matrix4().compose(V(x, y, z), _q, ONE);
  const g = new THREE.BoxGeometry(w, h, t);
  g.translate(0, h / 2, 0);
  k.add(g, color, m);
  if (!rng) return;
  const n = h > 0.12 && rng() < 0.6 ? 1 + Math.floor(rng() * 2) : 0;
  for (let i = 0; i < n; i++) {
    const lw = Math.min(w * 0.6, 0.02 + rng() * 0.035);
    const lh = 0.012 + rng() * 0.025;
    const lg = new THREE.BoxGeometry(lw, lh, 0.004);
    lg.translate((rng() - 0.5) * (w - lw), h * (0.45 + rng() * 0.5) - lh / 2, t / 2 + 0.002);
    k.add(lg, pick(rng, LICHEN), m);
  }
  if (rng() < 0.3) {
    // a dark rain streak running down from the top
    const sg = new THREE.BoxGeometry(0.012, h * 0.5, 0.004);
    sg.translate((rng() - 0.5) * w * 0.6, h * 0.72, t / 2 + 0.003);
    k.add(sg, STAIN, m);
  }
}

/** A row of upright slabs along a line, each with its own width, height, lean and stone. */
function slabRow(k: Kit, rng: Rng, a: [number, number], b: [number, number], ry: number, o: { y?: number; h: [number, number]; w: [number, number]; t?: number; colors: string[]; alt?: string[]; altP?: number; lean?: number; lichen?: boolean; gap?: number }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / len;
  const uz = (b[1] - a[1]) / len;
  let s = 0;
  while (s < len - 0.03) {
    const w = Math.min(len - s, lerp(o.w[0], o.w[1], rng()));
    const c = s + w / 2;
    const h = lerp(o.h[0], o.h[1], rng());
    const col = jitter(o.alt && rng() < (o.altP ?? 0.15) ? pick(rng, o.alt) : pick(rng, o.colors), rng, 0.01, 0.05, 0.06);
    slab(k, a[0] + ux * c, o.y ?? 0, a[1] + uz * c, w - (o.gap ?? 0.012), h, o.t ?? 0.045, ry + (rng() - 0.5) * 0.06, (rng() - 0.5) * (o.lean ?? 0.08), col, o.lichen === false ? undefined : rng);
    s += w;
  }
}

type Ring = (A: number, B: number, y: number) => THREE.Vector3[];

/** A stadium: two semicircular (apsidal) ends of radius B joined by straights, half-length A. */
const stadium =
  (n = 6): Ring =>
  (A, B, y) => {
    const c = Math.max(0, A - B);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= n; i++) {
      const t = -Math.PI / 2 + (i / n) * Math.PI;
      pts.push(V(c + B * Math.cos(t), y, B * Math.sin(t)));
    }
    for (let i = 0; i <= n; i++) {
      const t = Math.PI / 2 + (i / n) * Math.PI;
      pts.push(V(-c + B * Math.cos(t), y, B * Math.sin(t)));
    }
    return pts.reverse(); // clockwise from above, so the lofted faces look outward
  };

/** A rounded rectangle (superellipse) of half-sizes A × B. */
const rounded =
  (n = 16, e = 0.3): Ring =>
  (A, B, y) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      const t = -((i + 0.5) / n) * Math.PI * 2;
      const c = Math.cos(t);
      const s = Math.sin(t);
      pts.push(V(A * Math.sign(c) * Math.pow(Math.abs(c), e), y, B * Math.sign(s) * Math.pow(Math.abs(s), e)));
    }
    return pts;
  };

/**
 * Deep pandanus thatch in overlapping courses: each course's lower edge stands proud of the one
 * below and faces down, so the baked occlusion draws a shadow line under every course. The
 * eaves (A × B half-sizes at y) rise in a rounded bulk to a ridge of length `ridge`, which gets a
 * bound ridge cap.
 */
function thatch(k: Kit, ring: Ring, o: { A: number; B: number; rh: number; ridge: number; y: number; color: THREE.ColorRepresentation; rng: Rng; courses?: number; kk?: number; lip?: number; x?: number; z?: number; cap?: boolean }) {
  const T = o.courses ?? 3;
  const kk = o.kk ?? 0.62;
  const at = (t: number) => ({ A: lerp(o.A, o.ridge / 2, t), B: lerp(o.B, 0.004, t), y: o.y + o.rh * Math.pow(t, kk) });
  const lip0 = o.lip ?? 0.028;
  for (let j = 0; j < T; j++) {
    const t0 = j / T;
    const t1 = (j + 1) / T;
    const lip = lip0 * (1 - j * 0.22);
    const p0 = at(t0);
    const rings = [ring(p0.A - 0.012, p0.B - 0.012, p0.y + lip * 0.9), ring(p0.A + lip, p0.B + lip, p0.y - lip * 0.35)];
    for (const s of [0.45, 1]) {
      const p = at(t0 + (t1 - t0) * s);
      rings.push(ring(p.A, p.B, p.y));
    }
    const g = loft(rings);
    g.translate(o.x ?? 0, 0, o.z ?? 0);
    k.add(g, jitter(o.color, o.rng, 0.008, 0.04, 0.05 + j * 0.01));
  }
  if (o.cap !== false) {
    const y = o.y + o.rh;
    const x = o.x ?? 0;
    const z = o.z ?? 0;
    const half = o.ridge / 2 + 0.02;
    rod(k, V(x - half, y - 0.006, z), V(x + half, y - 0.006, z), 0.024, jitter('#7c6236', o.rng, 0.01, 0.04, 0.05), 5, 0.024);
  }
}

/** An irregular flat paving stone: a prism on a jittered polygon, w × d across. */
function flag(k: Kit, rng: Rng, x: number, z: number, w: number, d: number, h: number, y: number, color: THREE.ColorRepresentation) {
  const n = 6 + Math.floor(rng() * 2);
  const ph = rng() * 6.28;
  const rim: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = ph - ((i + (rng() - 0.5) * 0.5) / n) * Math.PI * 2;
    const r = 0.5 * (0.78 + rng() * 0.26);
    rim.push(V(x + Math.cos(a) * r * w, y + h, z + Math.sin(a) * r * d));
  }
  const pos: number[] = [];
  const c = V(x, y + h + 0.002, z);
  for (let i = 0; i < n; i++) {
    const a = rim[i];
    const b = rim[(i + 1) % n];
    pos.push(c.x, c.y, c.z, a.x, a.y, a.z, b.x, b.y, b.z);
    pos.push(a.x, a.y, a.z, a.x, y, a.z, b.x, y, b.z, a.x, a.y, a.z, b.x, y, b.z, b.x, b.y, b.z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  k.add(g, color);
}

/** A low stone platform (paepae): a gravel fill kerbed with upright basalt and coral stones. */
function paepae(k: Kit, rng: Rng, w: number, d: number, h: number, y = 0.0) {
  k.box(w - 0.04, h, d - 0.04, 0, y, 0, jitter('#8f8878', rng, 0.01, 0.04, 0.05));
  const hw = w / 2 - 0.022;
  const hd = d / 2 - 0.022;
  const o = { y: y - 0.01, h: [h + 0.004, h + 0.03] as [number, number], w: [0.09, 0.17] as [number, number], t: 0.045, colors: PAEPAE, alt: CORAL, altP: 0.4, lean: 0.06 };
  slabRow(k, rng, [-hw, hd], [hw, hd], 0, o);
  slabRow(k, rng, [hw, -hd], [-hw, -hd], Math.PI, o);
  slabRow(k, rng, [hw, hd - 0.05], [hw, -hd + 0.05], Math.PI / 2, o);
  slabRow(k, rng, [-hw, -hd + 0.05], [-hw, hd - 0.05], -Math.PI / 2, o);
}

/** A lofted canoe hull along x (bow at +x), centred on z, its sheer rising to bow and stern. */
function hull(k: Kit, len: number, w: number, dep: number, z: number, color: THREE.ColorRepresentation, y = 0, x = 0) {
  const N = 8;
  const rings: THREE.Vector3[][] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const xx = x + (u - 0.5) * len;
    const s = Math.pow(Math.sin(Math.PI * Math.min(0.985, Math.max(0.015, u))), 0.5);
    const hw = (w / 2) * s + 0.002;
    const top = y + dep * 0.55 + 0.07 * Math.pow(Math.max(0, u - 0.72) / 0.28, 2) + 0.035 * Math.pow(Math.max(0, 0.22 - u) / 0.22, 2);
    const bot = y - dep * 0.45 * (0.3 + 0.7 * s);
    const mid = lerp(top, bot, 0.55);
    rings.push([V(xx, top, z - hw), V(xx, mid, z - hw * 0.92), V(xx, bot, z), V(xx, mid, z + hw * 0.92), V(xx, top, z + hw)]);
  }
  k.add(loft(rings, false), color);
  // the dark hollow seen from above, and a sewn-on washstrake line
  k.box(len * 0.72, 0.01, w * 0.62, x, y + dep * 0.3, z, '#2e2116');
}

/** A crab-claw sail on a short mast: two spars from the tack opening into a deep, concave claw. */
function crabClaw(k: Kit, tx: number, ty: number, tz: number, h: number, spread: number, rng: Rng) {
  const sail = jitter('#d4bd88', rng, 0.01, 0.05, 0.05);
  const seam = jitter('#bfa470', rng, 0.01, 0.05, 0.05);
  const T = V(tx, ty, tz);
  const P1 = V(tx + spread * 0.38, ty + h, tz);
  const P2 = V(tx - spread * 0.85, ty + h * 0.72, tz);
  const C = V((P1.x + P2.x) / 2, (P1.y + P2.y) / 2, tz).lerp(T, 0.42);
  const M = 7;
  const top: THREE.Vector3[] = [];
  for (let j = 0; j <= M; j++) {
    const u = j / M;
    // quadratic curve P1 → C → P2: the concave head of the claw
    const a = P1.clone().multiplyScalar((1 - u) * (1 - u));
    const b = C.clone().multiplyScalar(2 * u * (1 - u));
    const c = P2.clone().multiplyScalar(u * u);
    top.push(a.add(b).add(c));
  }
  const bulge = (p: THREE.Vector3, f: number) => p.clone().lerp(T, 0.5).add(V(0, 0, f));
  for (let j = 0; j < M; j++) {
    const m0 = bulge(top[j], 0.03 * Math.sin((Math.PI * j) / M) + 0.01);
    const m1 = bulge(top[j + 1], 0.03 * Math.sin((Math.PI * (j + 1)) / M) + 0.01);
    const col = j % 2 ? sail : seam;
    k.tri(T, m0, m1, col);
    k.tri(m0, top[j], top[j + 1], col);
    k.tri(m0, top[j + 1], m1, col);
  }
  rod(k, T, P1, 0.008, '#5a3d24', 4);
  rod(k, T, P2, 0.008, '#5a3d24', 4);
  rod(k, V(tx + 0.02, ty - 0.03, tz), V(tx + spread * 0.12, ty + h * 0.62, tz), 0.01, '#5a3d24', 4);
}

/** A small seated or standing islander in tapa. */
function figure(k: Kit, x: number, y: number, z: number, cloth: THREE.ColorRepresentation, sit = false) {
  const h = sit ? 0.05 : 0.09;
  k.cyl(0.018, 0.026, h, 5, x, y, z, cloth);
  k.sphere(0.021, x, y + h + 0.018, z, SKIN, 1, 0);
}

/* ---------- house parts */

function posts(k: Kit, pts: THREE.Vector3[], y0: number, y1: number, rng: Rng, r = 0.016) {
  const c = pick(rng, POST);
  for (const p of pts) rod(k, V(p.x, y0, p.z), V(p.x, y1, p.z), r, c, 5);
}

/** A reed or bamboo screen between two points: a panel with stems standing proud of it. */
function screen(k: Kit, a: [number, number], b: [number, number], h: number, rng: Rng, y = 0) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ry = -Math.atan2(b[1] - a[1], b[0] - a[0]);
  const cx = (a[0] + b[0]) / 2;
  const cz = (a[1] + b[1]) / 2;
  const col = jitter(pick(rng, REED), rng);
  k.box(len, h, 0.012, cx, y, cz, col, ry);
  const n = Math.max(3, Math.round(len / 0.05));
  const stem = jitter('#a78d58', rng);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = lerp(a[0], b[0], u);
    const z = lerp(a[1], b[1], u);
    k.box(0.014, h + 0.02 + (i % 3) * 0.008, 0.02, x, y, z, i % 2 ? stem : col, ry);
  }
  k.box(len + 0.02, 0.014, 0.026, cx, y + h * 0.7, cz, '#5a4430', ry);
}

/** A drying rack: two posts, a pole, and tapa cloth (or fish) hung over it. */
function rack(k: Kit, x: number, z: number, ry: number, rng: Rng, fish = false) {
  const c = Math.cos(ry);
  const s = -Math.sin(ry);
  const half = 0.13;
  const a = V(x - c * half, 0, z - s * half);
  const b = V(x + c * half, 0, z + s * half);
  const h = 0.2;
  rod(k, a, V(a.x, h, a.z), 0.009, WOOD);
  rod(k, b, V(b.x, h, b.z), 0.009, WOOD);
  rod(k, V(a.x, h - 0.01, a.z), V(b.x, h - 0.01, b.z), 0.007, '#4e3b2a');
  if (fish) {
    for (let i = 0; i < 5; i++) {
      const u = (i + 0.5) / 5 - 0.5;
      k.box(0.016, 0.055, 0.008, x + c * u * 0.22, h - 0.07, z + s * u * 0.22, pick(rng, ['#7d7a70', '#6a6558', '#8c8574']), ry);
    }
    return;
  }
  // a sheet of tapa folded over the pole, both halves hanging
  const t = jitter(pick(rng, TAPA), rng, 0.01, 0.04, 0.04);
  for (const side of [-1, 1]) {
    _e.set(side * 0.1, ry, 0, 'YXZ');
    _q.setFromEuler(_e);
    const m = new THREE.Matrix4().compose(V(x, h - 0.012, z), _q, ONE);
    const g = new THREE.BoxGeometry(0.2, 0.13, 0.004);
    g.translate(0, -0.065, side * 0.006);
    k.add(g, t, m);
    if (rng() < 0.6) {
      // a printed band (fern or bamboo stamp, kept to plain stripes)
      const bg = new THREE.BoxGeometry(0.2, 0.012, 0.005);
      bg.translate(0, -0.09, side * 0.009);
      k.add(bg, '#6a3a22', m);
    }
  }
}

/** Little things of daily life: coconuts, a wooden bowl, a rolled mat, a basket, banana leaves. */
function clutter(k: Kit, rng: Rng, x: number, z: number) {
  const r = rng();
  if (r < 0.25) {
    for (let i = 0; i < 4; i++) k.sphere(0.026, x + (i % 2) * 0.045 - 0.02, 0.02 + (i > 1 ? 0.03 : 0), z + (i % 3) * 0.02, pick(rng, ['#6a4a2a', '#7d6a34', '#5a3d24']), 1, 0);
  } else if (r < 0.45) {
    k.cyl(0.06, 0.035, 0.035, 8, x, 0, z, '#6a4426');
    k.cyl(0.052, 0.052, 0.004, 8, x, 0.033, z, '#3e2a18');
  } else if (r < 0.65) {
    rod(k, V(x - 0.08, 0.02, z), V(x + 0.08, 0.02, z), 0.02, pick(rng, MAT), 6, 0.02);
  } else if (r < 0.82) {
    k.cyl(0.04, 0.03, 0.06, 6, x, 0, z, '#a58a52');
    k.cyl(0.035, 0.04, 0.012, 6, x, 0.06, z, '#8a6e3e');
  } else {
    k.box(0.16, 0.006, 0.1, x, 0, z, '#5f8a3a', rng() * 3);
    k.box(0.12, 0.006, 0.08, x + 0.03, 0.006, z + 0.02, '#6f9a44', rng() * 3);
  }
}

/** A ti plant (Cordyline) in a yard corner: a cane with a tuft of strap leaves, green or red. */
function tiPlant(k: Kit, x: number, z: number, red: boolean, s = 1) {
  rod(k, V(x, 0, z), V(x, 0.16 * s, z), 0.008, '#6a5a3a', 4);
  const cols = red ? ['#7a2a36', '#8e3a3a', '#5e2a34'] : ['#4f8a3a', '#5f9a44', '#3f7a34'];
  for (let i = 0; i < 7; i++) {
    const yaw = i * 2.4;
    leaf(k, V(x, 0.16 * s, z), yaw, 0.7 - (i % 3) * 0.35, 0.13 * s, 0.55, 0.018 * s, cols[i % 3], 2);
  }
}

/**
 * A leaf or frond as a strip of quads along a drooping rachis: from `base`, heading `yaw`, rising
 * at `pitch` and bending down `droop` radians over its length; the two halves hang a little (`hang`)
 * so it reads as a V from the side.
 */
function leaf(k: Kit, base: THREE.Vector3, yaw: number, pitch: number, len: number, droop: number, width: number, color: THREE.ColorRepresentation, segs = 4, hang = 0.45) {
  const side = V(-Math.sin(yaw), 0, Math.cos(yaw));
  const pos: number[] = [];
  const R: THREE.Vector3[] = [];
  const L: THREE.Vector3[] = [];
  const Rt: THREE.Vector3[] = [];
  let p = base.clone();
  const sl = len / segs;
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const w = width * (i === 0 ? 0.35 : i === segs ? 0.04 : 1 - Math.pow(u, 1.6) * 0.75);
    R.push(p.clone());
    L.push(p.clone().addScaledVector(side, w).add(V(0, -w * hang, 0)));
    Rt.push(p.clone().addScaledVector(side, -w).add(V(0, -w * hang, 0)));
    const pt = pitch - droop * (u + 0.5 / segs);
    p = p.add(V(Math.cos(pt) * Math.cos(yaw) * sl, Math.sin(pt) * sl, Math.cos(pt) * Math.sin(yaw) * sl));
  }
  const push = (...vs: THREE.Vector3[]) => {
    for (const v of vs) pos.push(v.x, v.y, v.z);
  };
  for (let i = 0; i < segs; i++) {
    push(R[i], L[i], L[i + 1], R[i], L[i + 1], R[i + 1]);
    push(R[i], R[i + 1], Rt[i + 1], R[i], Rt[i + 1], Rt[i]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  k.add(g, color);
}

/* ---------- the kinds of fare */

/** Fare pote'e: an oval house with rounded (apsidal) ends, low reed walls and deep thatch on a stone paepae. */
function farePotee(k: Kit, rng: Rng, s: number) {
  const thatchC = pick(rng, THATCH);
  const h = 0.07;
  paepae(k, rng, 0.86 * s + 0.04, 0.6 * s + 0.04, h, 0.02);
  const y0 = 0.02 + h;
  const ring = stadium(6);
  const A = 0.31 * s;
  const B = 0.17 * s;
  // low walls of lashed reeds, a post at every other point of the oval
  k.add(loft([ring(A, B, y0), ring(A, B, y0 + 0.14)]), jitter(pick(rng, REED), rng));
  posts(k, ring(A + 0.008, B + 0.008, 0).filter((_, i) => i % 2 === 0), y0, y0 + 0.15, rng, 0.012);
  // the doorway on the long side, and a mat laid before it
  k.box(0.11, 0.12, 0.02, 0, y0, B + 0.004, '#2f2318');
  k.box(0.16, 0.006, 0.08, 0, y0, B + 0.07, pick(rng, MAT));
  thatch(k, ring, { A: 0.42 * s, B: 0.26 * s, rh: 0.3 * s + 0.03, ridge: 0.44 * s, y: y0 + 0.1, color: thatchC, rng, courses: 3, kk: 0.55 });
}

/** A rectangular fare with rounded hip thatch, reed walls and corner posts. */
function fareRect(k: Kit, rng: Rng, s: number) {
  const h = 0.05;
  paepae(k, rng, 0.78 * s, 0.56 * s, h, 0.02);
  const y0 = 0.02 + h;
  const w = 0.56 * s;
  const d = 0.36 * s;
  const wall = jitter(pick(rng, REED), rng);
  k.box(w, 0.15, d, 0, y0, 0, wall);
  // vertical battens over the reed walls
  const bat = jitter('#9e8452', rng);
  for (let i = 0; i <= 6; i++) {
    const x = lerp(-w / 2, w / 2, i / 6);
    k.box(0.012, 0.15, d + 0.012, x, y0, 0, bat);
  }
  posts(k, [V(-w / 2, 0, -d / 2), V(w / 2, 0, -d / 2), V(-w / 2, 0, d / 2), V(w / 2, 0, d / 2)], y0, y0 + 0.17, rng, 0.016);
  k.box(0.1, 0.12, 0.02, w * 0.15, y0, d / 2 + 0.006, '#2f2318');
  thatch(k, rounded(16, 0.32), { A: w / 2 + 0.1, B: d / 2 + 0.1, rh: 0.3 * s + 0.04, ridge: w * 0.62, y: y0 + 0.11, color: pick(rng, THATCH), rng, courses: 3, kk: 0.7 });
}

/** An open-sided fare: thatch on posts over a floor of mats, a place to sit, work and meet. */
function fareOpen(k: Kit, rng: Rng, s: number) {
  const h = 0.04;
  paepae(k, rng, 0.82 * s, 0.6 * s, h, 0.02);
  const y0 = 0.02 + h;
  const A = 0.33 * s;
  const B = 0.21 * s;
  const ring = rng() < 0.5 ? stadium(4) : rounded(12, 0.3);
  posts(k, ring(A, B, 0).filter((_, i) => i % 2 === 0), y0, y0 + 0.2, rng, 0.016);
  // a carved centre post: plain bands of different girth, no figures
  const cp = pick(rng, POST);
  k.cyl(0.024, 0.024, 0.3, 6, 0, y0, 0, cp);
  for (const yy of [0.06, 0.12]) k.cyl(0.032, 0.032, 0.025, 6, 0, y0 + yy, 0, '#7a5a3a');
  // plaited mats on the floor, one rolled
  for (let i = 0; i < 3; i++) k.box(0.2, 0.006, 0.15, (i - 1) * 0.17 * s, y0, (i % 2 ? 0.05 : -0.05) * s, jitter(pick(rng, MAT), rng), (rng() - 0.5) * 0.3);
  rod(k, V(-0.1 * s, y0 + 0.02, -0.13 * s), V(0.08 * s, y0 + 0.02, -0.13 * s), 0.02, pick(rng, MAT), 6, 0.02);
  if (rng() < 0.6) figure(k, 0.1 * s, y0, 0.06 * s, pick(rng, TAPA), true);
  if (rng() < 0.4) figure(k, -0.14 * s, y0, -0.02 * s, pick(rng, TAPA), true);
  k.cyl(0.05, 0.03, 0.03, 8, 0.02, y0, 0.1 * s, '#6a4426');
  thatch(k, ring, { A: A + 0.1, B: B + 0.09, rh: 0.28 * s + 0.03, ridge: A * 0.95, y: y0 + 0.17, color: pick(rng, THATCH), rng, courses: 3, kk: 0.58 });
}

/** A cooking shelter (fare tutu) with an earth oven (umu) in the open beside it. */
function cookHouse(k: Kit, rng: Rng) {
  k.box(0.86, 0.02, 0.7, 0, 0, 0, '#8a7a5e');
  // the umu sits where the hearth smoke rises (just behind the centre): a mound of earth and
  // banana leaves inside a ring of fire-blackened stones
  const ux = 0;
  const uz = -0.08;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    k.sphere(0.03, ux + Math.cos(a) * 0.11, 0.01, uz + Math.sin(a) * 0.11, pick(rng, BASALT), 0.7, 0);
  }
  blob(k, 0.1, ux, 0.0, uz, '#6a5238', 0.5, 0.15, 1, 3);
  k.box(0.12, 0.006, 0.09, ux - 0.02, 0.045, uz, '#5f8a3a', 0.4);
  k.box(0.1, 0.006, 0.08, ux + 0.03, 0.05, uz + 0.01, '#4f7a34', -0.6);
  // the lean-to: four posts and a thatched roof sloping away from the oven
  const sx = 0.27;
  for (const [x, z, hh] of [[sx - 0.14, -0.2, 0.28], [sx + 0.15, -0.2, 0.2], [sx - 0.14, 0.2, 0.28], [sx + 0.15, 0.2, 0.2]] as const) rod(k, V(x, 0, z), V(x, hh, z), 0.013, pick(rng, POST), 5);
  const roofC = jitter(pick(rng, THATCH), rng);
  _e.set(0, 0, -0.45);
  _q.setFromEuler(_e);
  for (let j = 0; j < 2; j++) {
    const m = new THREE.Matrix4().compose(V(sx + j * 0.01, 0.27 - j * 0.035, 0), _q, ONE);
    k.add(new THREE.BoxGeometry(0.4 - j * 0.04, 0.03, 0.54 - j * 0.03), j ? jitter(roofC, rng, 0.01, 0.03, 0.06) : roofC, m);
  }
  // firewood, coconut husks, a pounding stone and bowl
  for (let i = 0; i < 4; i++) rod(k, V(sx - 0.05, 0.015 + (i % 2) * 0.022, 0.06 + i * 0.022), V(sx + 0.15, 0.015 + (i % 2) * 0.022, 0.05 + i * 0.024), 0.011, '#6a5038', 4);
  k.cyl(0.05, 0.035, 0.03, 8, sx + 0.02, 0, -0.1, '#6a4426');
  k.cyl(0.014, 0.02, 0.06, 5, sx + 0.05, 0, -0.06, '#4d4b47');
  clutter(k, rng, -0.28, 0.24);
  if (rng() < 0.7) figure(k, -0.16, 0, -0.08, pick(rng, TAPA), true);
  // a windbreak screen behind
  screen(k, [-0.4, -0.34], [0.05, -0.34], 0.16, rng);
}

/** A raised storehouse (fata) on posts, out of reach of rats and wet, with baskets beneath. */
function storehouse(k: Kit, rng: Rng) {
  k.box(0.7, 0.02, 0.6, 0, 0, 0, '#8a7a5e');
  const hy = 0.24;
  const w = 0.36;
  const d = 0.28;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) rod(k, V((sx * w) / 2, 0, (sz * d) / 2), V((sx * w) / 2, hy, (sz * d) / 2), 0.014, pick(rng, POST), 5);
  k.box(w + 0.06, 0.03, d + 0.06, 0, hy, 0, WOOD);
  k.box(w - 0.04, 0.1, d - 0.04, 0, hy + 0.03, 0, jitter(pick(rng, REED), rng));
  thatch(k, rounded(12, 0.32), { A: w / 2 + 0.07, B: d / 2 + 0.07, rh: 0.2, ridge: w * 0.4, y: hy + 0.1, color: pick(rng, THATCH), rng, courses: 2, lip: 0.02 });
  // a notched log ladder
  rod(k, V(0.06, 0, d / 2 + 0.16), V(0.04, hy + 0.02, d / 2 + 0.02), 0.012, '#6a5038', 4);
  for (let i = 0; i < 4; i++) k.sphere(0.035, -0.08 + (i % 2) * 0.13, 0.02, -0.03 + (i > 1 ? 0.08 : 0), pick(rng, ['#a58a52', '#8f7646', '#6a4a2a']), 0.8, 0);
  rack(k, -0.2, 0.26, 0.2, rng);
}

/** A canoe shed (fare va'a): a long, low thatch on posts, a hull drawn up under it. */
function canoeShed(k: Kit, rng: Rng) {
  k.box(0.9, 0.02, 0.62, 0, 0, 0, '#cbbb92');
  const pts = [-0.36, 0, 0.36].flatMap((x) => [V(x, 0, -0.2), V(x, 0, 0.2)]);
  posts(k, pts, 0, 0.2, rng, 0.015);
  for (const z of [-0.2, 0.2]) beam(k, V(-0.38, 0.19, z), V(0.38, 0.19, z), 0.02, WOOD);
  hull(k, 0.78, 0.11, 0.08, 0, pick(rng, HULL), 0.05, 0.02);
  // chocks under the hull and paddles leaning on a post
  for (const x of [-0.2, 0.2]) k.box(0.04, 0.03, 0.14, x, 0.02, 0, '#5a4430');
  for (let i = 0; i < 2; i++) {
    rod(k, V(0.4, 0, -0.26 + i * 0.03), V(0.36, 0.22, -0.22 + i * 0.03), 0.006, '#7a5a3a', 4);
    k.box(0.03, 0.06, 0.008, 0.4, 0, -0.26 + i * 0.03, '#7a5a3a');
  }
  thatch(k, rounded(16, 0.4), { A: 0.45, B: 0.3, rh: 0.28, ridge: 0.6, y: 0.15, color: pick(rng, THATCH), rng, courses: 2, kk: 0.75 });
  if (rng() < 0.5) rack(k, -0.3, 0.38, 0, rng, true);
}

/* ---------- trees */

function trunkCurve(k: Kit, h: number, lean: number, r0: number, r1: number, color: string, alt: string, seg = 6) {
  let p = V(0, 0, 0);
  for (let i = 0; i < seg; i++) {
    const t = i / seg;
    const ang = lean * (0.3 + t * 0.9);
    const l = h / seg;
    const q = p.clone().add(V(Math.sin(ang) * l, Math.cos(ang) * l, 0));
    rod(k, p, q, lerp(r0, r1, t), i % 2 ? color : alt, 6, lerp(r0, r1, t + 1 / seg));
    p = q;
  }
  return p;
}

const RAIATEA_TREES: Record<string, (k: Kit) => void> = {
  /** Coconut palm (niu): a curving ringed trunk, a full crown of arching, drooping fronds, nuts. */
  palm(k) {
    const top = trunkCurve(k, 1.08, 0.42, 0.034, 0.02, '#7d6b55', '#6e5e4a', 7);
    k.sphere(0.04, top.x, top.y - 0.01, top.z, '#6b6a34', 1.2, 0);
    for (let f = 0; f < 11; f++) {
      const yaw = f * 2.4 + 0.3;
      const old = f >= 9;
      const pitch = old ? -0.5 : 0.55 - (f % 3) * 0.25;
      leaf(k, top, yaw, pitch, old ? 0.36 : 0.5, old ? 0.6 : 1.35, 0.046, old ? '#857a40' : f % 3 ? '#3f7232' : '#4b7d38', 4, 1.1);
    }
    for (let i = 0; i < 4; i++) {
      const a = i * 1.7;
      k.sphere(0.03, top.x + Math.cos(a) * 0.04, top.y - 0.05, top.z + Math.sin(a) * 0.04, i % 2 ? '#6a7a30' : '#7a6a2e', 1, 0);
    }
  },
  /** Breadfruit (ʻuru): a stout pale trunk and a broad, lumpy crown of big dark leaves, green fruit. */
  breadfruit(k) {
    rod(k, V(0, 0, 0), V(0.02, 0.42, 0), 0.05, '#66594a', 6, 0.04);
    rod(k, V(0.02, 0.36, 0), V(0.2, 0.56, 0.06), 0.025, '#66594a', 4);
    rod(k, V(0.02, 0.38, 0), V(-0.16, 0.58, -0.08), 0.025, '#66594a', 4);
    blob(k, 0.3, 0, 0.72, 0, '#2f5e2e', 0.8, 0.22, 1, 1);
    blob(k, 0.22, 0.22, 0.62, 0.08, '#3a6c33', 0.8, 0.22, 1, 2);
    blob(k, 0.21, -0.2, 0.64, -0.1, '#2a542a', 0.8, 0.22, 1, 3);
    blob(k, 0.17, 0.04, 0.92, 0.1, '#447a38', 0.8, 0.25, 0, 4);
    blob(k, 0.15, -0.06, 0.6, 0.22, '#355f30', 0.8, 0.25, 0, 5);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.3;
      k.sphere(0.035, Math.cos(a) * 0.24, 0.5 + (i % 2) * 0.05, Math.sin(a) * 0.24, '#93a648', 1, 0);
    }
  },
  /** Mountain plantain / banana: a soft pseudostem and big arching paddle leaves. */
  banana(k) {
    for (const [x, z, h, n] of [[0, 0, 0.46, 6], [0.1, 0.06, 0.28, 4]] as const) {
      rod(k, V(x, 0, z), V(x, h, z), 0.034, '#7c8a4a', 6, 0.026);
      for (let f = 0; f < n; f++) {
        const yaw = f * 2.4 + x * 9;
        leaf(k, V(x, h - 0.02, z), yaw, 1.0 - (f % 2) * 0.3, h * 0.9, 1.7, 0.085, f % 3 ? '#76a646' : '#6a963e', 3, 0.12);
      }
    }
    // an upright bunch, as the fe'i carries it
    blob(k, 0.05, 0.02, 0.5, -0.05, '#7a7a2a', 1.4, 0.2, 0, 6);
  },
  /** Pandanus (fara): stilt roots, a forked trunk and spiral tufts of long drooping strap leaves. */
  pandanus(k) {
    for (let r = 0; r < 4; r++) {
      const a = (r / 4) * Math.PI * 2 + 0.4;
      rod(k, V(Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1), V(0.01, 0.2, 0), 0.01, '#7a6650', 4);
    }
    rod(k, V(0.01, 0.15, 0), V(0.05, 0.5, 0), 0.036, '#7a6650', 5, 0.03);
    const tips = [V(0.22, 0.72, 0.06), V(-0.12, 0.68, -0.1), V(0.04, 0.8, -0.14)];
    for (const [i, t] of tips.entries()) {
      rod(k, V(0.05, 0.48, 0), t, 0.022, '#7a6650', 4, 0.016);
      for (let f = 0; f < 12; f++) leaf(k, t, f * 2.4 + i, 0.7 - (f % 3) * 0.4, 0.32, 1.4, 0.026, f % 2 ? '#5f8e42' : '#4f7e3a', 2, 0.7);
      if (i === 0) blob(k, 0.045, t.x, t.y - 0.06, t.z, '#c98a3a', 1.1, 0.15, 0, 7);
    }
  },
  /** Hill forest: a broad, dense crown of overlapping clumps in deep, varied greens; trunks barely show. */
  forest(k) {
    rod(k, V(0, 0, 0), V(0, 0.32, 0), 0.04, '#4e4234', 5, 0.03);
    blob(k, 0.36, 0, 0.5, 0, '#2c5530', 0.75, 0.24, 1, 11);
    blob(k, 0.27, 0.27, 0.42, 0.1, '#365f33', 0.8, 0.24, 1, 12);
    blob(k, 0.26, -0.22, 0.4, -0.16, '#264a2a', 0.8, 0.24, 1, 13);
    blob(k, 0.22, -0.08, 0.36, 0.28, '#3f6a3a', 0.8, 0.25, 0, 14);
    blob(k, 0.2, 0.1, 0.72, -0.06, '#3a6634', 0.8, 0.25, 0, 15);
  },
  /** A taller emergent of the upland forest, a little lighter, its crown in two tiers. */
  forest2(k) {
    rod(k, V(0, 0, 0), V(0.03, 0.6, 0), 0.04, '#5a4c3a', 5, 0.028);
    rod(k, V(0.02, 0.45, 0), V(0.24, 0.66, 0.05), 0.02, '#5a4c3a', 4);
    rod(k, V(0.02, 0.5, 0), V(-0.2, 0.7, -0.08), 0.02, '#5a4c3a', 4);
    blob(k, 0.26, 0.02, 0.72, 0, '#2f5a30', 0.6, 0.24, 1, 21);
    blob(k, 0.2, 0.26, 0.68, 0.06, '#46723a', 0.6, 0.26, 0, 22);
    blob(k, 0.2, -0.22, 0.7, -0.08, '#3d6835', 0.6, 0.26, 0, 23);
    blob(k, 0.16, 0.02, 0.88, 0.16, '#3a6634', 0.6, 0.26, 0, 24);
  },
  /** Purau (beach hibiscus) thicket: a low tangle of stems under a sprawling mound with yellow flowers. */
  purau(k) {
    for (let i = 0; i < 3; i++) {
      const a = i * 2.1;
      rod(k, V(0, 0, 0), V(Math.cos(a) * 0.18, 0.26, Math.sin(a) * 0.18), 0.018, '#5e5240', 4);
    }
    blob(k, 0.3, 0, 0.3, 0, '#3f6e34', 0.6, 0.25, 1, 31);
    blob(k, 0.22, 0.24, 0.24, 0.1, '#4a7a3a', 0.65, 0.25, 0, 32);
    blob(k, 0.2, -0.22, 0.22, -0.12, '#376330', 0.65, 0.25, 0, 33);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.25;
      k.sphere(0.018, Math.cos(a) * 0.28, 0.36 + (i % 2) * 0.05, Math.sin(a) * 0.28, '#e8c84a', 1, 0);
    }
  },
  /** A tree fern of the wet uplands: a slim dark trunk and a parasol of finely cut, arching fronds. */
  treefern(k) {
    const top = trunkCurve(k, 0.72, 0.14, 0.03, 0.022, '#3e3428', '#4a3e30', 4);
    for (let f = 0; f < 10; f++) leaf(k, top, f * 0.63 + 0.2, 0.5, 0.42, 1.2, 0.06, f % 2 ? '#55823a' : '#649242', 3, 0.35);
    k.sphere(0.03, top.x, top.y, top.z, '#5a4a2a', 1, 0);
  },
};

/* ---------- scatter */

const SC = {
  /** Lush grass and sedge. */
  tuft: SCATTER.tuft('#4f8236', '#669440'),
  ti: (red: boolean) => (k: Kit) => tiPlant(k, 0, 0, red, 0.9),
  /** A red hibiscus shrub. */
  hibiscus(k: Kit) {
    blob(k, 0.11, 0, 0.09, 0, '#3f7034', 0.8, 0.25, 0, 41);
    blob(k, 0.08, 0.08, 0.06, 0.04, '#4a7c3a', 0.8, 0.25, 0, 42);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.3;
      k.sphere(0.02, Math.cos(a) * 0.1, 0.1 + (i % 2) * 0.04, Math.sin(a) * 0.1, i % 3 ? '#d0302a' : '#e8603a', 0.7, 0);
    }
  },
  /** Fallen coconuts, some sprouting. */
  coconuts(k: Kit) {
    k.sphere(0.03, 0, 0.02, 0, '#7a5a30', 0.9, 0);
    k.sphere(0.028, 0.05, 0.02, 0.02, '#6a6a2a', 0.9, 0);
    k.sphere(0.026, -0.02, 0.02, 0.05, '#5e4a28', 0.9, 0);
    leaf(k, V(0.05, 0.03, 0.02), 0.4, 1.2, 0.08, 0.8, 0.014, '#6a9a44', 2, 0.2);
  },
  /** Beach morning glory (pōhuehue) creeping over the sand, with pink flowers. */
  creeper(k: Kit) {
    blob(k, 0.09, 0, 0.0, 0, '#4f8238', 0.3, 0.3, 0, 51);
    blob(k, 0.07, 0.11, 0.0, 0.04, '#5a8e3e', 0.3, 0.3, 0, 52);
    blob(k, 0.06, -0.08, 0.0, 0.07, '#47783a', 0.3, 0.3, 0, 53);
    for (let i = 0; i < 3; i++) k.sphere(0.014, -0.05 + i * 0.07, 0.03, 0.02 * i, '#d07aa0', 0.6, 0);
  },
  /** Bleached driftwood and a coral rubble cobble. */
  drift(k: Kit) {
    rod(k, V(-0.12, 0.012, 0), V(0.12, 0.016, 0.04), 0.012, '#b3a68e', 4);
    rod(k, V(0.04, 0.012, 0.02), V(0.1, 0.014, -0.05), 0.007, '#a89a80', 4);
    k.sphere(0.03, -0.06, 0.01, 0.06, '#e6ddc8', 0.6, 0);
  },
  /** Black basalt boulders on the beach, a pale coral cobble among them. */
  boulders(k: Kit) {
    blob(k, 0.07, 0, 0.02, 0, '#45433f', 0.7, 0.2, 0, 61);
    blob(k, 0.045, 0.08, 0.01, 0.03, '#55524c', 0.7, 0.2, 0, 62);
    k.sphere(0.03, -0.06, 0.01, 0.05, '#ddd3bc', 0.6, 0);
  },
  /** A small outrigger drawn up on the sand. */
  beached(k: Kit) {
    hull(k, 0.5, 0.07, 0.05, 0, '#5e3f25', 0.02);
    k.box(0.28, 0.025, 0.03, 0, 0, 0.2, '#7a5634');
    rod(k, V(0.08, 0.05, 0), V(0.08, 0.02, 0.2), 0.006, '#5a3d24', 4);
    rod(k, V(-0.08, 0.05, 0), V(-0.08, 0.02, 0.2), 0.006, '#5a3d24', 4);
    rod(k, V(-0.05, 0.01, -0.08), V(0.15, 0.01, -0.12), 0.005, '#7a5a3a', 4);
  },
  /** Coral heads awash at low water: muted rose, ochre and grey-violet, with a pale rim. */
  coral(k: Kit) {
    blob(k, 0.1, 0, -0.035, 0, '#8e6e5e', 0.4, 0.3, 0, 71);
    blob(k, 0.06, 0.09, -0.03, 0.05, '#857a52', 0.45, 0.3, 0, 72);
    blob(k, 0.05, -0.07, -0.03, 0.07, '#6e6676', 0.45, 0.3, 0, 73);
  },
  /** A line of stakes from a fish weir. */
  stakes(k: Kit) {
    for (let i = 0; i < 5; i++) rod(k, V(i * 0.06 - 0.12, -0.05, i * 0.015), V(i * 0.06 - 0.12, 0.05 + (i % 2) * 0.02, i * 0.015), 0.006, '#5e4a34', 4);
  },
  /** Ferns of the forest floor. */
  fern: SCATTER.fern('#3a6a32', '#4a7a38'),
  /** A mossy boulder half sunk in the leaf litter. */
  mossy(k: Kit) {
    blob(k, 0.09, 0, 0.0, 0, '#4f5a44', 0.7, 0.2, 0, 81);
    blob(k, 0.06, 0.02, 0.04, 0.01, '#4f7a3a', 0.4, 0.25, 0, 82);
  },
  /** Undergrowth: low leafy mounds that roughen the smooth hill. */
  shrub(k: Kit) {
    blob(k, 0.2, 0, 0.06, 0, '#2f5a2e', 0.65, 0.28, 0, 91);
    blob(k, 0.15, 0.17, 0.04, 0.06, '#3a6634', 0.65, 0.28, 0, 92);
    blob(k, 0.14, -0.15, 0.03, 0.1, '#28502a', 0.65, 0.28, 0, 93);
  },
};

/* ---------- backdrop islands */

/** A ridged volcanic peak: rings shrinking to a summit, their radii roughened into spurs and valleys. */
function peak(k: Kit, rng: Rng, x: number, z: number, R: number, H: number, color: THREE.ColorRepresentation, p = 1.4, seg = 12) {
  const rows = 5;
  const ph = rng() * 6;
  const rings: THREE.Vector3[][] = [];
  for (let i = 0; i <= rows; i++) {
    const t = i / rows;
    const r = R * Math.pow(1 - t * 0.97, p);
    const ring: THREE.Vector3[] = [];
    for (let s = 0; s < seg; s++) {
      const a = -(s / seg) * Math.PI * 2;
      const n = 1 + 0.22 * Math.sin(a * 3 + ph + t * 2) + 0.12 * (hash3(s, i, x) - 0.5);
      ring.push(V(x + Math.cos(a) * r * n, -0.4 + H * t, z + Math.sin(a) * r * n));
    }
    rings.push(ring);
  }
  k.add(loft(rings), jitter(color, rng, 0.01, 0.04, 0.04));
}

/** A high island in its lagoon: a pale reef ring with a line of surf and a few palm-dark motu. */
function highIsland(k: Kit, rng: Rng, x: number, z: number, R: number, peaks: [number, number, number, number, number?][], color: string, motu = 4) {
  k.cyl(R * 1.5, R * 1.5, 0.05, 20, x, -0.03, z, '#e6f2ee');
  k.cyl(R * 1.44, R * 1.44, 0.06, 20, x, -0.02, z, '#7fc9c2');
  for (const [dx, dz, r, h, pp] of peaks) peak(k, rng, x + dx, z + dz, r, h, color, pp ?? 1.4);
  for (let i = 0; i < motu; i++) {
    const a = rng() * Math.PI * 2;
    const mx = x + Math.cos(a) * R * 1.45;
    const mz = z + Math.sin(a) * R * 1.45;
    const w = 2 + rng() * 4;
    k.cyl(w, w + 0.5, 0.25, 8, mx, -0.1, mz, '#d9d2b4');
    // a low dome of palms, its crown roughened
    peak(k, rng, mx, mz, w * 0.85, 1.6, '#4f7258', 0.6, 8);
  }
}

/* ---------------------------------------------------------------- the style */

export const raiatea: Style = {
  id: 'raiatea',
  name: { en: 'Raʻiatea', zh: '赖阿特阿岛' },
  landmark: {
    name: { en: 'Marae Taputapuātea', zh: '塔普塔普阿特阿马拉埃' },
    short: { en: 'Marae', zh: '马拉埃' },
    note: {
      en: 'A paved sacred court before a long ahu faced with upright slabs of coral and basalt, where voyagers from far islands gathered.',
      zh: '铺石的神圣广场，前方是以直立的珊瑚石与玄武岩石板砌面的长形石台“阿胡”，远方诸岛的航海者曾在此聚会。',
    },
  },
  sky: { top: '#3a82c8', horizon: '#cfe9ee', sun: '#fff1cf' },
  fog: { color: '#cde6ea', near: 60, far: 220 },
  sun: { color: '#fff0d6', intensity: 2.8, dir: [0.35, 0.75, -0.5] },
  hemi: { sky: '#c2e2f0', ground: '#5c7a4c', intensity: 1.0 },
  exposure: 1.0,
  grade: { shadows: [0.0, 0.012, 0.03], highlights: [1.02, 1.0, 0.96], contrast: 1.06, saturation: 1.04, vignette: 0.26 },
  water: { shallow: '#58d2c6', deep: '#12508a', foam: '#f4fbf8', outside: -2.2 },
  ground: { sand: '#e8d9b2', grass: '#4a7234', grass2: '#5f8442', hill: '#2f4f2c', rock: '#4a5242', town: '#c9b78e', field: '#40653a' },
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
    plinth(k, 0.86, 0.64, '#8e7f62');
    const roll = r();
    if (c.waterside && roll < 0.32) return canoeShed(k, r);
    const s = 0.86 + r() * 0.14;
    if (roll < 0.42) farePotee(k, r, s);
    else if (roll < 0.58) fareRect(k, r, s);
    else if (roll < 0.72) fareOpen(k, r, s);
    else if (roll < 0.86) return cookHouse(k, r);
    else return storehouse(k, r);
    // something in the yard beside the house: a screen, a drying rack, a ti plant, daily things
    const side = r() < 0.5 ? -1 : 1;
    const e = r();
    if (e < 0.25) screen(k, [-0.42, side * 0.38], [-0.05, side * 0.42], 0.15, r);
    else if (e < 0.45) rack(k, 0.22, side * 0.38, 0.1, r, c.waterside && r() < 0.6);
    else if (e < 0.65) tiPlant(k, 0.38, side * 0.36, r() < 0.4, 0.9);
    if (r() < 0.6) clutter(k, r, -0.3 + r() * 0.6, -side * 0.38);
  },
  field(rng) {
    // taro (taro) in wet beds: an earthen bank round standing water, the plants in clumps
    const beds: Bed[] = [];
    const greens = ['#2f6a34', '#3a7a3c', '#477f3a', '#356f36'];
    for (const x of [-0.24, 0.24])
      for (const z of [-0.24, 0.24]) {
        beds.push({ x, z, w: 0.46, d: 0.46, h: 0.05, color: jitter('#6a5a3e', rng, 0.01, 0.05, 0.06) });
        beds.push({ x, z, w: 0.38, d: 0.38, h: 0.056, color: jitter('#5c7266', rng, 0.01, 0.05, 0.05) });
        const young = rng() < 0.25;
        const g = pick(rng, greens);
        for (const cx of [-0.09, 0.09])
          for (const cz of [-0.09, 0.09]) {
            const s = young ? 0.07 : 0.11 + rng() * 0.03;
            const px = x + cx + (rng() - 0.5) * 0.03;
            const pz = z + cz + (rng() - 0.5) * 0.03;
            const hh = young ? 0.06 : 0.1 + rng() * 0.05;
            beds.push({ x: px, z: pz, w: 0.025, d: 0.025, h: hh, y: 0.03, color: '#5a7a3a' });
            beds.push({ x: px, z: pz, w: s, d: s * 0.85, h: 0.025, y: 0.03 + hh, color: jitter(g, rng, 0.01, 0.05, 0.08) });
          }
      }
    return beds;
  },
  trees: { shore: ['palm', 'palm', 'palm', 'pandanus', 'palm', 'purau'], land: ['breadfruit', 'palm', 'banana', 'breadfruit', 'purau'], hill: ['forest', 'forest2', 'forest', 'treefern', 'purau', 'forest'] },
  treeKits: { ...TREES, ...RAIATEA_TREES },
  boat(k, rng) {
    if (rng() < 0.3) {
      // a pahi: a double-hulled voyaging canoe, its deck carrying a small thatched shelter
      for (const z of [-0.15, 0.15]) hull(k, 1.06, 0.12, 0.1, z, pick(rng, HULL));
      for (const x of [-0.32, -0.12, 0.1, 0.3]) k.box(0.035, 0.025, 0.44, x, 0.06, 0, '#5a3d24');
      k.box(0.6, 0.015, 0.28, -0.02, 0.085, 0, '#8a6a44');
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) rod(k, V(-0.2 + sx * 0.1, 0.1, sz * 0.08), V(-0.2 + sx * 0.1, 0.2, sz * 0.08), 0.007, '#5a4430', 4);
      thatch(k, rounded(12, 0.35), { A: 0.15, B: 0.12, rh: 0.1, ridge: 0.14, y: 0.19, color: '#b4935a', rng, courses: 2, lip: 0.012, cap: false, x: -0.2 });
      crabClaw(k, 0.16, 0.1, 0, 0.7, 0.62, rng);
      figure(k, 0.32, 0.1, 0.04, pick(rng, TAPA));
      figure(k, -0.42, 0.1, -0.06, pick(rng, TAPA), true);
      // a steering paddle over the stern
      rod(k, V(-0.44, 0.16, 0.12), V(-0.6, -0.05, 0.16), 0.007, '#6a4a2a', 4);
      return;
    }
    // a va'a: one hull with its outrigger float (ama) on two booms
    hull(k, 0.8, 0.09, 0.08, 0, pick(rng, HULL));
    hull(k, 0.5, 0.05, 0.04, 0.32, '#7a5634', -0.01, -0.02);
    for (const x of [0.14, -0.14]) {
      rod(k, V(x, 0.05, -0.02), V(x, 0.06, 0.18), 0.008, '#5a3d24', 4);
      rod(k, V(x, 0.06, 0.18), V(x - 0.01, 0.02, 0.32), 0.008, '#5a3d24', 4);
    }
    if (rng() < 0.55) crabClaw(k, 0.1, 0.05, 0, 0.5, 0.42, rng);
    else {
      // paddled: two crew
      figure(k, 0.16, 0.03, 0, pick(rng, TAPA), true);
      figure(k, -0.16, 0.03, 0, pick(rng, TAPA), true);
      rod(k, V(0.16, 0.09, 0.0), V(0.13, -0.02, -0.12), 0.005, '#6a4a2a', 4);
    }
    figure(k, -0.3, 0.03, 0, pick(rng, TAPA), true);
  },
  buildLandmark(k) {
    const rng = (() => {
      let s = 20250 >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
    // the terrace, its sides stone-faced
    plinth(k, 2.84, 2.84, '#5f5a50');
    k.box(2.86, 0.03, 2.86, 0, 0, 0, '#a59c86');
    // where the ground falls away (the shore, a slope) the terrace shows a retaining face of
    // slabs; they sit low, where the baked occlusion darkens most, so they start out pale
    {
      const e = 1.425;
      const skirt = { y: -0.34, h: [0.37, 0.4] as [number, number], w: [0.14, 0.3] as [number, number], t: 0.04, colors: ['#cfc6b0', '#c4bba5', '#d8cfb9', '#bab19c'], alt: ['#8f8a80', '#9a948a'], altP: 0.3, lean: 0.03 };
      slabRow(k, rng, [-e, e], [e, e], 0, skirt);
      slabRow(k, rng, [e, -e], [-e, -e], Math.PI, skirt);
      slabRow(k, rng, [e, e - 0.02], [e, -e + 0.02], Math.PI / 2, skirt);
      slabRow(k, rng, [-e, -e + 0.02], [-e, e - 0.02], -Math.PI / 2, skirt);
    }
    // gravel and rubble behind and beside the paving
    for (let i = 0; i < 26; i++) blob(k, 0.035 + rng() * 0.03, (rng() - 0.5) * 2.7, 0.025, -1.3 + rng() * 0.12, pick(rng, BASALT), 0.5, 0.25, 0, i);

    /* the paved court (paepae): rows of flagstones, basalt and coral, a few missing */
    const zF = -0.48;
    const zB = 1.3;
    let z = zF;
    while (z < zB - 0.05) {
      const dd = Math.min(zB - z, 0.15 + rng() * 0.1);
      let x = -1.3 + rng() * 0.06;
      while (x < 1.28) {
        const ww = Math.min(1.3 - x, 0.13 + rng() * 0.2);
        if (rng() > 0.06) {
          const col = jitter(rng() < 0.4 ? pick(rng, PAVE_DARK) : pick(rng, PAVE_LIGHT), rng, 0.01, 0.04, 0.06);
          flag(k, rng, x + ww / 2, z + dd / 2, ww * 1.1, dd * 1.1, 0.026 + rng() * 0.014, 0.02, col);
        }
        x += ww;
      }
      z += dd;
    }
    // the court's low enclosure of upright slabs, open in the middle of the front
    const kerb = { h: [0.08, 0.15] as [number, number], w: [0.1, 0.2] as [number, number], colors: CORAL, alt: BASALT, altP: 0.3, lean: 0.1 };
    slabRow(k, rng, [-1.38, 1.38], [-0.28, 1.38], 0, kerb);
    slabRow(k, rng, [0.28, 1.38], [1.38, 1.38], 0, kerb);
    slabRow(k, rng, [1.38, 1.3], [1.38, -0.5], Math.PI / 2, kerb);
    slabRow(k, rng, [-1.38, -0.5], [-1.38, 1.3], -Math.PI / 2, kerb);
    // a step of two big stones at the entrance
    for (const x of [-0.12, 0.12]) k.box(0.22, 0.04, 0.12, x, 0.02, 1.44, jitter(pick(rng, BASALT), rng), (rng() - 0.5) * 0.1);

    /* the ahu: a long, low platform along the back, faced with great upright slabs of coral
       limestone over a footing of basalt boulders, its top a fill of dark basalt rubble */
    const ax = 1.26;
    const az0 = -1.22;
    const az1 = -0.6;
    const ah = 0.34;
    k.box(ax * 2 - 0.04, ah - 0.02, az1 - az0 - 0.04, 0, 0.02, (az0 + az1) / 2, '#4a4843');
    const face = { h: [ah - 0.02, ah + 0.07] as [number, number], w: [0.12, 0.26] as [number, number], t: 0.05, colors: CORAL, alt: BASALT, altP: 0.12, lean: 0.06, y: 0.02 };
    slabRow(k, rng, [-ax, az1], [ax, az1], 0, face);
    slabRow(k, rng, [ax, az0], [-ax, az0], Math.PI, face);
    slabRow(k, rng, [ax, az1 - 0.03], [ax, az0 + 0.03], Math.PI / 2, face);
    slabRow(k, rng, [-ax, az0 + 0.03], [-ax, az1 - 0.03], -Math.PI / 2, face);
    // a footing of basalt boulders along the front
    for (let x = -ax + 0.05; x < ax; x += 0.08 + rng() * 0.06) blob(k, 0.035 + rng() * 0.02, x, 0.03, az1 + 0.05, pick(rng, BASALT), 0.7, 0.2, 0, x * 31);
    // rubble fill on top
    for (let i = 0; i < 46; i++) blob(k, 0.035 + rng() * 0.035, (rng() - 0.5) * (ax * 2 - 0.14), ah + 0.0, lerp(az0 + 0.07, az1 - 0.07, rng()), pick(rng, BASALT), 0.55, 0.25, 0, i + 100);
    // carved wooden boards (unu) standing on the ahu: plain notched planks, no figures
    for (const [i, x] of [-0.7, -0.25, 0.2, 0.62].entries()) {
      const h = 0.28 + (i % 2) * 0.08;
      const by = ah + 0.02;
      const zz = -0.92;
      k.box(0.055, h, 0.022, x, by, zz, '#6a5a48');
      k.box(0.075, 0.02, 0.028, x, by + h * 0.55, zz, '#5e4430');
      k.box(0.085, 0.035, 0.026, x, by + h, zz, '#5e4430');
    }

    /* upright backrest stones in the court, for the chiefs and priests, and one tall stone */
    for (let i = 0; i < 6; i++) {
      const x = -0.7 + i * 0.27 + (rng() - 0.5) * 0.05;
      const h = 0.12 + rng() * 0.12;
      slab(k, x, 0.03, -0.3 + (rng() - 0.5) * 0.06, 0.07 + rng() * 0.04, h, 0.04, (rng() - 0.5) * 0.2, -0.08 - rng() * 0.08, jitter(pick(rng, rng() < 0.6 ? BASALT : CORAL), rng), rng);
    }
    for (const [x, zz] of [[-0.75, 0.55], [0.55, 0.3], [-0.2, 0.85]] as const) slab(k, x, 0.03, zz, 0.07, 0.13 + rng() * 0.06, 0.04, rng() * 3, -0.1, jitter(pick(rng, BASALT), rng), rng);
    slab(k, -1.08, 0.03, 0.95, 0.12, 0.38, 0.07, 0.25, -0.03, '#6d685e', rng);

    /* a wooden offering platform (fata) at the side of the ahu, with leaves and coconuts on it */
    {
      const fx = -1.0;
      const fz = -0.32;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) rod(k, V(fx + sx * 0.1, 0.03, fz + sz * 0.07), V(fx + sx * 0.1, 0.3, fz + sz * 0.07), 0.012, '#5a4430', 5);
      k.box(0.26, 0.02, 0.2, fx, 0.3, fz, '#6e4f33');
      k.box(0.2, 0.008, 0.14, fx, 0.32, fz, '#5f8a3a', 0.3);
      for (let i = 0; i < 3; i++) k.sphere(0.028, fx - 0.05 + i * 0.05, 0.345, fz + (i % 2) * 0.03, '#6a6a2a', 1, 0);
    }

    /* modest thatched houses at the court's edge: one closed, one open-sided */
    farePotee(placed(k, V(0.92, 0.03, 0.78), Math.PI / 2 + 0.1, 0.9), rng, 0.82);
    fareOpen(placed(k, V(0.98, 0.03, -0.12), Math.PI / 2 - 0.05, 0.85), rng, 0.8);
    // a sacred ironwood (ʻaito) behind the ahu
    {
      const t = placed(k, V(1.18, 0.03, -1.22), 0.6, 1);
      rod(t, V(0, 0, 0), V(0.03, 0.86, 0), 0.035, '#4a3c30', 5, 0.016);
      // ironwood: tiers of fine, drooping grey-green needles
      for (let tier = 0; tier < 4; tier++) {
        const y = 0.36 + tier * 0.15;
        const n = 9 - tier;
        for (let f = 0; f < n; f++) leaf(t, V(0.01 + tier * 0.005, y, 0), f * 2.4 + tier, 0.3, 0.26 - tier * 0.04, 1.5, 0.035, f % 2 ? '#3d5642' : '#4a6650', 3, 1.4);
      }
    }
  },
  backdrop(k, rng) {
    // Tahaʻa, inside the same reef to the north
    highIsland(k, rng, -18, -84, 16, [[0, 0, 13, 7], [-9, 4, 9, 5.5], [8, -3, 8, 5], [3, -6, 6, 8, 1.8]], '#5b8a78', 5);
    // Bora Bora to the north-west, with the sheer block of Otemanu
    highIsland(k, rng, -112, -108, 11, [[0, 0, 11, 6], [1, -1, 4.5, 19, 0.7], [-3.5, 1.5, 3.5, 15, 0.8], [6, 4, 6, 4]], '#6f97a6', 6);
    // Huahine low to the east, Maupiti a speck far to the west
    highIsland(k, rng, 140, -26, 12, [[0, 0, 10, 6], [-6, 8, 8, 5], [5, -6, 6, 4.5]], '#7aa0b0', 3);
    highIsland(k, rng, -172, -14, 4, [[0, 0, 4, 4, 1.2]], '#86a8b6', 2);
  },
  notes: [349.23, 392, 440, 523.25, 587.33, 698.46],
  bonus: { label: { en: 'Palms line the lagoon', zh: '椰林环绕泻湖' }, test: (s) => s.shoreTrees >= 16 },
  bird: '#f7f6f2',
  smoke: 0.14,
  scatter: [
    { zone: 'grass', kit: SC.tuft, density: 2.2, scale: [0.9, 1.6] },
    { zone: 'grass', kit: SC.ti(false), density: 0.12, scale: [0.8, 1.3], shadow: true },
    { zone: 'grass', kit: SC.ti(true), density: 0.06, scale: [0.8, 1.2], shadow: true },
    { zone: 'grass', kit: SC.hibiscus, density: 0.12, scale: [0.8, 1.4], shadow: true },
    { zone: 'grass', kit: SCATTER.flowers('#3f7a36', ['#e0382a', '#f2f0e4', '#f4d04a']), density: 0.2 },
    { zone: 'grass', kit: SC.coconuts, density: 0.08 },
    { zone: 'shore', kit: SC.creeper, density: 0.5, scale: [0.8, 1.6] },
    { zone: 'shore', kit: SC.coconuts, density: 0.2 },
    { zone: 'shore', kit: SC.drift, density: 0.12 },
    { zone: 'shore', kit: SC.boulders, density: 0.14, scale: [0.7, 1.5] },
    { zone: 'shore', kit: SC.beached, density: 0.025, shadow: true },
    { zone: 'shallows', kit: SC.coral, density: 0.05, scale: [0.7, 1.5], float: true },
    { zone: 'shallows', kit: SC.stakes, density: 0.01, float: true },
    { zone: 'hill', kit: SC.shrub, density: 4, scale: [1.1, 2.3], shadow: true },
    { zone: 'hill', kit: SC.fern, density: 2, scale: [1.3, 2.4] },
    { zone: 'hill', kit: SC.mossy, density: 0.25, scale: [0.8, 1.6] },
    { zone: 'hill', kit: SC.ti(false), density: 0.1 },
  ],
  paving: { kind: 'earth', color: '#d6c79f', joint: '#bba985' },
  people: { clothes: ['#e2d2ae', '#c99a5a', '#8e4a2c', '#d8c49a', '#6a3a22', '#d6b04a'], skin: SKIN },
  clouds: { color: '#ffffff', shade: '#b6cfe0', shadow: 0.3 },
};
