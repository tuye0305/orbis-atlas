import * as THREE from 'three';
import { jitter, loft, pick, type Kit, type Rng } from '../kit';
import { TREES, mountains, plinth, type Bed, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Tenochtitlan, 1325–1519 */

type C = THREE.ColorRepresentation;

/* Mostly lime-white stucco and plain adobe; the attested pigments (red and yellow ochre, a
   Maya-blue-like turquoise) only in thin bands, door frames and on the temple. */
const STUCCO = ['#e4ddcc', '#e0d7c3', '#e8e1d1', '#dcd2bd', '#e2d9c6'];
const ADOBE = ['#b89a72', '#c2a57e', '#ad8f68', '#bfa27a'];
const LIME_ROOF = '#d6cdb9';
/** Tinted lime washes, and the tamped-earth roofs and yards of the plain adobe houses. */
const WASH = ['#e3c9a0', '#e8d2b4', '#dcbf98', '#e6c6b0', '#d9c6a4'];
const EARTH_ROOF = ['#a88d66', '#9e8460', '#b09670', '#a08a68'];
const YARD = ['#bca580', '#b39d78', '#c4ad86'];
const OCHRE = '#c27a35';
const RED = '#a8442c';
const BLUE = '#4f9fb2';
const YELLOW = '#d1a23e';
const TEZONTLE = '#86503f';
const BASALT = '#5b5650';
const DARK = '#221913';
const WOOD = '#6e4c30';
const STONE = '#b3a68c';
const THATCH = ['#c4a15c', '#b8924e', '#caa968'];
const CLAY = ['#b8703e', '#a85f36', '#c4834f', '#9a5a38'];
const COTTON = '#f2ede2';
const FIRE = '#ff9a3a';
const MARIGOLD = ['#f08a1c', '#f5a623', '#e8761a'];
const SKIN = '#8f5f40';

/* ---------------------------------------------------------------- modelling helpers */

/** A local frame: parts placed at (lx, y, lz) inside it land turned by ry about (x, z). */
interface F {
  x: number;
  z: number;
  y: number;
  ry: number;
}
const F0: F = { x: 0, z: 0, y: 0, ry: 0 };
const frame = (x: number, z: number, y = 0, ry = 0): F => ({ x, z, y, ry });
const at = (f: F, lx: number, lz: number) => {
  const c = Math.cos(f.ry);
  const s = Math.sin(f.ry);
  return [f.x + lx * c + lz * s, f.z - lx * s + lz * c] as const;
};
const fb = (k: Kit, f: F, w: number, h: number, d: number, lx: number, y: number, lz: number, color: C) => {
  const [x, z] = at(f, lx, lz);
  k.box(w, h, d, x, f.y + y, z, color, f.ry);
};

const M4 = new THREE.Matrix4();
const QT = new THREE.Quaternion();
const EU = new THREE.Euler();
const VP = new THREE.Vector3();
const VS = new THREE.Vector3();
/** Any geometry, centred at (lx, y, lz) of a frame, tilted (rx, rz) then turned (ry + the frame's). */
const place = (k: Kit, f: F, g: THREE.BufferGeometry, lx: number, y: number, lz: number, color: C, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => {
  const [x, z] = at(f, lx, lz);
  EU.set(rx, f.ry + ry, rz, 'YXZ');
  QT.setFromEuler(EU);
  M4.compose(VP.set(x, f.y + y, z), QT, VS.set(sx, sy, sz));
  k.add(g, color, M4);
};
const tbox = (k: Kit, f: F, w: number, h: number, d: number, lx: number, y: number, lz: number, color: C, rx = 0, ry = 0, rz = 0) =>
  place(k, f, new THREE.BoxGeometry(w, h, d), lx, y, lz, color, rx, ry, rz);
/** A flat disc facing +z of the frame (painted roundels, the carved stone). */
const disc = (k: Kit, f: F, r: number, lx: number, y: number, lz: number, color: C, seg = 10) =>
  place(k, f, new THREE.CylinderGeometry(r, r, 0.008, seg), lx, y, lz, color, Math.PI / 2);

/** A sloping talud body: a w0 × d0 rectangle at y rising h to a w1 × d1 one, with a top. */
function talud(k: Kit, w0: number, d0: number, w1: number, d1: number, h: number, x: number, y: number, z: number, color: C) {
  const a = [[-w0 / 2, 0, d0 / 2], [w0 / 2, 0, d0 / 2], [w0 / 2, 0, -d0 / 2], [-w0 / 2, 0, -d0 / 2]];
  const b = [[-w1 / 2, h, d1 / 2], [w1 / 2, h, d1 / 2], [w1 / 2, h, -d1 / 2], [-w1 / 2, h, -d1 / 2]];
  const pos: number[] = [];
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    pos.push(...a[i], ...a[j], ...b[j], ...a[i], ...b[j], ...b[i]);
  }
  pos.push(...b[0], ...b[1], ...b[2], ...b[0], ...b[2], ...b[3]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.translate(x, y, z);
  k.add(g, color);
}

/** A side profile [(z, y)…] extruded across x from x0 to x1 (the stair balustrades). */
function prism(k: Kit, pts: [number, number][], x0: number, x1: number, color: C) {
  const s = new THREE.Shape(pts.map(([u, v]) => new THREE.Vector2(u, v)));
  const g = new THREE.ExtrudeGeometry(s, { depth: x1 - x0, bevelEnabled: false });
  g.rotateY(-Math.PI / 2);
  g.translate(x1, 0, 0);
  k.add(g, color);
}

/* ---------------------------------------------------------------- house parts */

interface Door {
  x: number;
  w: number;
  h: number;
}
interface RoomOpts {
  w: number;
  h: number;
  d: number;
  wall: C;
  /** Doorways in the +z wall, set back into it under a lintel. */
  doors?: Door[];
  lintel?: C;
  /** A painted stripe under the roof line. */
  band?: C;
  /** A painted base course (red ochre on the better houses). */
  dado?: C;
  /** Lime-plastered flat roof with a low parapet; null for none (a thatch goes on instead). */
  roof?: C | null;
  merlon?: C;
  drains?: number;
  /** A cloth or reed-mat hanging half-drawn across the first doorway. */
  curtain?: C;
}

/** The flat roof: a lime slab inside a low parapet, optionally crowned with merlons (almenas). */
function flatRoof(k: Kit, f: F, w: number, d: number, h: number, lx: number, lz: number, wall: C, roof: C, merlon?: C) {
  const pt = 0.028;
  const ph = 0.035;
  fb(k, f, w - 2 * pt, 0.008, d - 2 * pt, lx, h, lz, roof);
  fb(k, f, w, ph, pt, lx, h, lz + d / 2 - pt / 2, wall);
  fb(k, f, w, ph, pt, lx, h, lz - d / 2 + pt / 2, wall);
  fb(k, f, pt, ph, d - 2 * pt, lx + w / 2 - pt / 2, h, lz, wall);
  fb(k, f, pt, ph, d - 2 * pt, lx - w / 2 + pt / 2, h, lz, wall);
  if (!merlon) return;
  const nx = Math.max(2, Math.round(w / 0.11));
  const nz = Math.max(1, Math.round(d / 0.1) - 1);
  for (let i = 0; i < nx; i++) {
    const x = lx - w / 2 + ((i + 0.5) * w) / nx;
    fb(k, f, 0.034, 0.042, 0.02, x, h + ph, lz + d / 2 - pt / 2, merlon);
    fb(k, f, 0.034, 0.042, 0.02, x, h + ph, lz - d / 2 + pt / 2, merlon);
  }
  for (let i = 0; i < nz; i++) {
    const z = lz - d / 2 + ((i + 1) * d) / (nz + 1);
    fb(k, f, 0.02, 0.042, 0.034, lx + w / 2 - pt / 2, h + ph, z, merlon);
    fb(k, f, 0.02, 0.042, 0.034, lx - w / 2 + pt / 2, h + ph, z, merlon);
  }
}

/** One flat-roofed room of adobe or stuccoed stone, its doorways in the +z wall. */
function room(k: Kit, f: F, o: RoomOpts) {
  const { w, h, d } = o;
  const t = 0.035;
  const doors = [...(o.doors ?? [])].sort((a, b) => a.x - b.x);
  const fz = d / 2 - t / 2;
  if (doors.length) {
    fb(k, f, w, h, d - t, 0, 0, -t / 2, o.wall);
    let x0 = -w / 2;
    const seg = (a: number, b: number) => {
      if (b - a < 0.002) return;
      fb(k, f, b - a, h, t, (a + b) / 2, 0, fz, o.wall);
    };
    for (const dr of doors) {
      seg(x0, dr.x - dr.w / 2);
      fb(k, f, dr.w, h - dr.h, t, dr.x, dr.h, fz, o.wall);
      fb(k, f, dr.w, dr.h, 0.006, dr.x, 0, d / 2 - t + 0.004, DARK);
      fb(k, f, dr.w + 0.06, 0.026, t + 0.016, dr.x, dr.h - 0.004, fz + 0.004, o.lintel ?? WOOD);
      if (o.curtain && dr === doors[0]) fb(k, f, dr.w - 0.01, dr.h * 0.5, 0.006, dr.x, dr.h * 0.5, d / 2 - t + 0.014, o.curtain);
      x0 = dr.x + dr.w / 2;
    }
    seg(x0, w / 2);
  } else {
    fb(k, f, w, h, d, 0, 0, 0, o.wall);
    if (o.dado) fb(k, f, w + 0.006, 0.045, 0.006, 0, 0, d / 2, o.dado);
  }
  if (o.dado) {
    fb(k, f, w + 0.006, 0.045, 0.006, 0, 0, -d / 2, o.dado);
    fb(k, f, 0.006, 0.045, d, w / 2, 0, 0, o.dado);
    fb(k, f, 0.006, 0.045, d, -w / 2, 0, 0, o.dado);
  }
  if (o.band) fb(k, f, w + 0.008, 0.028, d + 0.008, 0, h - 0.05, 0, o.band);
  if (o.roof !== null) flatRoof(k, f, w, d, h, 0, 0, o.wall, o.roof ?? LIME_ROOF, o.merlon);
  // rain spouts through the parapet
  for (let i = 0; i < (o.drains ?? 0); i++) {
    if (i === 0) fb(k, f, 0.022, 0.018, 0.07, w * 0.32, h - 0.004, d / 2 + 0.02, '#9c8869');
    else fb(k, f, 0.07, 0.018, 0.022, -w / 2 - 0.02, h - 0.004, -d * 0.2, '#9c8869');
  }
}

/** Cuexcomatl: a tall, pot-bellied maize granary of daubed clay on a stone ring, thatch-capped. */
function granary(k: Kit, f: F, lx: number, lz: number, r: Rng, s = 1) {
  const [x, z] = at(f, lx, lz);
  const y = f.y;
  k.cyl(0.07 * s, 0.08 * s, 0.04 * s, 7, x, y, z, '#8a7c68');
  const prof = [[0.045, 0], [0.075, 0.05], [0.088, 0.12], [0.08, 0.19], [0.055, 0.24], [0.04, 0.255]].map(([a, b]) => new THREE.Vector2(a * s, b * s));
  const g = new THREE.LatheGeometry(prof, 8);
  g.translate(x, y + 0.04 * s, z);
  k.add(g, jitter(pick(r, ['#b0906a', '#a88660', '#bc9a72']), r));
  const th = jitter(pick(r, THATCH), r);
  k.cyl(0.012 * s, 0.1 * s, 0.1 * s, 8, x, y + 0.27 * s, z, th, r() * 2);
  k.cyl(0.004, 0.016 * s, 0.035 * s, 5, x, y + 0.365 * s, z, '#9a7a40');
}

/** Temazcal: a low domed sweat-bath with a crawl-in door, and the stove that heats it. */
function temazcal(k: Kit, f: F, lx: number, lz: number, r: Rng) {
  const [x, z] = at(f, lx, lz);
  const c = jitter(pick(r, ['#c9b896', '#d8ccb4', '#b9a07c']), r);
  k.sphere(0.12, x, f.y, z, c, 0.62, 1);
  fb(k, f, 0.085, 0.07, 0.05, lx, 0, lz + 0.095, STONE);
  fb(k, f, 0.05, 0.048, 0.008, lx, 0, lz + 0.121, DARK);
  fb(k, f, 0.09, 0.075, 0.08, lx, 0, lz - 0.12, jitter('#9a8a72', r));
  fb(k, f, 0.04, 0.014, 0.03, lx, 0.075, lz - 0.12, '#3a302a');
  const [sx, sz] = at(f, lx, lz - 0.12);
  k.mark('smoke', sx, f.y + 0.09, sz);
}

/** A household shrine: a little stepped altar (momoztli) with an image house, a brazier and flowers. */
function shrine(k: Kit, f: F, lx: number, lz: number, r: Rng) {
  const wall = pick(r, STUCCO);
  const paint = pick(r, [RED, RED, BLUE, YELLOW]);
  fb(k, f, 0.18, 0.035, 0.16, lx, 0, lz, '#d9d0bb');
  fb(k, f, 0.13, 0.035, 0.12, lx, 0.035, lz - 0.012, wall);
  fb(k, f, 0.08, 0.075, 0.07, lx, 0.07, lz - 0.02, wall);
  fb(k, f, 0.034, 0.05, 0.006, lx, 0.07, lz + 0.016, DARK);
  fb(k, f, 0.094, 0.022, 0.084, lx, 0.145, lz - 0.02, paint);
  fb(k, f, 0.06, 0.02, 0.05, lx, 0.167, lz - 0.02, wall);
  const [bx, bz] = at(f, lx + 0.045, lz + 0.055);
  k.cyl(0.016, 0.011, 0.03, 6, bx, f.y + 0.035, bz, pick(r, CLAY));
  k.sphere(0.011, bx, f.y + 0.068, bz, FIRE, 1, 0);
  const [mx, mz] = at(f, lx - 0.045, lz + 0.055);
  k.sphere(0.014, mx, f.y + 0.045, mz, MARIGOLD[0], 0.8, 0);
  k.sphere(0.011, mx + 0.018, f.y + 0.042, mz + 0.006, MARIGOLD[1], 0.8, 0);
}

/** Cooking pots and water jars (ollas), a few of them in a cluster. */
function pots(k: Kit, f: F, lx: number, lz: number, r: Rng, n = 3) {
  for (let i = 0; i < n; i++) {
    const a = i * 2.3 + r();
    const rr = i === 0 ? 0 : 0.045 + r() * 0.02;
    const [x, z] = at(f, lx + Math.cos(a) * rr, lz + Math.sin(a) * rr);
    const s = i === 0 ? 0.04 : 0.024 + r() * 0.012;
    const c = jitter(pick(r, CLAY), r);
    k.sphere(s, x, f.y + s * 0.8, z, c, 0.85, 0);
    k.cyl(s * 0.55, s * 0.45, s * 0.5, 7, x, f.y + s * 1.45, z, c, 0, true);
  }
}

/** The kitchen yard: a reed mat (petate), a basalt metate with its mano, and the three-stone hearth with a comal. */
function kitchen(k: Kit, f: F, lx: number, lz: number, r: Rng, dir = 1) {
  const mat = jitter('#d4bb80', r);
  fb(k, f, 0.17, 0.006, 0.12, lx, 0, lz, mat);
  fb(k, f, 0.17, 0.007, 0.016, lx, 0, lz - 0.03, '#b2955a');
  fb(k, f, 0.17, 0.007, 0.016, lx, 0, lz + 0.03, '#b2955a');
  // metate on its three feet, sloping toward the woman kneeling at it
  tbox(k, f, 0.085, 0.018, 0.05, lx - 0.03, 0.028, lz, BASALT, 0, 0, 0.18);
  for (const [dx, dz] of [[-0.06, -0.016], [-0.06, 0.016], [0.0, 0]]) fb(k, f, 0.012, 0.024, 0.012, lx + dx, 0, lz + dz, BASALT);
  tbox(k, f, 0.012, 0.012, 0.058, lx - 0.01, 0.046, lz, '#6a645c', 0, 0, 0.18);
  // hearth (tlecuil)
  const hx = lx + dir * 0.11;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const [x, z] = at(f, hx + Math.cos(a) * 0.03, lz + Math.sin(a) * 0.03);
    k.sphere(0.016, x, f.y + 0.012, z, BASALT, 1.2, 0);
  }
  const [x, z] = at(f, hx, lz);
  k.sphere(0.016, x, f.y + 0.006, z, '#e8762a', 0.6, 0);
  k.cyl(0.044, 0.044, 0.006, 10, x, f.y + 0.03, z, '#4a4240');
  k.mark('smoke', x, f.y + 0.05, z);
}

/** A cotton awning on four poles, shading whatever is under it. */
function awning(k: Kit, f: F, lx: number, lz: number, w: number, d: number, r: Rng) {
  const h = 0.17;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) fb(k, f, 0.012, h + (sz < 0 ? 0.02 : 0), 0.012, lx + (sx * w) / 2, 0, lz + (sz * d) / 2, WOOD);
  const cloth = r() < 0.7 ? COTTON : pick(r, ['#e9dcc0', '#f0e4c8']);
  tbox(k, f, w + 0.04, 0.008, d + 0.04, lx, h + 0.012, lz, cloth, 0.11);
  if (r() < 0.5) tbox(k, f, w + 0.042, 0.009, 0.02, lx, h + 0.012 - Math.sin(0.11) * (d / 2 + 0.01), lz + d / 2 + 0.01, pick(r, [RED, BLUE, YELLOW]), 0.11);
}

/** A notched-pole ladder leaning back (toward -z) against a wall `h` high. */
function ladder(k: Kit, f: F, lx: number, lz: number, h: number) {
  const a = 0.22;
  const L = h / Math.cos(a) + 0.04;
  const cz = lz - (Math.tan(a) * h) / 2;
  for (const sx of [-0.025, 0.025]) tbox(k, f, 0.012, L, 0.012, lx + sx, L / 2 - 0.01, cz, WOOD, -a);
  for (let i = 1; i <= 3; i++) {
    const yy = (h * i) / 4;
    fb(k, f, 0.06, 0.008, 0.01, lx, yy, lz - Math.tan(a) * yy, WOOD);
  }
}

/** A rooftop or patio garden: a soil bed with herbs and marigolds (cempoalxochitl). */
function garden(k: Kit, f: F, lx: number, y: number, lz: number, w: number, d: number, r: Rng) {
  fb(k, f, w, 0.03, d, lx, y, lz, jitter('#c9bfa6', r));
  fb(k, f, w - 0.02, 0.008, d - 0.02, lx, y + 0.03, lz, '#5e4632');
  const n = Math.min(9, 3 + Math.floor(w * d * 90) + Math.floor(r() * 2));
  for (let i = 0; i < n; i++) {
    const [x, z] = at(f, lx + (r() - 0.5) * (w - 0.05), lz + (r() - 0.5) * (d - 0.05));
    if (r() < 0.4) k.sphere(0.017 + r() * 0.008, x, f.y + y + 0.045, z, pick(r, MARIGOLD), 0.8, 0);
    else k.sphere(0.026 + r() * 0.014, x, f.y + y + 0.052, z, jitter(pick(r, ['#5f8f46', '#6f9a48', '#7aa452', '#4f8040']), r), 1.1, 0);
  }
  // a squash vine spilling over the front edge
  if (w > 0.14 && r() < 0.5) {
    const [x, z] = at(f, lx + (r() - 0.5) * w * 0.5, lz + d / 2 + 0.01);
    k.sphere(0.03, x, f.y + y + 0.02, z, '#6a9a48', 0.55, 0);
    if (r() < 0.6) k.sphere(0.014, x + 0.02, f.y + y + 0.035, z, '#e0a030', 1, 0);
  }
}

/** Turkeys (huexolotl), the household's fowl. */
function turkeys(k: Kit, f: F, lx: number, lz: number, r: Rng) {
  for (let i = 0; i < 2; i++) {
    const [x, z] = at(f, lx + i * 0.07 - 0.03, lz + (r() - 0.5) * 0.06);
    k.sphere(0.024, x, f.y + 0.03, z, '#3b3431', 0.85, 0);
    k.sphere(0.01, x + 0.022, f.y + 0.055, z, '#b8402e', 1, 0);
  }
}

/** A small maguey or nopal growing in the yard. */
function yardPlant(k: Kit, f: F, lx: number, lz: number, r: Rng) {
  const [x, z] = at(f, lx, lz);
  if (r() < 0.55) {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + r();
      const g = new THREE.ConeGeometry(0.02, 0.15, 4);
      g.scale(1, 1, 0.4);
      EU.set(0.6 + (i % 2) * 0.3, a, 0, 'YXZ');
      QT.setFromEuler(EU);
      const dir = new THREE.Vector3(0, 0.07, 0).applyQuaternion(QT);
      M4.compose(VP.set(x + dir.x, f.y + dir.y, z + dir.z), QT, VS.set(1, 1, 1));
      k.add(g, i % 2 ? '#6f9e90' : '#82b09e', M4);
    }
  } else {
    const p = (px: number, py: number, pz: number, s: number, a: number, tilt: number) => {
      const g = new THREE.IcosahedronGeometry(0.045 * s, 0);
      g.scale(1, 1.3, 0.32);
      EU.set(0, a, tilt, 'YXZ');
      QT.setFromEuler(EU);
      M4.compose(VP.set(px, py, pz), QT, VS.set(1, 1, 1));
      k.add(g, '#5f8f46', M4);
    };
    p(x, f.y + 0.05, z, 1, r() * 3, 0);
    p(x + 0.03, f.y + 0.12, z, 0.8, r() * 3, -0.4);
    p(x - 0.03, f.y + 0.11, z, 0.75, r() * 3, 0.45);
  }
}

/* ---------------------------------------------------------------- canoes */

/** A dugout hull (acalli) along x, bow at +x: open lofted shell, the ends rising a little. */
function hull(L: number, W: number, D: number) {
  const rings: THREE.Vector3[][] = [];
  const N = 8;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = (t - 0.5) * L;
    const e = Math.abs(t * 2 - 1);
    const hw = Math.max(0.004, (W / 2) * Math.pow(Math.sin(Math.PI * t), 0.5));
    const top = D * 0.5 + D * 0.3 * e ** 3;
    const bot = -D * 0.5 * (1 - e ** 3) + D * 0.2 * e ** 3;
    const mid = THREE.MathUtils.lerp(bot, top, 0.55);
    rings.push([new THREE.Vector3(x, top, -hw), new THREE.Vector3(x, mid, -hw * 0.9), new THREE.Vector3(x, bot, 0), new THREE.Vector3(x, mid, hw * 0.9), new THREE.Vector3(x, top, hw)]);
  }
  return loft(rings, false);
}

function canoe(k: Kit, f: F, lx: number, y: number, lz: number, ry: number, L: number, r: Rng) {
  const wood = jitter(pick(r, ['#6a4429', '#5b3b25', '#74502f']), r);
  place(k, f, hull(L, L * 0.2, L * 0.13), lx, y, lz, wood, 0, ry);
  const [x, z] = at(f, lx, lz);
  k.box(L * 0.6, 0.006, L * 0.1, x, f.y + y + L * 0.005, z, '#3e281a', f.ry + ry);
}

/** A figure kneeling (to paddle) or standing (to pole), facing +x. */
function figure(k: Kit, f: F, lx: number, y: number, lz: number, r: Rng, standing: boolean, cloth: C) {
  const [x, z] = at(f, lx, lz);
  const ty = standing ? 0.09 : 0.035;
  if (standing) k.box(0.03, 0.09, 0.04, x, f.y + y, z, SKIN, f.ry);
  else k.box(0.06, 0.03, 0.045, x - 0.01, f.y + y, z, SKIN, f.ry);
  k.box(0.034, 0.03, 0.046, x, f.y + y + ty - 0.012, z, COTTON, f.ry);
  k.box(0.034, 0.06, 0.044, x, f.y + y + ty + 0.015, z, standing ? cloth : SKIN, f.ry);
  k.sphere(0.02, x + 0.004, f.y + y + ty + 0.095, z, SKIN, 1.1, 0);
  k.sphere(0.018, x - 0.004, f.y + y + ty + 0.103, z, '#1c1612', 0.8, 0);
  if (!standing && r() < 0.6) k.box(0.04, 0.045, 0.05, x - 0.005, f.y + y + ty + 0.03, z, cloth, f.ry);
}

/* ---------------------------------------------------------------- house types */

/** Bajareque hut of the lake shore and the outskirts: daubed wattle walls under a deep thatch. */
function jacal(k: Kit, r: Rng) {
  plinth(k, 0.92, 0.92, '#9c8c70');
  k.box(0.86, 0.01, 0.86, 0, 0.02, 0, jitter('#b9a582', r, 0.01, 0.03, 0.03));
  const w = 0.4 + r() * 0.08;
  const d = 0.34 + r() * 0.06;
  const h = 0.22 + r() * 0.04;
  const side = r() < 0.5 ? -1 : 1;
  const mx = side * (0.44 - w / 2 - 0.06);
  const f = frame(mx, -0.37 + d / 2);
  const wall = jitter(pick(r, r() < 0.75 ? ADOBE : STUCCO), r, 0.01, 0.04, 0.04);
  room(k, f, { w, h, d, wall, doors: [{ x: (r() - 0.5) * 0.1, w: 0.11, h: 0.16 }], roof: null, dado: r() < 0.3 ? '#9a8262' : undefined });
  const th = jitter(pick(r, THATCH), r);
  k.hip(w + 0.16, d + 0.16, 0.3, { ridge: w * 0.35, k: 0.8, x: mx, y: h - 0.02, z: f.z }, th);
  k.box(w * 0.36, 0.03, 0.03, mx, h + 0.27, f.z, '#9a7a40');
  // the hearth inside: smoke seeps up through the thatch (a yard fire, if any, takes over)
  k.mark('smoke', mx, h + 0.26, f.z);
  const y = frame(0, 0, 0.03);
  // the yard: a granary in the free corner, the kitchen, pots, a plant
  const ox = -side;
  if (r() < 0.65) granary(k, y, ox * 0.32, -0.24, r, 0.9 + r() * 0.15);
  else temazcal(k, y, ox * 0.31, -0.22, r);
  if (r() < 0.7) kitchen(k, y, -0.02 * side, 0.24, r, -side);
  else pots(k, y, -0.05 * side, 0.2, r, 4);
  if (r() < 0.6) yardPlant(k, y, ox * 0.33, 0.33, r);
  if (r() < 0.35) turkeys(k, y, side * 0.22, 0.3, r);
  if (r() < 0.5) pots(k, y, mx + side * (w / 2 - 0.04), f.z + d / 2 + 0.05, r, 2);
}

/** A commoner's calli: whitewashed adobe rooms round a yard, flat lime roofs, a yard wall or a canal landing. */
function calli(k: Kit, r: Rng, nb: number, landing: boolean) {
  plinth(k, 0.92, 0.92, '#a39478');
  // only the better-off houses near the centre were lime-plastered and whitewashed; out toward the
  // lake most were bare adobe under roofs of tamped earth, and some had a tinted wash
  const finish = r();
  const lime = finish < 0.22 + nb * 0.06;
  const tinted = !lime && finish < 0.48 + nb * 0.05;
  const wall = lime ? jitter(pick(r, STUCCO), r, 0.01, 0.03, 0.03) : tinted ? jitter(pick(r, WASH), r, 0.01, 0.03, 0.03) : jitter(pick(r, ADOBE), r);
  const roof = lime || tinted ? jitter(LIME_ROOF, r, 0.01, 0.03, 0.04) : jitter(pick(r, EARTH_ROOF), r, 0.01, 0.04, 0.04);
  k.box(0.88, 0.012, 0.88, 0, 0.02, 0, lime ? jitter('#d6c9ad', r, 0.01, 0.03, 0.03) : jitter(pick(r, YARD), r, 0.01, 0.03, 0.03));
  const band = r() < (lime ? 0.5 : tinted ? 0.35 : 0.12) ? pick(r, [RED, RED, OCHRE, YELLOW, BLUE]) : undefined;
  const dado = lime && r() < 0.45 ? pick(r, [RED, RED, TEZONTLE]) : !lime && r() < 0.25 ? '#8a6a4a' : undefined;
  const lintel = r() < 0.6 ? WOOD : STONE;
  const curtain = r() < 0.5 ? pick(r, [COTTON, COTTON, '#d4bb80', '#c9b07a', '#b65a3c', '#3f8a9a', '#c8452f']) : undefined;

  // the main room along the back: some long and low, some tall and narrow
  const w = 0.46 + r() * 0.24;
  const d = 0.28 + r() * 0.1;
  const h = 0.23 + r() * 0.15;
  const mx = (r() - 0.5) * (0.84 - w);
  const mz = -0.43 + d / 2;
  const doorX = (r() - 0.5) * (w - 0.2);
  const doors: Door[] = [{ x: doorX, w: 0.1 + r() * 0.04, h: Math.min(h - 0.06, 0.15 + r() * 0.05) }];
  if (w > 0.6 && r() < 0.5) doors.push({ x: doorX > 0 ? doorX - 0.22 : doorX + 0.22, w: 0.09, h: Math.min(h - 0.07, 0.15) });
  room(k, frame(mx, mz), { w, h, d, wall, band, dado, lintel, roof, curtain, doors, drains: 1 + (r() < 0.5 ? 1 : 0) });
  // a hearth indoors breathes out at the doorway; a yard fire, if there is one, takes over below
  k.mark('smoke', mx + doorX, 0.2, mz + d / 2 + 0.03);
  let upper = false;
  const roofUse = r();
  if (nb >= 3 && roofUse < 0.36) {
    // a second room on the roof terrace, reached by a ladder, often with its own colour band; a
    // shade or a planter on the open part of the terrace beside it
    upper = true;
    const uw = w * (0.42 + r() * 0.16);
    const us = r() < 0.5 ? -1 : 1;
    const ux = mx + us * (w - uw) * 0.5;
    const ud = d * 0.62;
    const uband = r() < 0.6 ? pick(r, [RED, OCHRE, BLUE, YELLOW]) : band;
    room(k, frame(ux, mz - (d - ud) / 2, h), { w: uw, h: 0.17 + r() * 0.06, d: ud, wall, band: uband, lintel, roof, curtain: r() < 0.4 ? pick(r, [COTTON, '#b65a3c', '#3f8a9a']) : undefined, doors: [{ x: (r() - 0.5) * 0.06, w: 0.08, h: 0.12 }], drains: 1 });
    const tx = mx - us * (uw * 0.5 + 0.02);
    const tw = Math.min(0.18, (w - uw) * 0.7);
    if (r() < 0.5) awning(k, frame(tx, mz + d * 0.12, h + 0.008), 0, 0, tw, 0.1, r);
    else garden(k, frame(tx, mz + d * 0.12, h), 0, 0, 0, tw, 0.1, r);
    ladder(k, frame(0, 0, 0.03), mx - us * w * 0.32, mz + d / 2 + 0.06, h);
  } else if (roofUse < 0.62) {
    // a roof garden: planters of herbs, flowers and squash, often beside a cotton shade
    const gw = w * (0.36 + r() * 0.2);
    const gx = (r() < 0.5 ? -1 : 1) * (w - gw - 0.06) * 0.5;
    garden(k, frame(mx, mz, h), gx, 0, -d * 0.05, gw, d * 0.5, r);
    if (r() < 0.55) {
      const rf = frame(mx, mz, h + 0.008);
      const ax = gx > 0 ? -w * 0.25 : w * 0.25;
      awning(k, rf, ax, 0, 0.15, Math.min(0.15, d * 0.5), r);
      if (r() < 0.6) fb(k, rf, 0.11, 0.005, 0.09, ax, 0, 0, jitter('#d4bb80', r));
    }
    if (r() < 0.6) ladder(k, frame(0, 0, 0.03), mx + w * 0.32, mz + d / 2 + 0.06, h);
  } else if (roofUse < 0.84) {
    // maize cobs or chiles drying on a mat on the roof, a jar beside them
    const rf = frame(mx, mz, h + 0.008);
    fb(k, rf, w * 0.4, 0.005, d * 0.45, -w * 0.12, 0, 0, '#d4bb80');
    const crop = r() < 0.6 ? ['#e0b23a', '#d9a62e', '#efe0a0'] : ['#b0382a', '#c24a2a', '#8e2a22'];
    for (let i = 0; i < 5; i++) fb(k, rf, 0.04, 0.014, 0.022, -w * 0.12 + ((i % 3) - 1) * w * 0.11, 0.005, (Math.floor(i / 3) - 0.5) * d * 0.18, pick(r, crop));
    if (r() < 0.5) pots(k, rf, w * 0.25, -d * 0.15, r, 1);
  }

  // a side room along one edge, its door to the yard
  const side = r() < 0.5 ? -1 : 1;
  const hasSide = r() < 0.62;
  if (hasSide) {
    const sw = 0.28 + r() * 0.12;
    const sd = 0.22 + r() * 0.04;
    const sh = h * (0.82 + r() * 0.1);
    const sz = -0.43 + d + 0.01 + sw / 2;
    room(k, frame(side * (0.44 - sd / 2), sz, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2), { w: sw, h: sh, d: sd, wall, band: upper ? undefined : band, lintel, roof, curtain: r() < 0.3 ? COTTON : undefined, doors: [{ x: 0, w: 0.1, h: 0.16 }], drains: r() < 0.5 ? 1 : 0 });
  }

  const y = frame(0, 0, 0.032);
  const free = hasSide ? -side : r() < 0.5 ? -1 : 1;
  const yardZ = -0.43 + d + 0.13;
  if (landing) {
    // the canal landing: a stone quay with steps down to the water, a canoe drawn up on it
    k.box(0.9, 0.045, 0.12, 0, 0, 0.39, STONE);
    const sx = free * 0.2;
    for (let s = 0; s < 3; s++) k.box(0.2, 0.36 - s * 0.08, 0.045, sx, -0.34, 0.47 + s * 0.045, jitter(STONE, r, 0.01, 0.02, 0.04));
    k.cyl(0.014, 0.017, 0.16, 5, sx + free * 0.14, 0.02, 0.43, WOOD);
    canoe(k, y, -free * 0.12, 0.05, 0.385, 0.04, 0.44, r);
    if (r() < 0.6) {
      awning(k, y, free * 0.26, 0.17, 0.2, 0.16, r);
      pots(k, y, free * 0.26, 0.17, r, 3);
    } else kitchen(k, y, free * 0.12, Math.max(yardZ, 0.14), r, free);
  } else {
    // the yard wall, with its gateway
    if (r() < 0.6) {
      const wh = 0.085;
      const gx = (hasSide ? side * 0.06 : 0) + (r() - 0.5) * 0.1;
      const gw = 0.15;
      const L = gx - gw / 2 + 0.44;
      const R = 0.44 - gx - gw / 2;
      k.box(L, wh, 0.035, -0.44 + L / 2, 0, 0.425, wall);
      k.box(R, wh, 0.035, 0.44 - R / 2, 0, 0.425, wall);
      for (const s of [-1, 1]) k.box(0.045, wh + 0.03, 0.045, gx + (s * gw) / 2, 0, 0.425, wall);
      const z1 = -0.43 + d;
      const wl = 0.41 - z1;
      k.box(0.035, wh, wl, free * 0.425, 0, z1 + wl / 2, wall);
      if (!hasSide) k.box(0.035, wh, wl, -free * 0.425, 0, z1 + wl / 2, wall);
    }
    // what happens in the yard
    const cr = r();
    const cx = free * 0.27;
    const cz = Math.max(yardZ + 0.04, 0.24);
    if (cr < 0.36) granary(k, y, cx, cz, r, 0.85 + r() * 0.2);
    else if (cr < 0.56) temazcal(k, y, cx, cz, r);
    else if (cr < 0.78) shrine(k, y, cx, cz, r);
    else if (cr < 0.9) garden(k, y, cx, 0, cz, 0.18, 0.18, r);
    else yardPlant(k, y, cx, cz, r);
    const mr = r();
    const kx = -free * 0.02;
    const kz = Math.min(0.3, yardZ + 0.02);
    if (mr < 0.4) kitchen(k, y, kx - free * 0.04, kz, r, free);
    else if (mr < 0.62) pots(k, y, kx, kz, r, 3 + Math.floor(r() * 2));
    else if (mr < 0.82) {
      awning(k, y, kx, kz, 0.18, 0.14, r);
      if (r() < 0.6) fb(k, y, 0.14, 0.006, 0.1, kx, 0, kz, jitter('#d4bb80', r));
      pots(k, y, kx + 0.03, kz, r, 2);
    } else turkeys(k, y, kx, kz, r);
    if (r() < 0.4) pots(k, y, mx + doorX + 0.12, mz + d / 2 + 0.05, r, 2);
  }
}

/** A lord's house: rooms of stuccoed stone round a white patio on a tezontle platform, a portico,
 *  an upper storey crowned with merlons, roof gardens and a painted gateway. */
function palace(k: Kit, r: Rng) {
  plinth(k, 0.92, 0.92, '#a08e78');
  k.box(0.9, 0.07, 0.9, 0, 0, 0, jitter(TEZONTLE, r, 0.01, 0.04, 0.04));
  k.box(0.88, 0.012, 0.88, 0, 0.07, 0, '#efe9dd');
  k.box(0.2, 0.04, 0.03, 0, 0, 0.465, STONE);
  const Y = 0.082;
  const wall = jitter(pick(r, STUCCO), r, 0.005, 0.02, 0.02);
  const paint = pick(r, [RED, RED, BLUE, YELLOW]);
  const dado = r() < 0.6 ? RED : undefined;
  const merlon = r() < 0.9 ? wall : paint;

  // rear wing with a portico of square pillars and its roof terrace
  const f = frame(0, -0.32, Y);
  room(k, f, { w: 0.86, h: 0.28, d: 0.22, wall, band: paint, dado, roof: null, lintel: STONE, doors: [{ x: -0.2, w: 0.1, h: 0.18 }, { x: 0.2, w: 0.1, h: 0.18 }] });
  flatRoof(k, f, 0.86, 0.32, 0.28, 0, 0.05, wall, LIME_ROOF);
  for (const px of [-0.36, -0.12, 0.12, 0.36]) {
    fb(k, f, 0.04, 0.28, 0.04, px, 0, 0.19, wall);
    if (dado) fb(k, f, 0.046, 0.045, 0.046, px, 0, 0.19, dado);
  }
  fb(k, f, 0.86, 0.03, 0.1, 0, 0.25, 0.16, wall);
  fb(k, f, 0.86, 0.035, 0.012, 0, 0.245, 0.205, paint);
  // the upper storey
  room(k, frame(0, -0.35, Y + 0.28), { w: 0.56, h: 0.21, d: 0.17, wall, band: paint, merlon, lintel: STONE, doors: [{ x: 0, w: 0.1, h: 0.14 }], drains: 1 });

  // side wings facing the patio, a roof garden on one
  const gs = r() < 0.5 ? -1 : 1;
  for (const s of [-1, 1]) {
    const wf = frame(s * 0.34, 0.14, Y, s > 0 ? -Math.PI / 2 : Math.PI / 2);
    room(k, wf, { w: 0.48, h: 0.25, d: 0.2, wall, dado, lintel: STONE, doors: [{ x: -0.08, w: 0.1, h: 0.17 }] });
    if (s === gs && r() < 0.8) garden(k, frame(wf.x, wf.z, Y + 0.25, wf.ry), 0.08, 0, 0, 0.26, 0.12, r);
  }

  // the front wall and its gateway
  const gh = 0.13;
  const wh = 0.2;
  for (const s of [-1, 1]) {
    k.box(0.37, wh, 0.04, s * 0.255, Y, 0.41, wall);
    if (dado) k.box(0.37, 0.045, 0.046, s * 0.255, Y, 0.41, dado);
    k.box(0.37, 0.025, 0.046, s * 0.255, Y + wh - 0.04, 0.41, paint);
    for (let i = 0; i < 3; i++) k.box(0.034, 0.042, 0.02, s * (0.12 + i * 0.12), Y + wh, 0.41, merlon);
  }
  k.box(0.14, wh - gh, 0.04, 0, Y + gh, 0.41, wall);
  k.box(0.2, 0.03, 0.05, 0, Y + gh - 0.004, 0.41, paint);
  k.box(0.14, gh, 0.006, 0, Y, 0.392, DARK);
  k.box(0.034, 0.042, 0.02, 0, Y + wh, 0.41, merlon);

  // the patio
  const pf = frame(0, 0.13, Y + 0.012);
  const pr = r();
  if (pr < 0.4) shrine(k, pf, 0, -0.02, r);
  else if (pr < 0.7) {
    // a stone basin of water
    fb(k, pf, 0.22, 0.035, 0.18, 0, 0, 0, STONE);
    fb(k, pf, 0.18, 0.006, 0.14, 0, 0.033, 0, '#5f9aa4');
  } else garden(k, pf, 0, 0, 0, 0.22, 0.16, r);
  if (pr >= 0.4 && r() < 0.6) pots(k, pf, 0.16, 0.16, r, 2);
  if (r() < 0.5) {
    const mat = frame(-0.12, 0.1, Y + 0.012);
    fb(k, mat, 0.12, 0.006, 0.16, 0, 0, 0, jitter('#d4bb80', r));
    fb(k, mat, 0.016, 0.007, 0.16, 0.03, 0, 0, '#b2955a');
  }
}

/* ---------------------------------------------------------------- trees and scatter */

const leafCone = (k: Kit, x: number, y: number, z: number, r: number, len: number, tilt: number, a: number, color: C, flat = 0.4) => {
  const g = new THREE.ConeGeometry(r, len, 4);
  g.scale(1, 1, flat);
  EU.set(tilt, a, 0, 'YXZ');
  QT.setFromEuler(EU);
  const dir = new THREE.Vector3(0, len / 2, 0).applyQuaternion(QT);
  M4.compose(VP.set(x + dir.x, y + dir.y, z + dir.z), QT, VS.set(1, 1, 1));
  k.add(g, color, M4);
};
const pad = (k: Kit, x: number, y: number, z: number, s: number, a: number, tilt: number, color: C, detail = 0) => {
  const g = new THREE.IcosahedronGeometry(0.09 * s, detail);
  g.scale(1, 1.3, 0.3);
  EU.set(0, a, tilt, 'YXZ');
  QT.setFromEuler(EU);
  M4.compose(VP.set(x, y, z), QT, VS.set(1, 1, 1));
  k.add(g, color, M4);
};

function maguey(k: Kit, s = 1) {
  for (let f = 0; f < 9; f++) leafCone(k, 0, 0, 0, 0.055 * s, 0.44 * s, 0.95 + (f % 2) * 0.15, (f / 9) * Math.PI * 2, f % 2 ? '#6f9e90' : '#7fae9c');
  for (let f = 0; f < 5; f++) leafCone(k, 0, 0, 0, 0.045 * s, 0.38 * s, 0.4, (f / 5) * Math.PI * 2 + 0.4, f % 2 ? '#86b4a0' : '#78a894');
}

const TT: Record<string, (k: Kit) => void> = {
  ...TREES,
  /** Ahuejote: the tall, narrow willow planted along chinampa edges to hold the mud with its roots. */
  ahuejote(k) {
    k.cyl(0.018, 0.03, 0.36, 5, 0, 0, 0, '#6a5a46');
    k.sphere(0.085, 0, 0.6, 0, '#7f9f62', 3.2, 1);
    k.sphere(0.065, 0.012, 0.98, 0.01, '#90ae72', 2.6, 1);
    k.sphere(0.06, -0.03, 0.44, 0.025, '#738f58', 2.2, 0);
  },
  /** Ahuehuete, the Montezuma cypress: a buttressed trunk, a dark crown, hanging grey moss. */
  ahuehuete(k) {
    k.cyl(0.06, 0.11, 0.16, 6, 0, 0, 0, '#5a4434');
    k.cyl(0.04, 0.06, 0.42, 6, 0, 0.14, 0, '#5f4836');
    k.sphere(0.34, 0, 0.8, 0, '#3d5b35', 0.72);
    k.sphere(0.26, 0.22, 0.66, 0.1, '#46663a', 0.7);
    k.sphere(0.24, -0.2, 0.7, -0.08, '#365231', 0.7);
    k.sphere(0.2, 0.02, 0.98, 0.12, '#44633a', 0.75, 0);
    for (const [x, z] of [[0.22, 0.1], [-0.2, -0.1], [0.06, -0.22], [-0.08, 0.2]]) k.sphere(0.04, x, 0.55, z, '#8a9a7a', 2.4, 0);
  },
  maguey(k) {
    maguey(k);
  },
  /** A maguey sending up its flower stalk (quiote). */
  magueyFlower(k) {
    maguey(k, 0.9);
    k.cyl(0.008, 0.018, 1.15, 5, 0, 0.1, 0, '#8a8a52');
    for (let i = 0; i < 5; i++) {
      const y = 0.95 + i * 0.07;
      const a = i * 2.1;
      k.box(0.11, 0.008, 0.008, Math.cos(a) * 0.04, y, Math.sin(a) * 0.04, '#8a8a52', a);
      k.sphere(0.03, Math.cos(a) * 0.09, y + 0.02, -Math.sin(a) * 0.09, '#e0c040', 0.8, 0);
    }
  },
  /** Nopal: jointed pads with red and yellow tunas on their rims. */
  nopal(k) {
    k.cyl(0.02, 0.03, 0.1, 5, 0, 0, 0, '#7a6a48');
    pad(k, 0, 0.16, 0, 1.15, 0.2, 0, '#5f8f46', 1);
    pad(k, 0.06, 0.34, 0.01, 0.9, 0.5, -0.35, '#6a9a4c');
    pad(k, -0.07, 0.32, -0.01, 0.85, -0.3, 0.4, '#578a42');
    pad(k, 0.13, 0.46, 0.02, 0.7, 0.7, -0.6, '#649548');
    pad(k, -0.11, 0.44, 0.0, 0.65, 0.9, 0.5, '#5c8c44');
    for (const [x, y, c] of [[0.19, 0.55, '#c0305a'], [0.1, 0.56, '#e2b23a'], [-0.17, 0.52, '#c0305a'], [-0.03, 0.45, '#c0305a']] as const) k.sphere(0.022, x, y, 0.01, c, 1.2, 0);
  },
  /** Tule: bulrush clumps of the lake edge, a few with brown heads. */
  tule(k) {
    const m = new THREE.Matrix4();
    for (let f = 0; f < 13; f++) {
      const a = f * 2.39;
      const r = 0.03 + (f % 4) * 0.04;
      const hgt = 0.32 + (f % 5) * 0.07;
      const tx = Math.sin(a) * 0.18;
      const tz = Math.cos(a) * 0.18;
      m.compose(new THREE.Vector3(Math.cos(a) * r, hgt / 2 - 0.05, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(tx, 0, tz)), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.CylinderGeometry(0.004, 0.013, hgt, 3), f % 3 === 0 ? '#7e9048' : f % 2 ? '#8b9a52' : '#a0a85c', m);
      if (f % 4 === 1) k.sphere(0.014, Math.cos(a) * r + Math.sin(tz) * -hgt * 0.95 * 0.5, hgt - 0.06, Math.sin(a) * r + Math.sin(tx) * hgt * 0.5, '#7a5a3a', 2.2, 0);
    }
  },
};

const MINI = {
  maguey(k: Kit) {
    for (let f = 0; f < 7; f++) leafCone(k, 0, 0, 0, 0.025, 0.15, 0.8 + (f % 2) * 0.3, (f / 7) * Math.PI * 2, f % 2 ? '#6f9e90' : '#82b09e');
  },
  nopal(k: Kit) {
    pad(k, 0, 0.06, 0, 0.5, 0.3, 0, '#5f8f46');
    pad(k, 0.035, 0.14, 0, 0.4, 0.6, -0.5, '#6a9a4c');
    k.sphere(0.01, 0.06, 0.18, 0, '#c0305a', 1.2, 0);
  },
  reeds(k: Kit) {
    const m = new THREE.Matrix4();
    for (let f = 0; f < 6; f++) {
      const a = f * 2.39;
      const hgt = 0.14 + (f % 3) * 0.05;
      m.compose(new THREE.Vector3(Math.cos(a) * 0.03, hgt / 2 - 0.03, Math.sin(a) * 0.03), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * 0.2, 0, Math.cos(a) * 0.2)), new THREE.Vector3(1, 1, 1));
      k.add(new THREE.CylinderGeometry(0.003, 0.008, hgt, 3), f % 2 ? '#8b9a52' : '#a0a85c', m);
    }
  },
};

/* ---------------------------------------------------------------- the Templo Mayor */

const S1 = '#e9e2d1';
const S2 = '#dcd2bd';
const TAL = '#d6ccb6';
const LINE = '#776b58';

/** A stone serpent head at the foot of a balustrade, jaws open, facing +z. */
function serpentHead(k: Kit, x: number, y: number, z: number, paint: C, s = 1) {
  const st = '#cdb98e';
  const blob = (px: number, py: number, pz: number, rx: number, ry: number, rz: number, c: C, det = 1) =>
    place(k, F0, new THREE.IcosahedronGeometry(1, det), x + px * s, y + py * s, z + pz * s, c, 0, 0, 0, rx * s, ry * s, rz * s);
  k.box(0.1 * s, 0.085 * s, 0.07 * s, x, y, z - 0.05 * s, st);
  blob(0, 0.052, 0, 0.062, 0.048, 0.07, st);
  blob(0, 0.066, 0.068, 0.056, 0.026, 0.062, st);
  blob(0, 0.018, 0.062, 0.05, 0.016, 0.056, st, 0);
  k.box(0.084 * s, 0.03 * s, 0.05 * s, x, y + 0.02 * s, z + 0.07 * s, paint);
  place(k, F0, new THREE.CylinderGeometry(0.016 * s, 0.016 * s, 0.07 * s, 6), x, y + 0.088 * s, z + 0.1 * s, st, 0, 0, Math.PI / 2);
  for (const sx of [-1, 1]) {
    k.box(0.03 * s, 0.018 * s, 0.032 * s, x + sx * 0.036 * s, y + 0.088 * s, z + 0.02 * s, st);
    k.sphere(0.011 * s, x + sx * 0.04 * s, y + 0.08 * s, z + 0.045 * s, DARK, 1, 0);
    k.box(0.012 * s, 0.03 * s, 0.012 * s, x + sx * 0.03 * s, y + 0.022 * s, z + 0.106 * s, COTTON);
  }
}

/** A tall pottery brazier with its fire. */
function brazier(k: Kit, x: number, y: number, z: number, s = 1) {
  k.cyl(0.03 * s, 0.04 * s, 0.03 * s, 8, x, y, z, '#8a7a66');
  k.cyl(0.05 * s, 0.03 * s, 0.07 * s, 8, x, y + 0.03 * s, z, '#b0643a');
  k.cyl(0.056 * s, 0.05 * s, 0.014 * s, 8, x, y + 0.1 * s, z, '#c4834f');
  k.cyl(0, 0.04 * s, 0.07 * s, 6, x, y + 0.1 * s, z, FIRE);
  k.cyl(0, 0.022 * s, 0.09 * s, 5, x + 0.006, y + 0.1 * s, z, '#ffd46a');
}

/** A paper banner (pantli) on a pole. */
function banner(k: Kit, x: number, y: number, z: number, h: number, a: C, b: C) {
  k.box(0.012, h, 0.012, x, y, z, WOOD);
  k.box(0.004, 0.11, 0.07, x, y + h - 0.13, z + 0.04, a);
  k.box(0.005, 0.025, 0.07, x, y + h - 0.13, z + 0.04, b);
  k.box(0.005, 0.02, 0.07, x, y + h - 0.06, z + 0.04, b);
  k.sphere(0.012, x, y + h + 0.004, z, '#f0e0a0', 1, 0);
}

/** One of the twin shrines on the summit, door to +z. Tlaloc's in blue and white, with roundels and a
 *  crest of cloud-like merlons; Huitzilopochtli's in red and white, with stepped merlons. */
function shrineTop(k: Kit, x: number, y: number, z: number, tlaloc: boolean) {
  const a = tlaloc ? BLUE : '#b3342a';
  const w = 0.5;
  const d = 0.5;
  const h = 0.3;
  const f = frame(x, z, y);
  fb(k, f, w + 0.06, 0.035, d + 0.06, 0, 0, 0, S2);
  room(k, frame(x, z, y + 0.035), { w, h, d, wall: COTTON, roof: null, lintel: a, doors: [{ x: 0, w: 0.17, h: 0.21 }] });
  const yy = 0.035;
  // painted pilasters flanking the door, a base course
  for (const s of [-1, 1]) fb(k, f, 0.05, h, 0.012, s * 0.15, yy, d / 2 + 0.004, a);
  fb(k, f, w + 0.008, 0.035, d + 0.008, 0, yy, 0, a);
  // cornice and the tall roof frieze
  const fy = yy + h;
  fb(k, f, w + 0.06, 0.035, d + 0.06, 0, fy, 0, a);
  fb(k, f, w + 0.03, 0.012, d + 0.03, 0, fy + 0.035, 0, LINE);
  const w1 = w - 0.02;
  fb(k, f, w1, 0.2, w1, 0, fy + 0.047, 0, tlaloc ? COTTON : a);
  const sy = fy + 0.047;
  if (tlaloc) {
    // vertical blue and white bands
    const n = 7;
    for (let i = 0; i < n; i += 2) {
      const o = -w1 / 2 + ((i + 0.5) * w1) / n;
      fb(k, f, w1 / n, 0.2, 0.008, o, sy, w1 / 2, a);
      fb(k, f, w1 / n, 0.2, 0.008, o, sy, -w1 / 2, a);
      fb(k, f, 0.008, 0.2, w1 / n, w1 / 2, sy, o, a);
      fb(k, f, 0.008, 0.2, w1 / n, -w1 / 2, sy, o, a);
    }
  } else {
    for (const by of [0.04, 0.13]) fb(k, f, w1 + 0.008, 0.026, w1 + 0.008, 0, sy + by, 0, COTTON);
  }
  const ty = sy + 0.2;
  fb(k, f, w1 + 0.03, 0.03, w1 + 0.03, 0, ty, 0, tlaloc ? a : COTTON);
  const w2 = w - 0.1;
  fb(k, f, w2, 0.1, w2, 0, ty + 0.03, 0, tlaloc ? a : '#c24434');
  for (let i = 0; i < 4; i++) disc(k, f, 0.026, -w2 / 2 + ((i + 0.5) * w2) / 4, ty + 0.08, w2 / 2 + 0.005, COTTON, 8);
  // the crest
  const cy = ty + 0.13;
  fb(k, f, w2 + 0.02, 0.018, w2 + 0.02, 0, cy, 0, COTTON);
  const m = 5;
  for (let i = 0; i < m; i++) {
    const o = -w2 / 2 + ((i + 0.5) * w2) / m;
    for (const [lx, lz] of [[o, w2 / 2], [o, -w2 / 2], [w2 / 2, o], [-w2 / 2, o]]) {
      const [px, pz] = at(f, lx, lz);
      if (tlaloc) place(k, F0, new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8), px, y + cy + 0.045, pz, COTTON, Math.PI / 2, Math.abs(lz) > Math.abs(lx) ? 0 : Math.PI / 2);
      else {
        k.box(0.05, 0.035, 0.05, px, y + cy + 0.018, pz, COTTON);
        k.box(0.028, 0.035, 0.028, px, y + cy + 0.053, pz, COTTON);
      }
    }
  }
}

function templo(k: Kit) {
  const y0 = 0.02;
  // the paved court, and the coatepantli (serpent wall) round it
  k.box(2.92, 0.34, 2.92, 0, -0.32, 0, '#cfc5ae');
  k.box(2.86, 0.006, 2.86, 0, y0, 0, '#e6dfcf');
  const E = 1.34;
  const wallSeg = (x0: number, x1: number, z: number, alongX: boolean, out: number) => {
    const len = x1 - x0;
    const c = (x0 + x1) / 2;
    const bx = (w: number, h: number, d: number, u: number, yy: number, v: number, col: C) => (alongX ? k.box(w, h, d, u, yy, v, col) : k.box(d, h, w, v, yy, u, col));
    bx(len, 0.13, 0.06, c, y0, z, S1);
    bx(len + 0.01, 0.022, 0.07, c, y0 + 0.13, z, RED);
    bx(len, 0.03, 0.066, c, y0, z, '#c9bfa8');
    const n = Math.round(len / 0.12);
    for (let i = 0; i < n; i++) {
      const u = x0 + ((i + 0.5) * len) / n;
      bx(0.034, 0.045, 0.024, u, y0 + 0.152, z, S1);
      if (i % 2 === 0) {
        // serpent heads jutting from the outer face
        bx(0.05, 0.045, 0.05, u, y0 + 0.05, z + out * 0.05, '#d9cfb6');
        bx(0.052, 0.018, 0.03, u, y0 + 0.07, z + out * 0.085, '#d9cfb6');
        bx(0.04, 0.012, 0.008, u, y0 + 0.058, z + out * 0.1, RED);
      }
    }
  };
  wallSeg(-E, E, -E, true, -1);
  wallSeg(-E + 0.03, E - 0.03, E, false, 1);
  wallSeg(-E + 0.03, E - 0.03, -E, false, -1);
  wallSeg(-E, -0.66, E, true, 1);
  wallSeg(0.66, E, E, true, 1);
  for (const s of [-1, 1]) {
    k.box(0.1, 0.2, 0.1, s * 0.66, y0, E, S1);
    k.box(0.11, 0.025, 0.11, s * 0.66, y0 + 0.2, E, RED);
    banner(k, s * 0.66, y0 + 0.225, E, 0.36, COTTON, s < 0 ? BLUE : RED);
  }

  // the great platform, then four sloping bodies (talud) each capped by a vertical band over a shadow line
  const z0 = -0.28;
  k.box(2.36, 0.08, 1.98, 0, y0, z0, S2);
  k.box(2.37, 0.014, 1.99, 0, y0 + 0.066, z0, LINE);
  k.box(2.38, 0.02, 2.0, 0, y0 + 0.08, z0, S1);
  let y = y0 + 0.1;
  for (let i = 0; i < 4; i++) {
    const w = 2.16 - i * 0.27;
    const d = 1.82 - i * 0.25;
    talud(k, w, d, w - 0.1, d - 0.1, 0.26, 0, y, z0, i % 2 ? S2 : TAL);
    k.box(w - 0.094, 0.014, d - 0.094, 0, y + 0.26, z0, LINE);
    k.box(w - 0.05, 0.06, d - 0.05, 0, y + 0.274, z0, S1);
    y += 0.334;
  }
  const top = y;
  const topFront = z0 + (1.82 - 3 * 0.25 - 0.05) / 2;

  // twin stairways up the west face (+z), separated by a double balustrade
  const zB = 1.02;
  const zT = topFront - 0.02;
  const N = 22;
  const run = zB - zT;
  const rise = top - y0;
  for (const sx of [-0.31, 0.31])
    for (let s = 0; s < N; s++) {
      const zf = zB - (s * run) / N;
      k.box(0.4, (rise * (s + 1)) / N, run / N + 0.002, sx, y0, zf - run / N / 2, s % 2 ? '#ede7d9' : '#e5ddcc');
    }
  const ys = (z: number) => y0 + ((zB - z) / run) * rise;
  const zd = zB - run * 0.86;
  for (const [x0, x1, t] of [[-0.61, -0.51, 'tl'], [-0.11, 0.11, 'c'], [0.51, 0.61, 'hu']] as const) {
    const prof: [number, number][] = [
      [zB + 0.03, y0],
      [zB + 0.03, y0 + 0.11],
      [zd, ys(zd) + 0.07],
      [zd - 0.03, top + 0.12],
      [zT - 0.1, top + 0.12],
      [zT - 0.1, y0],
    ];
    prism(k, prof, x0, x1, '#d3c9b2');
    // the dado at the top, painted for its god
    const dc = t === 'tl' ? BLUE : t === 'hu' ? '#b3342a' : COTTON;
    k.box(x1 - x0 + 0.008, 0.04, zd - zT + 0.076, (x0 + x1) / 2, top + 0.09, (zd - 0.03 + zT - 0.1) / 2, dc);
  }
  // serpent heads at the foot of the balustrades
  serpentHead(k, -0.56, y0, zB + 0.04, RED, 1.5);
  serpentHead(k, 0.56, y0, zB + 0.04, RED, 1.5);
  serpentHead(k, -0.066, y0, zB + 0.04, RED, 1.1);
  serpentHead(k, 0.066, y0, zB + 0.04, RED, 1.1);
  // standard-bearers seated on the dados, holding paper banners
  for (const [bx, tl] of [[-0.56, true], [-0.05, true], [0.05, false], [0.56, false]] as const) {
    const by = top + 0.13;
    const bz = (zd + zT - 0.1) / 2 + 0.02;
    k.box(0.045, 0.05, 0.045, bx, by, bz, '#d9cfb6');
    k.sphere(0.022, bx, by + 0.07, bz + 0.005, '#cfc3a6', 1, 0);
    banner(k, bx + (bx < 0 ? -0.02 : 0.02), by, bz + 0.03, 0.3, COTTON, tl ? BLUE : RED);
  }
  // at the foot of Huitzilopochtli's stair, the great carved disc; at Tlaloc's, the frog altar
  k.cyl(0.13, 0.13, 0.014, 16, 0.31, y0, 1.33, '#d8c8a6');
  k.cyl(0.1, 0.1, 0.018, 16, 0.31, y0, 1.33, '#c4a57c');
  k.cyl(0.045, 0.045, 0.022, 10, 0.31, y0, 1.33, '#b37a52');
  k.box(0.22, 0.04, 0.1, -0.31, y0, 1.29, S1);
  for (const fx of [-0.06, 0.06]) {
    k.sphere(0.035, -0.31 + fx, y0 + 0.055, 1.29, '#5f9a7a', 0.7, 0);
    k.sphere(0.015, -0.31 + fx, y0 + 0.07, 1.32, '#5f9a7a', 1, 0);
  }
  // braziers along the platform front and on the summit
  for (const bx of [-0.95, -0.75, 0.75, 0.95]) brazier(k, bx, y0 + 0.1, z0 + 0.95, 1.1);

  // the summit: the twin shrines, braziers before their doors, Tlaloc's chacmool
  const sz = z0 - 0.18;
  const fz = sz + 0.43;
  shrineTop(k, -0.31, top, sz, true);
  shrineTop(k, 0.31, top, sz, false);
  for (const bx of [-0.52, -0.1, 0.1, 0.52]) brazier(k, bx, top, fz - 0.01, 0.9);
  // chacmool: a reclining figure holding a bowl on its belly
  {
    const cx = -0.31;
    const cz = fz;
    k.box(0.14, 0.022, 0.06, cx, top, cz, '#cfc3a6');
    k.box(0.05, 0.05, 0.05, cx - 0.05, top + 0.02, cz, '#cfc3a6');
    k.sphere(0.022, cx - 0.06, top + 0.085, cz + 0.004, '#cfc3a6', 1, 0);
    k.box(0.03, 0.04, 0.055, cx + 0.04, top + 0.02, cz, '#cfc3a6');
    k.cyl(0.02, 0.014, 0.012, 7, cx - 0.005, top + 0.044, cz, '#b0643a');
    k.box(0.02, 0.014, 0.056, cx + 0.04, top + 0.06, cz, BLUE);
  }
  // a round altar before Huitzilopochtli's door, heaped with marigolds
  k.cyl(0.05, 0.055, 0.05, 10, 0.31, top, fz, S1);
  k.cyl(0.056, 0.056, 0.012, 10, 0.31, top + 0.04, fz, '#b3342a');
  for (let i = 0; i < 4; i++) k.sphere(0.018, 0.31 + Math.cos(i * 1.6) * 0.022, top + 0.062, fz + Math.sin(i * 1.6) * 0.022, MARIGOLD[i % 3], 0.8, 0);

  // the round temple of Ehecatl-Quetzalcoatl in front, facing the pyramid (-z)
  {
    const ex = -1.02;
    const ez = 1.04;
    k.box(0.44, 0.14, 0.2, ex, y0, ez - 0.13, S1);
    k.cyl(0.22, 0.23, 0.14, 14, ex, y0, ez, S1);
    k.cyl(0.235, 0.235, 0.014, 14, ex, y0 + 0.1, ez, LINE);
    k.box(0.45, 0.014, 0.21, ex, y0 + 0.1, ez - 0.13, LINE);
    for (let s = 0; s < 4; s++) k.box(0.16, 0.14 - s * 0.035, 0.03, ex, y0, ez - 0.245 - s * 0.03, s % 2 ? '#f1ebde' : '#ece5d6');
    const yy = y0 + 0.14;
    k.cyl(0.13, 0.135, 0.15, 14, ex, yy, ez, COTTON);
    k.cyl(0.137, 0.137, 0.025, 14, ex, yy + 0.12, ez, RED);
    k.box(0.1, 0.11, 0.02, ex, yy, ez - 0.127, RED);
    k.box(0.065, 0.085, 0.02, ex, yy, ez - 0.132, DARK);
    k.cyl(0.02, 0.18, 0.2, 14, ex, yy + 0.145, ez, '#b8924e');
    k.cyl(0.182, 0.182, 0.018, 14, ex, yy + 0.145, ez, '#9a7a40');
    k.cyl(0.006, 0.02, 0.06, 5, ex, yy + 0.34, ez, '#9a7a40');
  }
  // a small red temple (Templo Rojo) on the other side
  {
    const rx = 1.02;
    const rz = 0.96;
    k.box(0.4, 0.1, 0.36, rx, y0, rz, '#a9493a');
    k.box(0.41, 0.014, 0.37, rx, y0 + 0.07, rz, COTTON);
    k.box(0.3, 0.08, 0.26, rx, y0 + 0.1, rz - 0.02, '#b3523f');
    k.box(0.31, 0.016, 0.27, rx, y0 + 0.16, rz - 0.02, YELLOW);
    k.box(0.31, 0.01, 0.27, rx, y0 + 0.176, rz - 0.02, BLUE);
    for (let s = 0; s < 4; s++) k.box(0.13, 0.18 - s * 0.045, 0.03, rx, y0, rz + 0.195 + s * 0.03, '#b85a46');
    k.box(0.16, 0.12, 0.14, rx, y0 + 0.18, rz - 0.04, COTTON);
    k.box(0.06, 0.08, 0.006, rx, y0 + 0.18, rz + 0.031, DARK);
    k.box(0.18, 0.025, 0.16, rx, y0 + 0.3, rz - 0.04, '#a9493a');
    brazier(k, rx - 0.14, y0 + 0.18, rz + 0.08, 0.6);
  }
}

/* ---------------------------------------------------------------- fields */

type Crop = 'maize' | 'amaranth' | 'beans' | 'flowers' | 'chili' | 'seedbed';

/** Crop rows on a bed w long (x) and d wide (z), centred at z, its soil top at y. Rows are broken
 *  into clumps of plants so they don't read as extruded bars. */
function crops(rng: Rng, out: Bed[], z: number, w: number, d: number, y: number, kind: Crop) {
  const g = (c: string) => jitter(c, rng, 0.012, 0.06, 0.06);
  if (kind === 'seedbed') {
    // chapines: the bed cut into little blocks, each sown with seedlings
    for (let i = 0; i < 4; i++)
      for (const dz of [-1, 1]) {
        const x = (i - 1.5) * (w / 4);
        out.push({ x, z: z + dz * d * 0.22, w: w / 4 - 0.03, d: d * 0.4, h: 0.025, y, color: g('#5a4632') });
        out.push({ x, z: z + dz * d * 0.22, w: w / 4 - 0.08, d: d * 0.24, h: 0.035, y, color: g('#7a9e48') });
      }
    return;
  }
  const rows = kind === 'maize' ? 2 : 3;
  const dd = (d - 0.06) / rows - 0.02;
  const clumps = kind === 'maize' ? 4 : 3;
  const cw = (w - 0.06) / clumps - 0.03;
  const cx = (j: number) => (j - (clumps - 1) / 2) * ((w - 0.06) / clumps) + (rng() - 0.5) * 0.02;
  for (let i = 0; i < rows; i++) {
    const zz = z + ((i + 0.5) / rows - 0.5) * (d - 0.06);
    if (kind === 'maize') {
      for (let j = 0; j < clumps; j++) {
        const h = 0.11 + rng() * 0.05;
        const x = cx(j);
        out.push({ x, z: zz, w: cw, d: dd, h, y, color: g(pick(rng, ['#5f8a34', '#6a9038', '#557f30'])) });
        out.push({ x, z: zz, w: cw * 0.8, d: dd * 0.4, h: 0.016, y: y + h, color: g('#c9b860') });
      }
    } else if (kind === 'amaranth') {
      out.push({ x: 0, z: zz, w: w - 0.06, d: dd, h: 0.06, y, color: g('#4f7a34') });
      for (let j = 0; j < clumps; j++) out.push({ x: cx(j), z: zz, w: cw, d: dd * 0.8, h: 0.035 + rng() * 0.02, y: y + 0.06, color: g(pick(rng, ['#8e3440', '#9a4a3a', '#7a2e3c'])) });
    } else if (kind === 'flowers') {
      if (i % 2) out.push({ x: 0, z: zz, w: w - 0.06, d: dd, h: 0.04, y, color: g('#4f7a34') });
      else for (let j = 0; j < clumps; j++) out.push({ x: cx(j), z: zz, w: cw, d: dd, h: 0.04 + rng() * 0.015, y, color: g(pick(rng, ['#d9821e', '#e09a2a', '#cc7020'])) });
    } else if (kind === 'chili') {
      for (let j = 0; j < clumps; j++) out.push({ x: cx(j), z: zz, w: cw, d: dd, h: 0.05 + rng() * 0.015, y, color: g('#4a7430') });
      out.push({ x: cx(1), z: zz, w: cw * 0.7, d: dd * 0.5, h: 0.012, y: y + 0.055, color: g('#b0382a') });
    } else {
      // beans among squash: a low, broad leafy row with yellow squash flowers
      out.push({ x: 0, z: zz, w: w - 0.06, d: dd + 0.01, h: 0.035, y, color: g('#4a7f36') });
      for (let j = 0; j < 2; j++) out.push({ x: (j - 0.5) * (w / 2.4) + (rng() - 0.5) * 0.08, z: zz, w: 0.04, d: 0.04, h: 0.01, y: y + 0.035, color: g('#d8aa30') });
    }
  }
}

/* ---------------------------------------------------------------- the style */

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
      // the eagle on the nopal, growing from a rock in the lake
      k.cyl(0.18, 0.26, 0.12, 7, 0, 0, 0, '#857a6a');
      k.sphere(0.1, 0.12, 0.06, 0.08, '#7a6e60', 0.6, 0);
      pad(k, 0, 0.24, 0, 1.3, 0.2, 0, '#5f8f46', 1);
      pad(k, 0.11, 0.42, 0.01, 1.05, 0.5, -0.5, '#6a9a4c', 1);
      pad(k, -0.1, 0.4, -0.01, 1.0, -0.3, 0.5, '#578a42', 1);
      for (const [x, y] of [[0.2, 0.52], [-0.18, 0.5], [0.04, 0.38]]) k.sphere(0.024, x, y, 0.02, '#c0305a', 1.2, 0);
      // the eagle, wings half open
      k.sphere(0.06, 0.02, 0.62, 0, '#4a3524', 1.3);
      k.sphere(0.035, 0.02, 0.72, 0.03, '#efe6d0');
      k.box(0.014, 0.012, 0.03, 0.02, 0.715, 0.065, '#e0b23a');
      k.tri({ x: 0.02, y: 0.64, z: 0 }, { x: -0.2, y: 0.78, z: -0.1 }, { x: -0.06, y: 0.6, z: 0 }, '#3e2c1e');
      k.tri({ x: 0.02, y: 0.64, z: 0 }, { x: 0.24, y: 0.8, z: -0.1 }, { x: 0.1, y: 0.6, z: 0 }, '#3e2c1e');
    },
  },
  house(k, c) {
    const r = c.rng;
    const nb = c.neighbours;
    const roll = r();
    if (nb <= 2 && roll < 0.5) jacal(k, r);
    else if (nb >= 4 && roll < 0.1 + (nb - 4) * 0.08) palace(k, r);
    else calli(k, r, nb, c.waterside && r() < 0.6);
  },
  field(rng, onWater) {
    const beds: Bed[] = [];
    if (onWater) {
      // chinampa: two long beds of lake mud built up in the shallows, a canal between, each in its own crop
      for (const z of [-0.24, 0.24]) {
        beds.push({ x: 0, z, w: 0.96, d: 0.38, h: 0.16, y: -0.1, color: jitter('#4f3f2c', rng, 0.01, 0.04, 0.04) });
        beds.push({ x: 0, z, w: 0.94, d: 0.34, h: 0.012, y: 0.06, color: jitter('#5e4a34', rng, 0.01, 0.04, 0.04) });
        crops(rng, beds, z, 0.9, 0.34, 0.072, pick(rng, ['maize', 'maize', 'amaranth', 'beans', 'flowers', 'chili', 'seedbed'] as const));
      }
      return beds;
    }
    // a milpa: ridged rows of maize with beans and squash
    for (const z of [-0.3, 0, 0.3]) {
      beds.push({ x: 0, z, w: 0.92, d: 0.24, h: 0.04, color: jitter('#7a6244', rng, 0.01, 0.04, 0.04) });
      crops(rng, beds, z, 0.88, 0.24, 0.04, pick(rng, ['maize', 'maize', 'maize', 'beans', 'amaranth'] as const));
    }
    return beds;
  },
  trees: { shore: ['tule', 'tule', 'ahuejote'], land: ['ahuehuete', 'maguey', 'maguey', 'nopal', 'magueyFlower', 'nopal'], hill: ['pine', 'pine', 'ahuehuete', 'maguey'], chinampa: 'ahuejote' },
  treeKits: TT,
  bridge(k, j, n) {
    // a removable timber bridge: planks across two stringers, posts at the banks
    const base = 0.24;
    const A = -0.5 - j - 0.18;
    const B = n - j - 0.5 + 0.18;
    const a = j === 0 ? A : -0.5;
    const b = j === n - 1 ? B : 0.5;
    const rise = 0.035 * (1 + (n - 1) * 0.3);
    const y = (x: number) => base + rise * Math.sin((Math.PI * (x - A)) / (B - A));
    const slope = (x: number) => Math.atan(((rise * Math.PI) / (B - A)) * Math.cos((Math.PI * (x - A)) / (B - A)));
    const f = F0;
    const SEG = 3;
    for (let i = 0; i < SEG; i++) {
      const x0 = a + ((b - a) * i) / SEG;
      const x1 = a + ((b - a) * (i + 1)) / SEG;
      const len = Math.hypot(x1 - x0, y(x1) - y(x0)) + 0.01;
      for (const s of [-0.12, 0.12]) tbox(k, f, len, 0.04, 0.04, (x0 + x1) / 2, (y(x0) + y(x1)) / 2 - 0.03, s, '#5a3d26', 0, 0, Math.atan2(y(x1) - y(x0), x1 - x0));
    }
    const np = Math.round((b - a) / 0.07);
    for (let i = 0; i < np; i++) {
      const x = a + ((i + 0.5) * (b - a)) / np;
      tbox(k, f, 0.058, 0.022, 0.34 + ((i * 7) % 3) * 0.012, x, y(x) + 0.004, ((i * 5) % 3) * 0.006 - 0.006, i % 3 === 0 ? '#7f5d3c' : i % 3 === 1 ? '#75553a' : '#866443', 0, 0, slope(x));
    }
    for (const [x, end] of [[A + 0.06, j === 0], [B - 0.06, j === n - 1]] as const)
      if (end) for (const s of [-0.15, 0.15]) k.cyl(0.018, 0.022, base + 0.16, 5, x, -0.06, s, '#5a3d26');
  },
  boat(k, rng) {
    // an acalli: a dugout with a kneeling paddler or a standing poler, often laden for the market
    const f = F0;
    const L = 0.66 + rng() * 0.12;
    canoe(k, f, 0, 0, 0, 0, L, rng);
    const standing = rng() < 0.4;
    const cloth = pick(rng, [COTTON, COTTON, '#e6dcc4', '#d8c9a6', RED, BLUE]);
    const px = -L * 0.32;
    figure(k, f, px, -0.01, 0, rng, standing, cloth);
    if (standing) tbox(k, f, 0.01, 0.62, 0.01, px + 0.06, 0.1, 0.05, '#7a5a3a', -0.2, 0, -0.45);
    else {
      tbox(k, f, 0.008, 0.2, 0.008, px + 0.02, 0.06, 0.07, '#7a5a3a', -0.5, 0, 0.35);
      tbox(k, f, 0.006, 0.07, 0.03, px + 0.06, -0.035, 0.12, '#7a5a3a', -0.5, 0, 0.35);
    }
    const cargo = rng();
    const cx = L * 0.08;
    if (cargo < 0.2) {
      // maize ears heaped up
      for (let i = 0; i < 6; i++) tbox(k, f, 0.06, 0.022, 0.022, cx + (i % 3) * 0.05 - 0.05, 0.03 + Math.floor(i / 3) * 0.02, (i % 2 ? 0.02 : -0.02), pick(rng, ['#e0b23a', '#d9a62e', '#c8902a', '#efe0a0']), 0, rng(), 0);
    } else if (cargo < 0.38) {
      pots(k, frame(cx, 0, 0.0), 0, 0, rng, 3);
    } else if (cargo < 0.54) {
      // bundles of reeds for mats
      for (let i = 0; i < 3; i++) place(k, f, new THREE.CylinderGeometry(0.022, 0.022, 0.26, 6), cx, 0.035 + (i === 2 ? 0.035 : 0), i === 2 ? 0 : (i - 0.5) * 0.045, '#b5a660', 0, 0, Math.PI / 2);
    } else if (cargo < 0.68) {
      // flowers for the market
      for (let i = 0; i < 7; i++) k.sphere(0.024, cx + (i % 4) * 0.04 - 0.06, 0.035 + (i > 3 ? 0.02 : 0), (i % 2 ? 0.022 : -0.022), pick(rng, [...MARIGOLD, '#c8456a']), 0.8, 0);
    } else if (cargo < 0.8) {
      // building stone: tezontle blocks
      for (let i = 0; i < 3; i++) k.box(0.06, 0.04, 0.06, cx + (i - 1) * 0.065, 0.0, 0, jitter(TEZONTLE, rng));
    } else if (cargo < 0.9) {
      // a passenger under a cotton shade
      figure(k, f, cx + 0.04, -0.01, 0, rng, false, pick(rng, [BLUE, RED, '#e0b23a']));
      for (const sx of [-0.06, 0.12]) for (const sz of [-0.05, 0.05]) k.box(0.008, 0.16, 0.008, cx + sx, 0.0, sz, WOOD);
      k.box(0.22, 0.008, 0.12, cx + 0.03, 0.16, 0, COTTON);
    } else {
      k.box(0.12, 0.05, 0.07, cx, 0.0, 0, COTTON);
      k.box(0.008, 0.052, 0.072, cx, 0.0, 0, '#a08860');
    }
  },
  buildLandmark(k) {
    templo(k);
  },
  backdrop(k, rng) {
    mountains(k, rng, { count: 22, r0: 95, r1: 140, h0: 6, h1: 14, color: '#7f94a6' });
    // Popocatépetl, a smoking cone, and Iztaccíhuatl's long snowy ridge to the south-east
    k.cyl(1.2, 34, 28, 9, 70, -0.5, 95, '#8a9db2');
    k.cyl(0, 11, 9, 9, 70, 18.5, 95, '#f4f6f8');
    k.sphere(2.2, 70.5, 28.5, 95, '#e8ecef', 1.4, 0);
    for (const [x, z, h, r] of [[22, 112, 20, 30], [36, 106, 22, 26], [48, 101, 18, 24]] as const) {
      k.cyl(2, r, h, 9, x, -0.5, z, '#8799ae');
      k.cyl(1, r * 0.36, h * 0.3, 9, x, h * 0.7 - 0.5, z, '#f0f3f6');
    }
    mountains(k, rng, { count: 10, r0: 60, r1: 80, h0: 2, h1: 5, color: '#8fa17a', arc: [Math.PI * 0.75, Math.PI * 1.3] });
  },
  notes: [392, 440, 523.25, 587.33, 659.25, 784],
  bonus: { label: { en: 'Chinampas feed the city', zh: '浮田养城' }, test: (s) => s.chinampas >= 12 },
  bird: '#f4f1ea',
  smoke: 0.16,
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#9aa456', '#b3b064'), density: 1.4, scale: [0.8, 1.3] },
    { zone: 'grass', kit: SCATTER.flowers('#5d8a3a', MARIGOLD), density: 0.35 },
    { zone: 'grass', kit: SCATTER.flowers('#5d8a3a', ['#c8456a', '#d86a8a', '#f2f0e8']), density: 0.1 },
    { zone: 'grass', kit: MINI.maguey, density: 0.18, scale: [0.8, 1.4] },
    { zone: 'grass', kit: MINI.nopal, density: 0.08, scale: [0.8, 1.3] },
    { zone: 'hill', kit: MINI.maguey, density: 0.3, scale: [0.9, 1.6] },
    { zone: 'hill', kit: SCATTER.stones('#8a7e6c', '#6d6458'), density: 0.3 },
    { zone: 'shore', kit: SCATTER.stones('#9a8e7c', '#7d7262'), density: 0.2 },
    { zone: 'shore', kit: MINI.reeds, density: 0.6, scale: [0.8, 1.4] },
    { zone: 'shallows', kit: SCATTER.lily('#5f8f4a', '#f3dd6a'), density: 0.12, float: true },
    { zone: 'shallows', kit: MINI.reeds, density: 0.1, scale: [1, 1.6] },
  ],
  paving: { kind: 'stucco', color: '#d8cbae', joint: '#b9a989' },
  // mostly undyed cotton and maguey fibre; coloured mantles for the few
  people: { clothes: ['#efe9dc', '#e9e1cd', '#efe9dc', '#d8c9a6', '#e6dcc4', '#c8452f', '#2f8fa0', '#e0b23a'], skin: '#9a6a48' },
  clouds: { color: '#ffffff', shade: '#c9d6e6', shadow: 0.3 },
};
