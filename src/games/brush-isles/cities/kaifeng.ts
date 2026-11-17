import * as THREE from 'three';
import { type Kit, type Rng, jitter, loft, pick } from '../kit';
import { TREES, mountains, plinth, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Bianjing (Kaifeng), c. 1100 */

// Everything here is modelled after the streets of Zhang Zeduan's scroll Along the River During the
// Qingming Festival: grey-tiled timber halls with white plaster between red-brown posts, two-storey
// shops with balconies, the great wine houses behind their decorated gateways, tea sheds under mat
// awnings, warehouses and grain barges on the Bian canal, and the woven timber arch of the Rainbow
// Bridge crowded with stalls.

type Col = THREE.ColorRepresentation;
const { lerp } = THREE.MathUtils;
const PI = Math.PI;
const UP = new THREE.Vector3(0, 1, 0);
const ONE = new THREE.Vector3(1, 1, 1);
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const shade = (c: Col, f: number) => new THREE.Color(c).multiplyScalar(f);

const TILE = ['#5a6068', '#636970', '#545a62', '#666868', '#5d636a'];
const PLASTER = ['#ece7da', '#e8e1d0', '#efe9dd', '#e4ddcb'];
const TIMBER = ['#7e3427', '#8a3f2a', '#6e3a26', '#7a4a32', '#6a4a36'];
const DARK = '#2a211b';
const STONE = '#a8a296';
const STONE2 = '#8f8a7f';
const MAT = ['#b8a67a', '#a8946a', '#c2b084'];
const POLE = '#5a3d2a';
const SKIN = '#d8b08a';
const CLOTHES = ['#3b4a63', '#7a5a3a', '#e8e2d2', '#5a6e5a', '#9a3a2e', '#d9cfb8', '#5e6a78', '#c9bfa6'];
const GOODS = ['#d9a23a', '#c8503a', '#7a9a4a', '#e8dcc0', '#3f5f8a', '#b8402e', '#8a6a3a'];
const IRON = ['#5e4232', '#664836', '#5a3f30'];
const BRONZE = '#7d6a3e';
const GOLD = '#c9a24a';

/**
 * A pen over the kit: the same primitives, drawn through a transform, so a wing, a boat cabin or a
 * pagoda niche can be modelled in its own frame (local +z is always its front).
 */
class Pen {
  constructor(
    readonly k: Kit,
    readonly m = new THREE.Matrix4(),
  ) {}
  at(x: number, y: number, z: number, ry = 0) {
    const t = new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromAxisAngle(UP, ry), ONE);
    return new Pen(this.k, this.m.clone().multiply(t));
  }
  add(g: THREE.BufferGeometry, c: Col) {
    this.k.add(g, c, this.m);
    return this;
  }
  /** Box standing on y. */
  box(w: number, h: number, d: number, x: number, y: number, z: number, c: Col, ry = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, c);
  }
  /** Box centred on (x, y, z), turned by Euler angles. */
  obox(w: number, h: number, d: number, x: number, y: number, z: number, c: Col, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.applyMatrix4(new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), ONE));
    return this.add(g, c);
  }
  /** An upright flat panel (two triangles) facing +z, turned ry, its base at y. */
  quad(w: number, h: number, x: number, y: number, z: number, c: Col, ry = 0) {
    const g = new THREE.PlaneGeometry(w, h);
    g.translate(0, h / 2, 0);
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, c);
  }
  cyl(rt: number, rb: number, h: number, seg: number, x: number, y: number, z: number, c: Col, ry = 0, open = false) {
    const g = new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
    g.translate(0, h / 2, 0);
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, c);
  }
  sphere(r: number, x: number, y: number, z: number, c: Col, sy = 1, detail = 1) {
    const g = new THREE.IcosahedronGeometry(r, detail);
    g.scale(1, sy, 1);
    g.translate(x, y, z);
    return this.add(g, c);
  }
  /** A square timber from a to b. */
  beam(a: THREE.Vector3, b: THREE.Vector3, t: number, c: Col) {
    const dir = b.clone().sub(a);
    const g = new THREE.BoxGeometry(t, dir.length(), t);
    g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()), ONE));
    return this.add(g, c);
  }
  tri(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, col: Col) {
    return this.tris([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], col);
  }
  tris(pos: number[], c: Col) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return this.add(g, c);
  }
}

/** An upright band hanging from (h < 0) or standing on (h > 0) a polyline: ridges, barge boards. */
function ribbon(p: Pen, pts: THREE.Vector3[], h: number, c: Col, off = V(0, 0, 0)) {
  const pos: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i].clone().add(off);
    const b = pts[i + 1].clone().add(off);
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, b.x, b.y + h, b.z, a.x, a.y, a.z, b.x, b.y + h, b.z, a.x, a.y + h, a.z);
  }
  p.tris(pos, c);
}

function fan(p: Pen, o: THREE.Vector3, pts: THREE.Vector3[], c: Col) {
  const pos: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) pos.push(o.x, o.y, o.z, pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
  p.tris(pos, c);
}

/** A little two-slope cap (wall copings, gate roofs), ridge along x. */
function cap(p: Pen, w: number, d: number, rh: number, x: number, y: number, z: number, c: Col, ry = 0) {
  const hw = w / 2;
  const hd = d / 2;
  const pos = [
    ...[-hw, 0, hd, hw, 0, hd, hw, rh, 0, -hw, 0, hd, hw, rh, 0, -hw, rh, 0],
    ...[hw, 0, -hd, -hw, 0, -hd, -hw, rh, 0, hw, 0, -hd, -hw, rh, 0, hw, rh, 0],
    ...[-hw, 0, -hd, -hw, 0, hd, -hw, rh, 0, hw, 0, hd, hw, 0, -hd, hw, rh, 0],
  ];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  p.add(g, c);
}

/** The fish-tail ornament (鸱吻) rising from each end of a main ridge, curling inward. */
function chiwen(p: Pen, x: number, y: number, s: number, c: Col, k = 1) {
  p.obox(0.03 * k, 0.07 * k, 0.026 * k, x, y + 0.03 * k, 0, c, 0, 0, s * 0.22);
  p.obox(0.018 * k, 0.04 * k, 0.024 * k, x - s * 0.022 * k, y + 0.07 * k, 0, c, 0, 0, s * 0.9);
}

/* ---------------------------------------------------------------- roofs */

interface RoofO {
  /** 庑殿 hipped, 歇山 hip-and-gable, or 悬山 overhanging gable. */
  kind: 'hip' | 'xie' | 'gable';
  /** The walls it covers (width along x, depth along z), the height of their top, and their centre. */
  ww: number;
  wd: number;
  top: number;
  x?: number;
  z?: number;
  /** Eave overhang past the walls, rise, concave sweep (k > 1) and lift of the corners. */
  ov: number;
  rh: number;
  k?: number;
  lift?: number;
  color: Col;
  /** Infill of the gable triangles. */
  ends?: Col;
  chiwen?: boolean;
  /** Skip the main ridge (a pent roof whose top is hidden under the floor above). */
  bare?: boolean;
  seg?: number;
}

/**
 * A curved Song roof of grey tile: the swept slopes, a darker course of tile ends and a fascia at the
 * eaves, raised hip and barge ridges, and the main ridge with its ornaments. The eave height is set so
 * the underside meets the top of the walls.
 */
function roof(p: Pen, o: RoofO): THREE.Vector3 {
  const kk = o.k ?? 1.8;
  const lift = o.lift ?? 0.05;
  const M = o.seg ?? 4;
  const gable = o.kind === 'gable';
  const hw = o.ww / 2 + (gable ? Math.min(o.ov, 0.07) : o.ov);
  const hd = o.wd / 2 + o.ov;
  const yAt = (t: number) => o.rh * Math.pow(t, kk);
  const zAt = (t: number) => Math.max(hd * (1 - t), 0.0006);
  const y0 = o.top - yAt(o.ov / hd) + 0.004;
  const q = p.at(o.x ?? 0, y0, o.z ?? 0);
  const edge = shade(o.color, 0.8);
  const dark = shade(o.color, 0.5);
  const ridgeC = shade(o.color, 0.66);
  const shell = (rings: THREE.Vector3[][], close: boolean) => {
    q.add(loft([rings[0].map((v) => V(v.x, v.y - 0.022, v.z)), rings[0]], close), dark);
    q.add(loft(rings.slice(0, 2), close), edge);
    q.add(loft(rings.slice(1), close), o.color);
  };
  let xr: number;
  if (gable) {
    const xs = [-1, -0.5, 0, 0.5, 1];
    const ts = [0, 0.07, 0.3, 0.62, 1];
    const up = (t: number, u: number) => lift * Math.pow(1 - t, 2) * Math.pow(Math.abs(u), 3);
    const front = ts.map((t) => xs.map((u) => V(u * hw, yAt(t) + up(t, u), zAt(t))));
    const back = ts.map((t) => xs.map((u) => V(-u * hw, yAt(t) + up(t, u), -zAt(t))));
    shell(front, false);
    shell(back, false);
    for (const rows of [front, back]) for (const e of [0, xs.length - 1]) ribbon(q, rows.map((r) => r[e]), -0.028, dark);
    if (o.ends)
      for (const s of [-1, 1]) {
        const x = (s * o.ww) / 2;
        const u = o.ww / 2 / hw;
        const tw = o.ov / hd;
        const tsE = [tw, lerp(tw, 1, 0.3), lerp(tw, 1, 0.55), lerp(tw, 1, 0.8), 1];
        const pt = (t: number, sz: number) => V(x, yAt(t) + up(t, u) - 0.006, sz * zAt(t));
        fan(q, V(x, yAt(tw) - 0.004, 0), [...tsE.map((t) => pt(t, 1)), ...tsE.slice(0, -1).reverse().map((t) => pt(t, -1))], o.ends);
        // the hanging-fish board under the ridge end (悬鱼)
        q.box(0.014, 0.05, 0.022, x + s * 0.008, o.rh - 0.075, 0, dark);
      }
    xr = hw - 0.03;
  } else {
    const xie = o.kind === 'xie';
    const ts = xie ? [0, 0.07, 0.26, 0.5] : o.bare ? [0, 0.07, 0.28, 0.52] : [0, 0.07, 0.28, 0.52, 0.76, 1];
    const lt = (t: number) => lift * Math.pow(1 - t, 2.2);
    const rings = ts.map((t) => {
      const ax = Math.max(hw - t * hd, 0.0006);
      const az = zAt(t);
      const c = [
        [-ax, az],
        [ax, az],
        [ax, -az],
        [-ax, -az],
      ];
      const ring: THREE.Vector3[] = [];
      for (let s = 0; s < 4; s++)
        for (let m = 0; m < M; m++) {
          const u = m / M;
          const e = Math.abs(u * 2 - 1);
          const [x0, z0] = c[s];
          const [x1, z1] = c[(s + 1) % 4];
          ring.push(V(lerp(x0, x1, u), yAt(t) + lt(t) * e * e * e, lerp(z0, z1, u)));
        }
      return ring;
    });
    shell(rings, true);
    for (let s = 0; s < 4; s++) ribbon(q, rings.map((r) => r[s * M]), 0.02, ridgeC);
    xr = Math.max(hw - (xie ? 0.5 : 1) * hd, 0);
    if (xie) {
      const tg = [0.5, 0.75, 1];
      // the upper slopes carry on the sag of the hipped skirt's top edge, so the two meet without a gap
      const us = Array.from({ length: M + 1 }, (_, m) => m / M);
      const row = (t: number, sz: number) => us.map((u) => V(sz * lerp(-xr, xr, u), yAt(t) + lt(t) * Math.pow(Math.abs(u * 2 - 1), 3), sz * zAt(t)));
      const front = tg.map((t) => row(t, 1));
      const back = tg.map((t) => row(t, -1));
      q.add(loft(front, false), o.color);
      q.add(loft(back, false), o.color);
      for (const s of [-1, 1]) {
        const x = s * (xr - 0.012);
        const tsE = [0.5, 0.62, 0.75, 0.88, 1];
        const pt = (t: number, sz: number) => V(x, yAt(t) + lt(t) - 0.004, sz * zAt(t));
        fan(q, V(x, yAt(0.5) + lt(0.5), 0), [...tsE.map((t) => pt(t, 1)), ...tsE.slice(0, -1).reverse().map((t) => pt(t, -1))], o.ends ?? edge);
        q.box(0.012, 0.045, 0.02, s * (xr - 0.004), o.rh - 0.065, 0, dark);
        for (const sz of [-1, 1]) ribbon(q, tg.map((t) => V(s * xr, yAt(t) + lt(t), sz * zAt(t))), 0.02, ridgeC);
      }
    }
  }
  const ridgeTop = V(o.x ?? 0, y0 + o.rh, o.z ?? 0);
  if (o.bare) return ridgeTop;
  if (xr > 0.02) {
    q.box(2 * xr + 0.03, 0.03, 0.03, 0, o.rh - 0.012, 0, ridgeC);
    // ornaments in proportion: modest on a pavilion, bold on a great hall
    const sc = THREE.MathUtils.clamp(o.ww / 0.75, 0.5, 1.2);
    if (o.chiwen) for (const s of [-1, 1]) chiwen(q, s * (xr + 0.012), o.rh, s, ridgeC, sc);
  } else {
    // a pyramid roof ends in a finial (宝顶)
    q.cyl(0, 0.03, 0.06, 6, 0, o.rh - 0.012, 0, ridgeC);
    q.sphere(0.022, 0, o.rh + 0.05, 0, ridgeC, 1, 0);
  }
  return ridgeTop;
}

/** Hearth smoke rises from the back slope, a little off the middle of the ridge. */
const smokeAt = (p: Pen, top: THREE.Vector3, dx = 0.1) => p.k.mark('smoke', top.x + dx, top.y - 0.03, top.z - 0.06);

/* ---------------------------------------------------------------- walls, posts, windows */

const lattice = (q: Pen, w: number, h: number, wood: Col) => {
  // a window of upright bars (直棂窗), dark behind
  q.quad(w, h, 0, 0, 0, DARK);
  const n = Math.max(3, Math.round(w / 0.03));
  for (let i = 1; i < n; i++) q.quad(0.007, h, -w / 2 + (i * w) / n, 0, 0.002, wood);
  q.quad(w + 0.016, 0.014, 0, -0.012, 0.002, wood);
  q.quad(w + 0.016, 0.014, 0, h - 0.002, 0.002, wood);
};

type Bay = 'door' | 'gate' | 'win' | 'high' | 'blind' | 'open' | 'wall';

function bay(q: Pen, kind: Bay, w: number, h: number, wood: Col) {
  switch (kind) {
    case 'door':
      q.quad(w * 0.6, h * 0.8, 0, 0, 0, DARK);
      for (const s of [-1, 1]) q.quad(w * 0.17, h * 0.8, s * w * 0.22, 0, 0.002, wood);
      q.quad(w * 0.7, 0.02, 0, h * 0.8, 0.002, wood);
      break;
    case 'gate':
      // a wide opening, its two leaves swung open against the street
      q.quad(w * 0.9, h * 0.86, 0, 0, 0, DARK);
      for (const s of [-1, 1]) q.quad(w * 0.4, h * 0.84, s * w * 0.45, 0, w * 0.2, wood, PI / 2);
      break;
    case 'win':
      lattice(q.at(0, h * 0.36, 0), w * 0.78, h * 0.4, wood);
      q.quad(w, 0.016, 0, h * 0.3, 0.001, wood);
      break;
    case 'high':
      lattice(q.at(0, h * 0.6, 0), w * 0.5, h * 0.18, wood);
      break;
    case 'blind':
      // an open window with a bamboo blind half let down
      q.quad(w * 0.82, h * 0.46, 0, h * 0.32, 0, DARK);
      q.quad(w * 0.82, h * 0.25, 0, h * 0.53, 0.002, '#b39a62');
      q.quad(w, 0.016, 0, h * 0.3, 0.001, wood);
      break;
    case 'open':
      q.quad(w + 0.008, h * 0.9, 0, 0, 0, DARK);
      break;
    default:
      q.quad(w, 0.016, 0, h * 0.3, 0.001, wood);
  }
}

interface StoreyO {
  w: number;
  d: number;
  h: number;
  y: number;
  z?: number;
  wall: Col;
  wood: Col;
  bays: Bay[];
  /** Depth of an open colonnade along the front (the wall stands back behind the posts). */
  porch?: number;
  sideWin?: boolean;
}

/** One storey of a timber hall: plaster walls, red-brown posts and lintel, and its front bays. */
function storey(p: Pen, o: StoreyO) {
  const z = o.z ?? 0;
  const P = o.porch ?? 0;
  const n = o.bays.length;
  const cw = 0.036;
  p.box(o.w, o.h, o.d - P, 0, o.y, z - P / 2, o.wall);
  const face = z + o.d / 2 - P + 0.003;
  const cz = z + o.d / 2 - cw / 2 + (P ? -0.004 : 0.004);
  for (let i = 0; i <= n; i++) p.box(cw, o.h, cw, -o.w / 2 + (i * o.w) / n, o.y, cz, o.wood);
  for (const sx of [-1, 1]) p.box(cw, o.h, cw, (sx * o.w) / 2, o.y, z - o.d / 2 + cw / 2 - 0.004, o.wood);
  p.box(o.w + cw, 0.03, cw + 0.008, 0, o.y + o.h - 0.03, cz, o.wood);
  for (const sx of [-1, 1]) p.quad(o.d - P, 0.03, sx * (o.w / 2 + 0.003), o.y + o.h - 0.03, z - P / 2, o.wood, (sx * PI) / 2);
  const bw = o.w / n;
  for (let i = 0; i < n; i++) bay(p.at(-o.w / 2 + bw * (i + 0.5), o.y, face), o.bays[i], bw - cw - 0.012, o.h, o.wood);
  if (o.sideWin) for (const sx of [-1, 1]) lattice(p.at(sx * (o.w / 2 + 0.003), o.y + o.h * 0.4, z - P / 2, (sx * PI) / 2), Math.min(0.14, (o.d - P) * 0.4), o.h * 0.34, o.wood);
}

/** Bracket sets (斗栱) along the front, just under the eaves. */
function brackets(p: Pen, w: number, n: number, y: number, z: number, c: Col) {
  for (let i = 0; i <= n; i++) p.box(i % 2 ? 0.03 : 0.042, 0.032, 0.05, -w / 2 + (i * w) / n, y, z, c);
}

function railing(p: Pen, x0: number, z0: number, x1: number, z1: number, y: number, h: number, n: number, c: Col) {
  for (let i = 0; i <= n; i++) p.cyl(0.009, 0.009, h, 3, lerp(x0, x1, i / n), y, lerp(z0, z1, i / n), c, 0, true);
  for (const yy of [y + h - 0.008, y + h * 0.4]) p.beam(V(x0, yy, z0), V(x1, yy, z1), 0.012, c);
}

/** A straight length of plastered wall with a tiled coping. */
function wallRun(p: Pen, x0: number, z0: number, x1: number, z1: number, h: number, wall: Col, tile: Col, t = 0.04) {
  const len = Math.hypot(x1 - x0, z1 - z0);
  if (len < 0.03) return;
  const ry = Math.atan2(-(z1 - z0), x1 - x0);
  p.box(len, h, t, (x0 + x1) / 2, 0, (z0 + z1) / 2, wall, ry);
  cap(p, len + 0.02, t + 0.05, 0.03, (x0 + x1) / 2, h, (z0 + z1) / 2, tile, ry);
}

/* ---------------------------------------------------------------- street things */

function figure(p: Pen, x: number, y: number, z: number, cloth: Col, hat = false) {
  p.cyl(0.013, 0.026, 0.09, 5, x, y, z, cloth);
  p.sphere(0.017, x, y + 0.105, z, SKIN, 1, 0);
  if (hat) p.cyl(0.002, 0.036, 0.02, 6, x, y + 0.11, z, '#c2a66c');
  else p.sphere(0.011, x, y + 0.124, z, '#2a2420', 1, 0);
}

function lantern(p: Pen, x: number, y: number, z: number, c: Col = '#c8402a') {
  p.quad(0.004, 0.035, x, y - 0.035, z, '#3a2a20');
  p.sphere(0.026, x, y - 0.062, z, c, 1.25, 0);
}

function parasol(p: Pen, x: number, y: number, z: number, h: number, rad: number, c: Col, tilt = 0) {
  p.cyl(0.005, 0.005, h, 3, x, y, z, POLE);
  const g = new THREE.ConeGeometry(rad, rad * 0.36, 8, 1, true);
  g.applyMatrix4(new THREE.Matrix4().compose(V(x, y + h, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, 0, tilt * 0.6)), ONE));
  p.add(g, c);
}

/** A trestle of goods under a big cloth umbrella, as along every street of the scroll. */
function stall(p: Pen, r: Rng, x: number, z: number, y = 0) {
  p.box(0.15, 0.06, 0.08, x, y, z, '#7a5a3c');
  for (let i = 0; i < 3; i++) p.sphere(0.018, x - 0.045 + i * 0.045, y + 0.072, z, pick(r, GOODS), 0.8, 0);
  parasol(p, x, y, z - 0.02, 0.24, 0.125, pick(r, ['#ece4d0', '#e2d6b8', '#d8c8a0']), (r() - 0.5) * 0.3);
}

/** The one-wheeled barrow that carried half the city's goods. */
function barrow(p: Pen, r: Rng, x: number, z: number, ry: number) {
  const q = p.at(x, 0, z, ry);
  const wheel = new THREE.CylinderGeometry(0.04, 0.04, 0.014, 8);
  wheel.rotateX(PI / 2);
  wheel.translate(0.07, 0.04, 0);
  q.add(wheel, '#4a3628');
  q.box(0.17, 0.018, 0.07, 0, 0.05, 0, '#7a5a3c');
  q.box(0.012, 0.05, 0.06, -0.06, 0, 0, '#6a4a30');
  for (const s of [-1, 1]) q.beam(V(-0.07, 0.06, s * 0.03), V(-0.16, 0.075, s * 0.035), 0.012, '#6a4a30');
  q.sphere(0.042, -0.005, 0.1, 0, pick(r, ['#cdb98e', '#b8a47a', '#d8c8a0']), 0.7, 0);
}

function jars(p: Pen, r: Rng, x: number, z: number) {
  const n = 2 + Math.floor(r() * 2);
  for (let i = 0; i < n; i++) {
    const jx = x + (i - (n - 1) / 2) * 0.07;
    const jz = z + (i % 2) * 0.03;
    p.sphere(0.034, jx, 0.035, jz, '#4f4034', 1.1, 0);
    p.cyl(0.014, 0.018, 0.02, 5, jx, 0.07, jz, '#4f4034');
    p.sphere(0.014, jx, 0.092, jz, '#b8402e', 0.6, 0);
  }
}

function sacks(p: Pen, r: Rng, x: number, z: number, n: number) {
  for (let i = 0; i < n; i++) {
    const row = i < 3 ? 0 : 1;
    p.sphere(0.042, x + ((i % 3) - 1) * 0.075 + row * 0.035, 0.03 + row * 0.05, z + (r() - 0.5) * 0.03, jitter('#cdb98e', r, 0.01, 0.06, 0.08), 0.7, 0);
  }
}

/** Street life in the strip in front of a building: a stall, a barrow, wine jars, or nothing. */
function streetProps(p: Pen, r: Rng, z: number, slots: number[]) {
  for (const x of slots) {
    const t = r();
    if (t < 0.3) stall(p, r, x, z);
    else if (t < 0.45) barrow(p, r, x, z, (r() - 0.5) * 1.2);
    else if (t < 0.58) jars(p, r, x, z);
  }
}

/** A wine-shop banner (酒旗) on a tall pole, hung from an arm over the street. */
function wineFlag(p: Pen, r: Rng, side: number, z: number, h: number) {
  const x = side * 0.43;
  p.cyl(0.009, 0.013, h, 4, x, 0, z, POLE);
  p.box(0.17, 0.012, 0.012, x - side * 0.075, h - 0.04, z, POLE);
  const bx = x - side * 0.1;
  p.quad(0.085, 0.3, bx, h - 0.35, z, pick(r, ['#ece4d0', '#e8dcc0', '#f0e8d8']));
  p.quad(0.087, 0.035, bx, h - 0.085, z + 0.002, '#3f5f8a');
  p.quad(0.087, 0.035, bx, h - 0.085, z - 0.002, '#3f5f8a', PI);
  for (let i = 0; i < 2; i++) for (const s of [1, -1]) p.quad(0.03, 0.03, bx, h - 0.16 - i * 0.07, z + s * 0.002, '#2a2a30', s > 0 ? 0 : PI);
}

/** An upright shop sign (竖招) standing in the street, turned to be read by passers-by. */
function signboard(p: Pen, r: Rng, x: number, z: number) {
  const q = p.at(x, 0, z, PI / 2);
  q.box(0.08, 0.02, 0.03, 0, 0, 0, POLE);
  q.quad(0.06, 0.2, 0, 0.02, 0, pick(r, ['#efe8d8', '#e8e0cc', '#2e2a26']));
  for (let i = 0; i < 3; i++) for (const s of [1, -1]) q.quad(0.026, 0.026, 0, 0.16 - i * 0.055, s * 0.002, i === 0 ? '#b8402e' : '#2a2a30', s > 0 ? 0 : PI);
  cap(q, 0.09, 0.04, 0.025, 0, 0.22, 0, '#3d4248');
}

/** A horizontal name board (匾) over a door. */
function plaque(p: Pen, x: number, y: number, z: number) {
  p.quad(0.2, 0.05, x, y, z, '#2e2a26');
  for (let i = 0; i < 3; i++) p.quad(0.03, 0.026, x - 0.055 + i * 0.055, y + 0.012, z + 0.002, GOLD);
}

/* ---------------------------------------------------------------- houses */

const tileC = (r: Rng) => jitter(pick(r, TILE), r, 0.01, 0.03, 0.05);
const plasterC = (r: Rng) => jitter(pick(r, PLASTER), r, 0.01, 0.03, 0.03);

/** A courtyard dwelling: a hall at the back, a wing, a walled yard and a gatehouse. */
function dwelling(p: Pen, r: Rng) {
  const wall = plasterC(r);
  const wood = pick(r, TIMBER);
  const tile = tileC(r);
  plinth(p.k, 0.92, 0.92, STONE2);
  p.box(0.92, 0.025, 0.92, 0, 0, 0, '#c8b894');
  const hw = 0.7 + r() * 0.12;
  const hd = 0.32;
  const hh = 0.24 + r() * 0.04;
  const hz = -0.42 + hd / 2 + 0.03;
  p.box(hw + 0.05, 0.04, hd + 0.05, 0, 0.02, hz, STONE);
  storey(p, { w: hw, d: hd, h: hh, y: 0.06, z: hz, wall, wood, bays: ['win', 'door', 'win'] });
  smokeAt(p, roof(p, { kind: r() < 0.7 ? 'gable' : 'xie', ww: hw, wd: hd, top: 0.06 + hh, z: hz, ov: 0.1, rh: 0.17, color: tile, ends: wall, chiwen: r() < 0.4 }), r() < 0.5 ? 0.15 : -0.15);
  // the yard wall and its gatehouse
  const F = 0.4;
  const gx = pick(r, [0, -0.2, 0.2]);
  const back = hz + hd / 2;
  const wallH = 0.15;
  wallRun(p, -0.43, F, gx - 0.09, F, wallH, wall, tile);
  wallRun(p, gx + 0.09, F, 0.43, F, wallH, wall, tile);
  for (const sx of [-1, 1]) wallRun(p, sx * 0.43, back, sx * 0.43, F, wallH, wall, tile);
  p.box(0.18, 0.21, 0.07, gx, 0.02, F, wall);
  p.quad(0.08, 0.15, gx, 0.02, F + 0.036, DARK);
  for (const s of [-1, 1]) p.quad(0.028, 0.15, gx + s * 0.03, 0.02, F + 0.038, wood);
  cap(p, 0.26, 0.15, 0.055, gx, 0.23, F, tile);
  // a side wing facing into the yard, or a tree; a well, a jar
  const side = r() < 0.5 ? -1 : 1;
  if (r() < 0.6) {
    const q = p.at(side * 0.3, 0.025, 0.2, -side * PI / 2);
    storey(q, { w: 0.3, d: 0.2, h: 0.18, y: 0, wall, wood, bays: r() < 0.5 ? ['win', 'door'] : ['door', 'win'] });
    roof(q, { kind: 'gable', ww: 0.3, wd: 0.2, top: 0.18, ov: 0.06, rh: 0.1, color: tile, ends: wall, seg: 3 });
  } else {
    p.cyl(0.018, 0.025, 0.22, 5, side * 0.27, 0.02, 0.2, '#5a3d30');
    p.sphere(0.14, side * 0.27, 0.34, 0.2, r() < 0.5 ? '#f2b8c9' : '#6f9a4a', 0.85);
  }
  if (r() < 0.5) {
    p.cyl(0.04, 0.045, 0.05, 7, -side * 0.2, 0.02, 0.18, STONE2);
    p.cyl(0.03, 0.03, 0.002, 7, -side * 0.2, 0.071, 0.18, DARK);
  } else jars(p, r, -side * 0.24, 0.22);
}

/** A thatched cottage of the outskirts, with a wattle fence, a haystack and a vegetable bed. */
function cottage(p: Pen, r: Rng) {
  const mud = jitter('#cdb995', r, 0.01, 0.05, 0.05);
  const wood = '#6b4a32';
  plinth(p.k, 0.9, 0.9, '#8f8470');
  p.box(0.9, 0.02, 0.9, 0, 0, 0, '#bfae86');
  const w = 0.56 + r() * 0.1;
  const z = -0.16;
  storey(p, { w, d: 0.34, h: 0.21, y: 0.02, z, wall: mud, wood, bays: r() < 0.5 ? ['win', 'door'] : ['door', 'win', 'win'] });
  smokeAt(p, roof(p, { kind: 'hip', ww: w, wd: 0.34, top: 0.23, z, ov: 0.09, rh: 0.21, k: 0.85, lift: 0, color: jitter('#a8915e', r, 0.01, 0.06, 0.06), seg: 3 }), 0.05);
  // the fence round the front yard
  const F = 0.42;
  for (const [x0, z0, x1, z1] of [
    [-0.43, 0.06, -0.43, F],
    [-0.43, F, 0.43, F],
    [0.43, F, 0.43, 0.06],
  ] as const)
    railing(p, x0, z0, x1, z1, 0.02, 0.09, 4, '#8a7050');
  const sx = r() < 0.5 ? -1 : 1;
  p.sphere(0.1, sx * 0.25, 0.08, 0.24, '#c9b070', 1.1);
  p.cyl(0, 0.05, 0.08, 6, sx * 0.25, 0.17, 0.24, '#b39a5c');
  for (let i = 0; i < 3; i++) p.box(0.22, 0.03, 0.035, -sx * 0.18, 0.02, 0.16 + i * 0.07, '#6f9a4a');
}

/** A two-storey shop: an open colonnaded front, a pent eave, a railed balcony and a hip-gable roof. */
function shop(p: Pen, r: Rng, grand = false) {
  const wall = plasterC(r);
  const wood = pick(r, TIMBER);
  const tile = tileC(r);
  const W = grand ? 0.86 : 0.76 + r() * 0.08;
  const D = grand ? 0.62 : 0.58;
  const h1 = grand ? 0.28 : 0.25;
  const h2 = grand ? 0.23 : 0.2;
  plinth(p.k, W + 0.08, D + 0.08, STONE2);
  p.box(W + 0.08, 0.04, D + 0.08, 0, 0, 0, STONE);
  const y1 = 0.04;
  storey(p, { w: W, d: D, h: h1, y: y1, wall, wood, porch: 0.09, bays: grand ? ['open', 'door', 'open'] : r() < 0.5 ? ['open', 'open', 'open'] : ['open', 'open', 'win'] });
  // the counter and its goods
  const cz = D / 2 - 0.12;
  p.box(W * 0.56, 0.07, 0.05, -W * 0.1, y1, cz, '#5a3d2a');
  const goods = r();
  for (let i = 0; i < (grand ? 0 : 3); i++) {
    const gx = -W * 0.1 - W * 0.16 + i * W * 0.16;
    if (goods < 0.4) p.cyl(0.018, 0.022, 0.04, 5, gx, y1 + 0.07, cz, pick(r, ['#4f4034', '#6a5a48', '#8a7a5a']));
    else if (goods < 0.7) p.box(0.05, 0.022, 0.04, gx, y1 + 0.07, cz, pick(r, GOODS));
    else p.sphere(0.022, gx, y1 + 0.085, cz, pick(r, GOODS), 0.8, 0);
  }
  if (grand) plaque(p, 0, y1 + h1 - 0.085, D / 2 - 0.09 + 0.006);
  const t1 = y1 + h1;
  // the pent eave between the floors (腰檐) and the balcony (平座) over it
  roof(p, { kind: 'hip', ww: W, wd: D, top: t1, ov: 0.08, rh: 0.08, k: 1.5, lift: 0.03, color: tile, seg: 3, bare: true });
  const pd = D - 0.06;
  p.box(W - 0.01, 0.075, pd, 0, t1, 0, wood);
  const yb = t1 + 0.075;
  const rz = pd / 2 - 0.01;
  railing(p, -W / 2 + 0.01, rz, W / 2 - 0.01, rz, yb, 0.065, 4, wood);
  for (const s of [-1, 1]) railing(p, s * (W / 2 - 0.01), rz, s * (W / 2 - 0.01), 0.12, yb, 0.065, 1, wood);
  // the upper floor, set back behind the balcony
  const w2 = W - 0.06;
  const d2 = D - 0.2;
  const z2 = -0.05;
  const opts: Bay[] = ['win', 'blind', 'blind', 'win'];
  storey(p, { w: w2, d: d2, h: h2, y: yb, z: z2, wall, wood, bays: [pick(r, opts), pick(r, opts), pick(r, opts)], sideWin: grand });
  const t2 = yb + h2;
  if (grand) brackets(p, w2, 6, t2 - 0.034, z2 + d2 / 2 + 0.01, '#4f7266');
  smokeAt(p, roof(p, { kind: r() < 0.75 || grand ? 'xie' : 'hip', ww: w2, wd: d2, top: t2, z: z2, ov: grand ? 0.1 : 0.12, rh: 0.2, lift: 0.065, color: tile, ends: wall, chiwen: grand || r() < 0.5 }), 0.08);
  // red lanterns under the pent eave
  if (grand || r() < 0.5) for (const s of [-1, 1]) lantern(p, s * W * 0.3, t1 - 0.01, D / 2 + 0.04);
  if (!grand) {
    if (r() < 0.6) signboard(p, r, (r() < 0.5 ? -1 : 1) * (W / 2 - 0.04), 0.41);
    streetProps(p, r, 0.39, [(r() < 0.5 ? -1 : 1) * 0.27]);
  }
}

/**
 * A great wine house (正店): a grand two-storey shop behind its 彩楼欢门, the towering gateway of lashed
 * poles hung with coloured cloth that fronted the main restaurants of the capital, and a wine banner.
 */
function restaurant(p: Pen, r: Rng) {
  shop(p, r, true);
  const z = 0.42;
  const H = 0.6;
  const xs = [-0.36, -0.13, 0.13, 0.36];
  const pole = '#8a6a44';
  for (const x of xs) p.cyl(0.011, 0.012, H, 4, x, 0.04, z, pole, 0, true);
  for (const y of [0.3, 0.44, H + 0.02]) p.box(0.76, 0.018, 0.018, 0, y, z, pole);
  // lattice bracing in the outer bays
  for (const s of [-1, 1]) {
    p.beam(V(s * 0.36, 0.31, z), V(s * 0.13, 0.45, z), 0.012, pole);
    p.beam(V(s * 0.13, 0.31, z), V(s * 0.36, 0.45, z), 0.012, pole);
  }
  // the peaks: a tall one over the doorway and lower ones over the side bays
  const top = H + 0.04;
  const peaks: [number, number, number][] = [
    [-0.13, 0.13, 0.17],
    [-0.36, -0.13, 0.1],
    [0.13, 0.36, 0.1],
  ];
  const flowers = ['#c8402a', '#d9a23a', '#3f7a6a', '#e9c8d6', '#3f5f8a'];
  for (const [a, b, hgt] of peaks) {
    const apex = V((a + b) / 2, top + hgt, z);
    p.beam(V(a, top, z), apex, 0.014, pole);
    p.beam(V(b, top, z), apex, 0.014, pole);
    p.sphere(0.026, apex.x, apex.y + 0.012, z, pick(r, flowers), 1, 0);
  }
  // festoons of coloured cloth along the bars
  for (let i = 0; i < 9; i++) {
    const x = -0.34 + i * 0.085;
    const c = flowers[i % flowers.length];
    for (const y of [0.44, top]) p.tri(V(x - 0.03, y, z + 0.012), V(x + 0.03, y, z + 0.012), V(x, y - 0.05, z + 0.014), c);
  }
  // gardenia lanterns (栀子灯) at the doorway
  for (const s of [-1, 1]) lantern(p, s * 0.07, 0.44, z + 0.01, '#d9883a');
  wineFlag(p, r, r() < 0.5 ? -1 : 1, 0.44, 1.02);
}

/** A tea house: an open hall behind a mat awning on poles, with tables and benches, and a banner. */
function teahouse(p: Pen, r: Rng, waterside: boolean) {
  const wall = plasterC(r);
  const wood = pick(r, TIMBER);
  const tile = tileC(r);
  const W = 0.78;
  const D = 0.38;
  const z = -0.2;
  const h = 0.25;
  plinth(p.k, 0.92, 0.92, STONE2);
  p.box(0.92, 0.03, 0.92, 0, 0, 0, waterside ? '#8a6a4a' : '#c2b28e');
  if (waterside) for (let i = 0; i < 6; i++) p.quad(0.9, 0.004, 0, 0.03, 0.06 + i * 0.07, '#6e5238', 0); // deck boards
  storey(p, { w: W, d: D, h, y: 0.03, z, wall, wood, porch: 0.07, bays: ['open', 'open', 'open'] });
  smokeAt(p, roof(p, { kind: r() < 0.5 ? 'xie' : 'gable', ww: W, wd: D, top: 0.03 + h, z, ov: 0.1, rh: 0.17, color: tile, ends: wall, chiwen: r() < 0.3 }), 0.2);
  // the mat awning (凉棚)
  const z0 = 0.03;
  const z1 = 0.42;
  const ya = 0.29;
  const yb = 0.23;
  const len = Math.hypot(z1 - z0, ya - yb);
  const ang = Math.atan2(ya - yb, z1 - z0);
  const mat = pick(r, MAT);
  p.obox(W + 0.04, 0.012, len, 0, (ya + yb) / 2, (z0 + z1) / 2, mat, ang);
  for (let i = 0; i < 4; i++) p.obox(0.012, 0.016, len, -W / 2 + 0.02 + (i * (W - 0.04)) / 3, (ya + yb) / 2 + 0.008, (z0 + z1) / 2, shade(mat, 0.75), ang);
  for (const x of [-W / 2, 0, W / 2]) p.box(0.016, yb, 0.016, x, 0.03, z1 - 0.01, POLE);
  // tables and benches under it, with teapots
  for (const x of [-0.2, 0.2]) {
    const tz = 0.23;
    p.box(0.13, 0.012, 0.1, x, 0.1, tz, '#6a4a30');
    p.box(0.03, 0.07, 0.03, x, 0.03, tz, '#5a3d2a');
    for (const s of [-1, 1]) p.box(0.13, 0.05, 0.03, x, 0.03, tz + s * 0.085, '#6a4a30');
    p.sphere(0.016, x - 0.02, 0.122, tz, '#3a3a36', 0.9, 0);
    p.cyl(0.008, 0.008, 0.012, 5, x + 0.03, 0.112, tz + 0.02, '#e8e4da');
  }
  if (r() < 0.5) figure(p, -0.2, 0.03, 0.31, pick(r, CLOTHES));
  wineFlag(p, r, r() < 0.5 ? -1 : 1, 0.43, 0.82);
}

/** A warehouse on the quay: a long plain store with a wide door, stone steps down to the water, cargo. */
function warehouse(p: Pen, r: Rng) {
  const wall = plasterC(r);
  const wood = pick(r, ['#6a4a36', '#5e4232', '#7a4a32']);
  const tile = tileC(r);
  plinth(p.k, 0.92, 0.92, STONE2);
  p.box(0.92, 0.04, 0.84, 0, 0, -0.04, STONE);
  // the quay edge and steps down to the water
  p.box(0.92, 0.3, 0.05, 0, -0.32, 0.435, STONE2);
  for (let i = 0; i < 3; i++) p.box(0.28, 0.32 - i * 0.06, 0.05, 0.18, -0.32, 0.33 + i * 0.05, STONE);
  for (const s of [-1, 1]) p.cyl(0.018, 0.022, 0.07, 6, s * 0.4, 0.04, 0.38, STONE2);
  const W = 0.84;
  const D = 0.44;
  const z = -0.18;
  const h = 0.3;
  storey(p, { w: W, d: D, h, y: 0.04, z, wall, wood, bays: ['high', 'gate', 'high'], sideWin: true });
  smokeAt(p, roof(p, { kind: r() < 0.6 ? 'gable' : 'hip', ww: W, wd: D, top: 0.04 + h, z, ov: 0.09, rh: 0.2, k: 1.5, color: tile, ends: wall }), -0.2);
  // cargo on the quay
  sacks(p, r, -0.22, 0.2, 3 + Math.floor(r() * 3));
  for (let i = 0; i < 2 + Math.floor(r() * 2); i++) p.cyl(0.03, 0.032, 0.075, 6, 0.08 + i * 0.07, 0.04, 0.16, '#7a5838');
  if (r() < 0.5) p.box(0.09, 0.07, 0.09, 0.32, 0.04, 0.14, '#8a6a44');
  if (r() < 0.5) barrow(p, r, 0.2, 0.25, 1.4);
  if (r() < 0.4) figure(p, -0.05, 0.04, 0.3, pick(r, CLOTHES));
}

/** A fire-watch tower (望火楼) of brick, with a lookout pavilion on top. */
function watchtower(p: Pen, r: Rng) {
  const wood = pick(r, TIMBER);
  const tile = tileC(r);
  plinth(p.k, 0.9, 0.9, STONE2);
  p.box(0.9, 0.03, 0.9, 0, 0, 0, '#c2b28e');
  const H = 0.62;
  const brick = jitter('#9a8f80', r, 0.01, 0.04, 0.04);
  p.cyl(0.17, 0.24, H, 4, 0, 0.03, 0, brick, PI / 4);
  for (const f of [0.3, 0.62, 0.92]) {
    const hw = lerp(0.24, 0.17, f) * Math.SQRT1_2 + 0.006;
    p.box(hw * 2, 0.018, hw * 2, 0, 0.03 + H * f, 0, shade(brick, 0.82));
  }
  const door = p.at(0, 0.03, 0.166);
  door.quad(0.09, 0.12, 0, 0, 0.005, DARK);
  const arch = new THREE.CircleGeometry(0.045, 6, 0, PI);
  arch.translate(0, 0.12, 0.005);
  door.add(arch, DARK);
  const y = 0.03 + H;
  p.box(0.34, 0.03, 0.34, 0, y, 0, wood);
  for (const [x, z] of [
    [-0.15, -0.15],
    [0.15, -0.15],
    [0.15, 0.15],
    [-0.15, 0.15],
  ])
    p.box(0.024, 0.2, 0.024, x, y + 0.03, z, wood);
  for (const s of [-1, 1]) {
    railing(p, -0.17, s * 0.17, 0.17, s * 0.17, y + 0.03, 0.06, 3, wood);
    railing(p, s * 0.17, -0.17, s * 0.17, 0.17, y + 0.03, 0.06, 3, wood);
  }
  smokeAt(p, roof(p, { kind: 'xie', ww: 0.3, wd: 0.3, top: y + 0.23, ov: 0.08, rh: 0.15, lift: 0.06, color: tile, chiwen: true, ends: '#e8e1d0' }), 0);
  figure(p, 0.05, y + 0.03, 0.05, '#5a6e5a');
}

/* ---------------------------------------------------------------- boats */

/** A lofted hull, square at the transoms, its sheer rising to the stern; returns the deck height at x. */
function hull(p: Pen, L: number, W: number, stern: number, bow: number, c: Col) {
  const yt = (u: number) => 0.06 + (u < 0 ? stern : bow) * Math.pow(Math.abs(u), 2.6);
  const rings = [-1, -0.82, -0.5, 0, 0.5, 0.82, 1].map((u) => {
    const a = Math.abs(u);
    const x = (u * L) / 2;
    const top = yt(u);
    const yb = -0.05 + 0.06 * a * a;
    const hw = (W / 2) * (1 - 0.34 * a * a * a);
    const mid = yb + (top - yb) * 0.45;
    return [V(x, top, hw), V(x, mid, hw * 0.93), V(x, yb, hw * 0.5), V(x, yb, -hw * 0.5), V(x, mid, -hw * 0.93), V(x, top, -hw)];
  });
  p.add(loft(rings), c);
  for (const ring of [rings[0], rings[rings.length - 1]]) {
    const o = ring.reduce((s, v) => s.add(v), V(0, 0, 0)).multiplyScalar(1 / ring.length);
    fan(p, o, [...ring, ring[0]], shade(c, 0.85));
  }
  const wale = shade(c, 0.66);
  ribbon(p, rings.map((r) => r[0]), -0.02, wale, V(0, 0, 0.004));
  ribbon(p, rings.map((r) => r[5]), -0.02, wale, V(0, 0, -0.004));
  return (x: number) => yt((2 * x) / L);
}

/** A barrel-vaulted mat cabin along x. */
function vault(p: Pen, x0: number, x1: number, r: number, y: number, c: Col, ends: boolean) {
  const g = new THREE.CylinderGeometry(r, r, x1 - x0, 8, 1, true, 0, PI);
  g.rotateZ(PI / 2);
  g.scale(1, 0.85, 1);
  g.translate((x0 + x1) / 2, y, 0);
  p.add(g, c);
  if (ends)
    for (const x of [x0, x1]) {
      const e = new THREE.CircleGeometry(r * 0.97, 8, 0, PI);
      e.rotateY(PI / 2);
      e.scale(1, 0.85, 1);
      e.translate(x, y, 0);
      p.add(e, DARK);
    }
}

/** A grain barge of the canal fleets: mat cabins, sacks, a battened sail or the bipod mast, a sweep. */
function grainBarge(p: Pen, r: Rng) {
  const L = 1.0 + r() * 0.12;
  const wood = jitter('#6b4a30', r, 0.01, 0.05, 0.06);
  const deck = hull(p, L, 0.3, 0.13, 0.07, wood);
  const mat = pick(r, MAT);
  vault(p, -L * 0.37, -L * 0.1, 0.13, 0.06, shade(mat, 0.88), true);
  vault(p, -L * 0.1, L * 0.08, 0.12, 0.06, mat, true);
  sacks(p.at(L * 0.27, 0.05, 0), r, 0, 0, 5);
  if (r() < 0.55) {
    // a tall battened mat sail, a little turned to the wind
    const mx = L * 0.12;
    p.cyl(0.01, 0.014, 0.92, 4, mx, 0.06, 0, POLE);
    const q = p.at(mx, 0.28, 0, (r() - 0.5) * 0.6);
    const sw = 0.36;
    const sh = 0.58;
    q.quad(sw, sh, sw * 0.3, 0, 0.012, pick(r, ['#c8b48a', '#bfa878', '#d9cba4']));
    for (let i = 0; i <= 5; i++) q.box(sw + 0.01, 0.008, 0.008, sw * 0.3, (i * sh) / 5 - 0.004, 0.017, '#4a3626');
  } else {
    // the bipod mast (人字桅), lowered to pass under bridges
    const ax = L * 0.12;
    const top = V(ax + 0.06, 0.78, 0);
    for (const s of [-1, 1]) p.beam(V(ax, 0.07, s * 0.12), top, 0.016, POLE);
    p.beam(top, V(L * 0.49, deck(L * 0.49) + 0.01, 0), 0.006, '#3a2a20');
  }
  // the great stern sweep (橹), a rudder post, and the crew
  const sx = -L * 0.44;
  p.beam(V(sx, deck(sx) + 0.06, 0.07), V(-L * 0.5 - 0.24, -0.02, 0.13), 0.014, POLE);
  figure(p, sx + 0.03, deck(sx + 0.03), 0.05, pick(r, CLOTHES), true);
  figure(p, L * 0.42, deck(L * 0.42), -0.05, pick(r, CLOTHES), r() < 0.5);
}

/** A passenger boat with a windowed cabin under a low tiled roof. */
function passengerBoat(p: Pen, r: Rng) {
  const L = 0.86;
  const wood = jitter('#74502f', r, 0.01, 0.05, 0.06);
  const deck = hull(p, L, 0.27, 0.1, 0.06, wood);
  const y = 0.065;
  const cw = '#8a6a48';
  p.box(0.42, 0.13, 0.2, -0.06, y, 0, cw);
  for (const s of [1, -1]) for (let i = 0; i < 3; i++) lattice(p.at(-0.2 + i * 0.14, y + 0.03, s * 0.102, s > 0 ? 0 : PI), 0.1, 0.07, '#4a3626');
  roof(p, { kind: 'gable', ww: 0.42, wd: 0.2, top: y + 0.13, x: -0.06, ov: 0.05, rh: 0.07, k: 1.4, lift: 0.025, color: pick(r, ['#6a5a48', '#5a6068', '#5e5244']), seg: 3 });
  railing(p, 0.2, 0.11, 0.36, 0.09, 0.07, 0.05, 2, '#4a3626');
  railing(p, 0.2, -0.11, 0.36, -0.09, 0.07, 0.05, 2, '#4a3626');
  const sx = -L * 0.43;
  p.beam(V(sx, deck(sx) + 0.06, 0.06), V(-L * 0.5 - 0.2, -0.02, 0.11), 0.012, POLE);
  figure(p, sx + 0.03, deck(sx + 0.03), 0.03, pick(r, CLOTHES), true);
  figure(p, 0.28, deck(0.28), 0, pick(r, CLOTHES));
}

/** A small sampan with a mat cover, poled by a boatman in a bamboo hat. */
function sampan(p: Pen, r: Rng) {
  const L = 0.5 + r() * 0.08;
  const deck = hull(p, L, 0.17, 0.06, 0.04, jitter('#7a5636', r, 0.01, 0.05, 0.06));
  vault(p, -0.08, 0.08, 0.075, 0.055, pick(r, MAT), false);
  const bx = -L * 0.36;
  figure(p, bx, deck(bx), 0, pick(r, CLOTHES), true);
  p.beam(V(bx + 0.02, deck(bx) + 0.14, 0.03), V(bx + 0.2, -0.12, 0.1), 0.008, '#8a7050');
  if (r() < 0.6) for (let i = 0; i < 3; i++) p.sphere(0.022, L * 0.28 + (i % 2) * 0.03, 0.07 + (i > 1 ? 0.02 : 0), (i - 1) * 0.03, pick(r, ['#7a9a4a', '#d9a23a', '#a6bf78']), 0.8, 0);
}

/* ---------------------------------------------------------------- the Iron Pagoda */

/** An octagonal eave ring (corners at π/8 + kπ/4, matching an 8-sided cylinder turned π/8). */
function octEave(p: Pen, r0: number, r1: number, rh: number, y: number, lift: number, c: Col) {
  const M = 3;
  const ts = [0, 0.12, 0.45, 1];
  const rings = ts.map((t) => {
    const r = lerp(r1, r0, t);
    const yy = y + rh * Math.pow(t, 1.6);
    const lt = lift * Math.pow(1 - t, 2);
    const ring: THREE.Vector3[] = [];
    for (let s = 0; s < 8; s++) {
      const a0 = PI / 8 + (s * PI) / 4;
      const a1 = a0 + PI / 4;
      for (let m = 0; m < M; m++) {
        const u = m / M;
        const e = Math.abs(u * 2 - 1);
        ring.push(V(lerp(Math.sin(a0), Math.sin(a1), u) * r, yy + lt * e * e * e, lerp(Math.cos(a0), Math.cos(a1), u) * r));
      }
    }
    return ring;
  });
  p.add(loft([rings[0].map((v) => V(v.x, v.y - 0.02, v.z)), rings[0]]), shade(c, 0.6));
  p.add(loft(rings.slice(0, 2)), shade(c, 0.82));
  p.add(loft(rings.slice(1)), c);
  return rings[0];
}

/** An arched niche with a seated Buddha, on a face whose frame has +z outward. */
function niche(q: Pen, w: number, h: number, y0: number, buddha: boolean) {
  q.quad(w, h, 0, y0, 0.006, DARK);
  const arch = new THREE.CircleGeometry(w / 2, 6, 0, PI);
  arch.translate(0, y0 + h, 0.006);
  q.add(arch, DARK);
  if (buddha) {
    q.sphere(w * 0.3, 0, y0 + h * 0.28, 0.012, '#a88a52', 0.85, 0);
    q.sphere(w * 0.15, 0, y0 + h * 0.7, 0.012, '#b8995a', 1, 0);
  }
}

function ironPagoda(p: Pen) {
  // the stone platform (须弥座) with its steps
  p.cyl(0.66, 0.7, 0.08, 8, 0, 0, 0, STONE, PI / 8);
  p.cyl(0.6, 0.62, 0.05, 8, 0, 0.08, 0, '#b8b0a0', PI / 8);
  p.cyl(0.55, 0.57, 0.04, 8, 0, 0.13, 0, STONE, PI / 8);
  for (let i = 0; i < 3; i++) p.box(0.26, 0.17 - i * 0.05, 0.07, 0, 0, 0.58 + i * 0.06, STONE);
  let y = 0.17;
  const N = 13;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const r = 0.41 * (1 - 0.33 * Math.pow(t, 1.1));
    const hh = i === 0 ? 0.42 : 0.27 - 0.075 * t;
    const iron = IRON[i % IRON.length];
    p.cyl(r * 0.985, r, hh, 8, 0, y, 0, iron, PI / 8, true);
    // round brick pilasters at the eight angles
    for (let f = 0; f < 8; f++) {
      const a = PI / 8 + (f * PI) / 4;
      p.cyl(0.016, 0.016, hh, 4, Math.sin(a) * r * 0.99, y, Math.cos(a) * r * 0.99, '#4f3628', 0, true);
    }
    // each face: an arched doorway or a niche with a Buddha, alternating storey by storey, and between
    // them the glazed relief tiles (Buddhas, apsaras, lions) that cover the real tower
    const ap = r * Math.cos(PI / 8) * 0.99;
    for (let f = 0; f < 8; f++) {
      const a = (f * PI) / 4;
      const q = p.at(Math.sin(a) * ap, y, Math.cos(a) * ap, a);
      if (i === 0) {
        if (f % 2 === 0) niche(q, f === 0 ? 0.13 : 0.09, f === 0 ? 0.22 : 0.16, 0.02, f !== 0);
        else for (let j = 0; j < 3; j++) for (const sx of [-1, 1]) q.quad(0.04, 0.04, sx * 0.04, 0.08 + j * 0.1, 0.005, '#7a5a40');
      } else if ((f + i) % 2 === 0) niche(q, 0.075, hh * 0.42, hh * 0.18, true);
      else for (const sx of [-1, 1]) for (const sy of [0.25, 0.58]) q.quad(0.035, 0.035, sx * 0.035, hh * sy, 0.005, '#7a5a40');
    }
    // the bracket band and eave of the storey, with a bell at each corner
    const ye = y + hh;
    p.cyl(r + 0.035, r * 0.99, 0.045, 8, 0, ye - 0.045, 0, '#3f2c21', PI / 8, true);
    for (let f = 0; f < 8; f++) {
      const a = PI / 8 + (f * PI) / 4;
      p.box(0.03, 0.03, 0.03, Math.sin(a) * (r + 0.02), ye - 0.04, Math.cos(a) * (r + 0.02), '#4b3426', a);
    }
    const rn = 0.41 * (1 - 0.33 * Math.pow(Math.min(1, (i + 1) / (N - 1)), 1.1));
    const outer = octEave(p, rn * 0.97, r + 0.15 - 0.03 * t, 0.085, ye - 0.02, 0.05, '#4b3426');
    for (let f = 0; f < 8; f++) {
      const v = outer[f * 3];
      p.cyl(0.006, 0.014, 0.028, 4, v.x * 0.99, v.y - 0.045, v.z * 0.99, BRONZE);
    }
    y = ye + 0.035;
  }
  // the finial (塔刹): a steep cap, a lotus seat, rings and the bottle gourd
  const rt = 0.41 * 0.67;
  p.cyl(0.04, rt * 0.95, 0.16, 8, 0, y - 0.01, 0, '#4b3426', PI / 8);
  p.sphere(0.07, 0, y + 0.17, 0, BRONZE, 0.5);
  p.cyl(0.012, 0.018, 0.36, 5, 0, y + 0.17, 0, BRONZE);
  for (let i = 0; i < 4; i++) p.cyl(0.042 - i * 0.006, 0.042 - i * 0.006, 0.014, 8, 0, y + 0.24 + i * 0.045, 0, BRONZE);
  p.sphere(0.048, 0, y + 0.5, 0, GOLD);
  p.sphere(0.032, 0, y + 0.575, 0, GOLD);
  p.cyl(0, 0.01, 0.07, 5, 0, y + 0.6, 0, GOLD);
}

/** A small two-storey pavilion of the temple court (the bell tower, the sutra library). */
function pavilion(p: Pen, wall: Col, wood: Col, tile: Col) {
  const s1 = 0.32;
  const h1 = 0.2;
  p.box(s1 + 0.07, 0.04, s1 + 0.07, 0, 0, 0, STONE);
  storey(p, { w: s1, d: s1, h: h1, y: 0.04, wall, wood, bays: ['win', 'door', 'win'] });
  const t1 = 0.04 + h1;
  roof(p, { kind: 'hip', ww: s1, wd: s1, top: t1, ov: 0.07, rh: 0.06, k: 1.5, lift: 0.03, color: tile, seg: 3, bare: true });
  p.box(s1 + 0.02, 0.06, s1 + 0.02, 0, t1, 0, wood);
  const e = (s1 + 0.02) / 2 - 0.01;
  for (const s of [-1, 1]) {
    railing(p, -e, s * e, e, s * e, t1 + 0.06, 0.055, 3, wood);
    railing(p, s * e, -e, s * e, e, t1 + 0.06, 0.055, 3, wood);
  }
  const s2 = 0.24;
  const h2 = 0.16;
  storey(p, { w: s2, d: s2, h: h2, y: t1 + 0.06, wall, wood, bays: ['win', 'door', 'win'] });
  roof(p, { kind: 'xie', ww: s2, wd: s2, top: t1 + 0.06 + h2, ov: 0.1, rh: 0.17, lift: 0.07, color: tile, chiwen: true, ends: wall });
}

/** A Song stone dharani pillar (经幢). */
function pillar(p: Pen, x: number, z: number) {
  p.cyl(0.06, 0.07, 0.05, 8, x, 0.05, z, STONE, PI / 8);
  p.cyl(0.028, 0.03, 0.2, 8, x, 0.1, z, '#b8b0a0', PI / 8);
  p.cyl(0.055, 0.045, 0.03, 8, x, 0.3, z, STONE, PI / 8);
  p.cyl(0.02, 0.022, 0.07, 8, x, 0.33, z, '#b8b0a0', PI / 8);
  p.cyl(0, 0.04, 0.05, 8, x, 0.4, z, STONE, PI / 8);
  p.sphere(0.015, x, 0.46, z, STONE, 1, 0);
}

function cypress(p: Pen, x: number, z: number, s = 1) {
  p.cyl(0.02, 0.03, 0.16 * s, 5, x, 0.05, z, '#5a4030');
  p.cyl(0, 0.13 * s, 0.4 * s, 7, x, 0.12 * s, z, '#3a5a3c');
  p.cyl(0, 0.1 * s, 0.32 * s, 7, x, 0.34 * s, z, '#42653f');
}

/* ---------------------------------------------------------------- trees and scatter */

const willow = (k: Kit) => {
  // a weeping willow, the tree of the Bian's banks, in its first green
  const p = new Pen(k);
  p.cyl(0.03, 0.048, 0.5, 5, 0, 0, 0, '#5d4a36');
  p.beam(V(0.0, 0.4, 0), V(-0.13, 0.66, -0.05), 0.03, '#5d4a36');
  p.beam(V(0.0, 0.42, 0), V(0.12, 0.64, 0.06), 0.028, '#5d4a36');
  p.sphere(0.21, 0.0, 0.72, 0, '#98b862', 0.55);
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * PI * 2 + (i % 2) * 0.25;
    const r = 0.16 + (i % 3) * 0.05;
    p.sphere(0.07, Math.cos(a) * r, 0.5 + (i % 3) * 0.05, Math.sin(a) * r, i % 3 === 0 ? '#a3c26c' : i % 3 === 1 ? '#b6d07e' : '#9ab866', 3.2, 0);
  }
};

const peach = (k: Kit) => {
  const p = new Pen(k);
  p.beam(V(0, 0, 0), V(0.04, 0.3, 0), 0.045, '#5a3d30');
  p.beam(V(0.04, 0.28, 0), V(-0.08, 0.46, 0.03), 0.03, '#5a3d30');
  p.beam(V(0.04, 0.28, 0), V(0.16, 0.42, -0.04), 0.028, '#5a3d30');
  p.sphere(0.17, -0.06, 0.52, 0.02, '#f2b8c9', 0.8);
  p.sphere(0.14, 0.15, 0.48, -0.05, '#f7cfdb', 0.8);
  p.sphere(0.11, 0.03, 0.66, -0.02, '#eea6bb', 0.85);
  p.sphere(0.08, -0.12, 0.4, -0.1, '#a6bf78', 0.8, 0);
};

const lotus = (k: Kit) => {
  const p = new Pen(k);
  const pads: [number, number, number, number][] = [
    [0, 0, 0.065, 0.004],
    [0.1, 0.03, 0.05, 0.06],
    [-0.07, 0.07, 0.045, 0.1],
    [0.02, -0.1, 0.055, 0.02],
  ];
  pads.forEach(([x, z, r, y], i) => {
    if (y > 0.01) p.cyl(0.003, 0.003, y + 0.02, 3, x, 0, z, '#5f8a4a');
    const g = new THREE.ConeGeometry(r, r * 0.3, 9, 1, true);
    g.rotateX(PI);
    g.translate(x, y + 0.02 + r * 0.15, z);
    p.add(g, i % 2 ? '#5f9a5a' : '#6fa862');
  });
  p.cyl(0.003, 0.003, 0.16, 3, -0.03, 0, -0.03, '#5f8a4a');
  p.sphere(0.02, -0.03, 0.16, -0.03, '#f2a8c0', 1.5, 0);
};

const reeds = (k: Kit) => {
  const p = new Pen(k);
  for (let i = 0; i < 8; i++) {
    const a = i * 2.3;
    const r = 0.02 + (i % 3) * 0.03;
    const h = 0.2 + (i % 4) * 0.06;
    const g = new THREE.ConeGeometry(0.008, h, 3);
    g.translate(0, h / 2, 0);
    g.applyMatrix4(new THREE.Matrix4().compose(V(Math.cos(a) * r, -0.02, Math.sin(a) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * 0.2, 0, Math.cos(a) * 0.2)), ONE));
    p.add(g, i % 2 ? '#8b9a52' : '#a3a868');
  }
  p.sphere(0.014, 0.03, 0.3, 0.01, '#c9b98a', 2.4, 0);
  p.sphere(0.012, -0.04, 0.26, 0.03, '#c9b98a', 2.4, 0);
};

const ducks = (k: Kit) => {
  const p = new Pen(k);
  for (const [x, z] of [
    [0, 0],
    [0.11, 0.06],
  ]) {
    p.sphere(0.028, x, 0.012, z, '#8a6a4a', 0.6, 0);
    p.sphere(0.014, x + 0.026, 0.038, z, '#3f5f4a', 1, 0);
    p.box(0.014, 0.005, 0.008, x + 0.044, 0.034, z, '#d9a23a');
  }
};

/* ---------------------------------------------------------------- the style */

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
    const p = new Pen(k);
    const r = c.rng;
    const t = r();
    const nb = c.neighbours;
    if (c.waterside) {
      if (t < 0.24) warehouse(p, r);
      else if (t < 0.46) teahouse(p, r, true);
      else if (t < 0.74 || nb < 3) shop(p, r);
      else if (t < 0.88) restaurant(p, r);
      else dwelling(p, r);
    } else if (nb >= 5) {
      if (t < 0.02 && nb >= 6) watchtower(p, r);
      else if (t < 0.22) restaurant(p, r);
      else if (t < 0.6) shop(p, r);
      else if (t < 0.74) teahouse(p, r, false);
      else dwelling(p, r);
    } else if (nb >= 3) {
      if (t < 0.1) restaurant(p, r);
      else if (t < 0.42) shop(p, r);
      else if (t < 0.56) teahouse(p, r, false);
      else dwelling(p, r);
    } else if (nb >= 1 || t < 0.4) {
      if (t < 0.15) teahouse(p, r, false);
      else dwelling(p, r);
    } else cottage(p, r);
  },
  field(rng) {
    return [-0.31, 0, 0.31].map((z) => ({ x: 0, z, w: 0.92, d: 0.26, h: 0.05, color: jitter(pick(rng, ['#8fb050', '#a6bc5c', '#7fa048', '#b9b76a']), rng) }));
  },
  trees: { shore: ['willow', 'willow', 'willow', 'peach'], land: ['willow', 'elm', 'peach', 'elm'], hill: ['pine', 'pine', 'elm'] },
  treeKits: { ...TREES, willow, peach },
  bridge(k, j, n) {
    // the Rainbow Bridge (虹桥): a pierless arch woven from two interlocking systems of straight
    // timbers, with a gently humped deck, railings, and stalls crowding its crest
    const p = new Pen(k);
    const lo = -0.5 - j;
    const hi = n - j - 0.5;
    const A = lo - 0.2;
    const B = hi + 0.2;
    const base = 0.28;
    const rise = 0.36 * (1 + (n - 1) * 0.3);
    const deckY = (x: number) => base + rise * Math.sin((PI * (x - A)) / (B - A));
    const mine = (x: number) => (j === 0 || x >= -0.5) && (j === n - 1 || x < 0.5);
    const a = j === 0 ? A : -0.5;
    const b = j === n - 1 ? B : 0.5;
    const W = 0.46;
    const deck = '#7a5434';
    const timber = '#5a3c26';
    const rail = '#6a4630';
    const SEG = 8;
    const zAxis = V(0, 0, 1);
    for (let i = 0; i < SEG; i++) {
      const x0 = a + ((b - a) * i) / SEG;
      const x1 = a + ((b - a) * (i + 1)) / SEG;
      const y0 = deckY(x0);
      const y1 = deckY(x1);
      const len = Math.hypot(x1 - x0, y1 - y0) + 0.008;
      const q = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.atan2(y1 - y0, x1 - x0));
      const mid = V((x0 + x1) / 2, (y0 + y1) / 2, 0);
      const m = new THREE.Matrix4();
      const piece = (w: number, h: number, d: number, dy: number, z: number, c: Col) => {
        const g = new THREE.BoxGeometry(w, h, d);
        g.applyMatrix4(m.compose(V(mid.x, mid.y + dy, z), q, ONE));
        p.add(g, c);
      };
      piece(len, 0.045, W, -0.022, 0, deck);
      for (const s of [-1, 1]) {
        const z = s * (W / 2 - 0.012);
        piece(len, 0.018, 0.018, 0.1, z, rail);
        piece(len, 0.014, 0.014, 0.05, z, rail);
        p.box(0.022, 0.11, 0.022, x0, y0, z, rail);
        if (i === SEG - 1) p.box(0.022, 0.11, 0.022, x1, y1, z, rail);
      }
    }
    // the woven arch below
    const node = (f: number) => {
      const x = lo + f * (hi - lo);
      return V(x, f === 0 || f === 1 ? -0.04 : deckY(x) - 0.07, 0);
    };
    const sysA = [0, 0.27, 0.73, 1];
    const sysB = [0, 0.14, 0.5, 0.86, 1];
    [-0.19, -0.095, 0, 0.095, 0.19].forEach((zl, li) => {
      const sys = li % 2 ? sysB : sysA;
      for (let s = 0; s < sys.length - 1; s++) {
        const na = node(sys[s]).setZ(zl);
        const nb = node(sys[s + 1]).setZ(zl);
        if (mine((na.x + nb.x) / 2)) p.beam(na, nb, 0.04, timber);
      }
    });
    for (const f of [...sysA.slice(1, -1), ...sysB.slice(1, -1)]) {
      const v = node(f);
      if (mine(v.x)) p.obox(0.034, 0.034, W - 0.04, v.x, v.y, 0, shade(timber, 0.85));
    }
    // stone abutments on the banks
    if (j === 0) p.box(lo + 0.06 - A, base + 0.32, W + 0.12, (A + lo + 0.06) / 2, -0.34, 0, STONE2);
    if (j === n - 1) p.box(B - hi + 0.06, base + 0.32, W + 0.12, (B + hi - 0.06) / 2, -0.34, 0, STONE2);
    // life on the crest: vendors under umbrellas and people leaning on the rails
    const xc = (lo + hi) / 2;
    const life: [number, number, string][] = [
      [xc - 0.3, 0.14, 'stall'],
      [xc + 0.26, -0.14, 'stall'],
      [xc - 0.1, -0.15, 'man'],
      [xc + 0.05, 0.16, 'man'],
      [xc + 0.12, 0.02, 'man'],
    ];
    let seed = 7 + n * 13;
    const rr = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (const [x, z, what] of life) {
      if (!mine(x) || x < A + 0.3 || x > B - 0.3) continue;
      const y = deckY(x);
      if (what === 'stall') {
        p.box(0.1, 0.05, 0.06, x, y, z, '#7a5a3c');
        p.sphere(0.016, x - 0.02, y + 0.062, z, pick(rr, GOODS), 0.8, 0);
        p.sphere(0.016, x + 0.025, y + 0.062, z, pick(rr, GOODS), 0.8, 0);
        parasol(p, x, y, z * 0.7, 0.24, 0.12, pick(rr, ['#ece4d0', '#e2d6b8']), z > 0 ? 0.15 : -0.15);
        figure(p, x + 0.07, y, z * 0.6, pick(rr, CLOTHES), rr() < 0.4);
      } else figure(p, x, y, z, pick(rr, CLOTHES), rr() < 0.3);
    }
  },
  boat(k, rng) {
    const p = new Pen(k);
    const t = rng();
    if (t < 0.45) grainBarge(p, rng);
    else if (t < 0.7) passengerBoat(p, rng);
    else sampan(p, rng);
  },
  buildLandmark(k) {
    // the court of the Kaibao temple round the pagoda
    const p = new Pen(k);
    const wall = '#e6dcc6';
    const wood = '#8a3a28';
    const tile = '#555b63';
    plinth(k, 2.9, 2.9, STONE2);
    p.box(2.9, 0.05, 2.9, 0, 0, 0, '#cfc6b0');
    p.box(0.3, 0.012, 1.0, 0, 0.05, 0.62, '#ddd5c2');
    const E = 1.4;
    const H = 0.26;
    const wp = p.at(0, 0.05, 0);
    wallRun(wp, -E, -E, E, -E, H, wall, tile, 0.06);
    for (const s of [-1, 1]) {
      wallRun(wp, s * E, -E, s * E, E, H, wall, tile, 0.06);
      wallRun(wp, s * E, E, s * 0.4, E, H, wall, tile, 0.06);
    }
    // the gate hall (山门)
    const gz = 1.24;
    const gp = p.at(0, 0.05, gz);
    gp.box(0.84, 0.04, 0.34, 0, 0, 0, STONE);
    storey(gp, { w: 0.74, d: 0.26, h: 0.27, y: 0.04, wall: '#b4563c', wood, bays: ['wall', 'gate', 'wall'] });
    brackets(gp, 0.74, 3, 0.04 + 0.27 - 0.034, 0.14, '#4f7266');
    roof(gp, { kind: 'xie', ww: 0.74, wd: 0.26, top: 0.31, ov: 0.1, rh: 0.2, lift: 0.07, color: tile, ends: wall, chiwen: true });
    for (const s of [-1, 1]) {
      // a pair of stone lions at the gate
      gp.box(0.07, 0.05, 0.07, s * 0.22, 0, 0.2, STONE);
      gp.sphere(0.035, s * 0.22, 0.09, 0.2, '#9a958a', 1.2, 0);
      gp.sphere(0.022, s * 0.22, 0.14, 0.215, '#9a958a', 1, 0);
    }
    // the main hall behind the pagoda
    const hz = -1.08;
    const hp = p.at(0, 0.05, hz);
    hp.box(1.5, 0.08, 0.56, 0, 0, 0, STONE);
    storey(hp, { w: 1.36, d: 0.42, h: 0.3, y: 0.08, wall, wood, porch: 0.06, bays: ['win', 'win', 'door', 'win', 'win'] });
    brackets(hp, 1.36, 5, 0.08 + 0.3 - 0.034, 0.21, '#4f7266');
    roof(hp, { kind: 'hip', ww: 1.36, wd: 0.42, top: 0.38, ov: 0.11, rh: 0.26, lift: 0.07, color: tile, chiwen: true });
    for (let i = 0; i < 3; i++) hp.box(0.3, 0.08 - i * 0.025, 0.05, 0, 0, 0.3 + i * 0.045, STONE);
    // the bell tower and sutra library facing each other across the court
    for (const s of [-1, 1]) pavilion(p.at(s * 0.98, 0.05, 0.62, (-s * PI) / 2), wall, wood, tile);
    // incense burner (香炉) and a pair of dharani pillars on the axis
    const iz = 0.86;
    p.box(0.2, 0.04, 0.2, 0, 0.05, iz, STONE);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * PI * 2;
      p.cyl(0.01, 0.008, 0.05, 4, Math.cos(a) * 0.045, 0.09, iz + Math.sin(a) * 0.045, '#4a463c');
    }
    p.cyl(0.07, 0.055, 0.08, 8, 0, 0.13, iz, '#4a463c');
    for (const s of [-1, 1]) p.box(0.016, 0.04, 0.03, s * 0.07, 0.19, iz, '#4a463c');
    p.cyl(0, 0.08, 0.05, 8, 0, 0.21, iz, '#4a463c', PI / 8);
    p.sphere(0.018, 0, 0.27, iz, BRONZE, 1, 0);
    for (const s of [-1, 1]) pillar(p, s * 0.3, 0.7);
    // the pagoda itself
    ironPagoda(p.at(0, 0.05, -0.12));
    // old cypresses in the corners
    for (const [x, z, sc] of [
      [-1.15, 1.12, 1],
      [1.15, 1.12, 0.9],
      [-1.12, -0.42, 1.1],
      [1.12, -0.42, 1],
      [-0.62, -0.66, 0.8],
      [0.62, -0.66, 0.85],
    ])
      cypress(p, x, z, sc);
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
    { zone: 'shore', kit: reeds, density: 0.9, scale: [0.8, 1.25] },
    { zone: 'shore', kit: SCATTER.stones('#a39a88', '#867e70'), density: 0.2 },
    { zone: 'shallows', kit: lotus, density: 0.35, scale: [0.8, 1.3] },
    { zone: 'shallows', kit: reeds, density: 0.25, scale: [0.9, 1.3] },
    { zone: 'shallows', kit: SCATTER.lily('#6f9a5a', '#f2b8c9'), density: 0.12, float: true },
    { zone: 'shallows', kit: ducks, density: 0.04, float: true },
    { zone: 'hill', kit: SCATTER.tuft('#7d935c', '#93a86c'), density: 1.0 },
  ],
  paving: { kind: 'earth', color: '#cfbd98', joint: '#b39f78' },
  people: { clothes: CLOTHES, skin: SKIN },
  clouds: { color: '#f6f3ea', shade: '#cfd2cc', shadow: 0.2 },
};
