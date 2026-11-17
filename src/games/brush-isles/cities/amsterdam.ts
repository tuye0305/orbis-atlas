import * as THREE from 'three';
import { Kit, jitter, loft, pick, type Rng } from '../kit';
import { TREES, plinth, type SeedCell, type Style, SCATTER } from '../styles';

/* ---------------------------------------------------------------- Amsterdam, 1600s */

// The canal city of Berckheyde and Van der Heyden: narrow brick houses shoulder to shoulder,
// their step, neck and bell gables trimmed in white Bentheim sandstone, cross windows with
// red and green shutters, stoops with iron rails, warehouses with hoist beams and loading doors,
// and brick quays under elms and lindens.

type C = THREE.ColorRepresentation;
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const ONE = new THREE.Vector3(1, 1, 1);
const UP = new THREE.Vector3(0, 1, 0);

/* ---------------------------------------------------------------- palette */

const BRICKS = ['#8a3826', '#7c3022', '#6e2a20', '#9a4630', '#a2553a', '#84402c', '#93482f', '#743a2c', '#8e4a34', '#6a3226'];
const DARK_BRICKS = ['#5e2a22', '#542822', '#6a2e24', '#4e2620', '#5a3026'];
const STONE = '#e8dfca';
const STONE2 = '#d3c7ad';
const TAR = '#262220';
const ROOF_RED = ['#9a4429', '#8c3d27', '#a65033', '#7e3a28', '#b05a38'];
const ROOF_BLUE = ['#4a525e', '#3f4652', '#565c66', '#454b52'];
const FRAMES = ['#ece5d4', '#ece5d4', '#e9e1cd', '#e4dccb'];
const OXBLOOD = '#6b2b24';
const GLASS = '#232c35';
const GLASS_HI = '#4d5d6a';
const SHUTTERS = ['#8e2a22', '#2f5a3c', '#7a2420', '#35553f', '#2a4a38', '#9a3a26'];
const DOORS = ['#2c4636', '#4a2320', '#2a2826', '#3a4a3a', '#5a2a22', '#2a3a4a'];
const IRON = '#1d1d1f';
const TIMBER = '#4a3a2c';
const SKIN = '#e8c4a8';

/* ---------------------------------------------------------------- modelling helpers */

/** A kit that passes everything it is given through a matrix into another kit (a wall's own frame). */
class Placed extends Kit {
  private readonly target: Kit;
  private readonly mat: THREE.Matrix4;
  constructor(target: Kit, mat: THREE.Matrix4) {
    super();
    this.target = target;
    this.mat = mat;
  }
  override add(g: THREE.BufferGeometry, color: C, m?: THREE.Matrix4) {
    if (m) g.applyMatrix4(m);
    g.applyMatrix4(this.mat);
    this.target.add(g, color);
    return this;
  }
}
const at = (k: Kit, x: number, y: number, z: number, ry = 0) => new Placed(k, new THREE.Matrix4().compose(V(x, y, z), new THREE.Quaternion().setFromAxisAngle(UP, ry), ONE));

/** A flat rectangle facing +z (two triangles), standing on y. */
function pane(k: Kit, w: number, h: number, x: number, y: number, z: number, color: C, ry = 0) {
  const g = new THREE.PlaneGeometry(w, h);
  g.translate(0, h / 2, 0);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  k.add(g, color);
}

/** A flat disc (or its upper half) facing +z, centred at x, y. */
function disc(k: Kit, r: number, x: number, y: number, z: number, color: C, seg = 8, half = false) {
  const g = new THREE.CircleGeometry(r, seg, 0, half ? Math.PI : Math.PI * 2);
  g.translate(x, y, z);
  k.add(g, color);
}

/** A square-section stick from a to b. */
function beam(k: Kit, a: THREE.Vector3, b: THREE.Vector3, t: number, color: C, t2 = t) {
  const d = new THREE.Vector3().subVectors(b, a);
  const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.normalize());
  const m = new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, ONE);
  k.add(new THREE.BoxGeometry(t, len, t2), color, m);
}

/** A flat outline extruded `depth` thick, centred on z, its y = 0 at y. */
function slab(k: Kit, shape: THREE.Shape, depth: number, x: number, y: number, z: number, color: C, ry = 0) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 });
  g.translate(0, 0, -depth / 2);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  k.add(g, color);
}

const poly = (pts: [number, number][]) => {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
};

/* ---------------------------------------------------------------- gable outlines */
// Each takes the half-width `hw` at the eaves, the height `h` above them, and `e`, an outward
// inflation: the same outline drawn a little larger in stone behind the brick gives it its
// white coping.

function stepShape(hw: number, h: number, steps: number, e: number) {
  const tw = Math.max(0.05, hw * 0.28);
  const L: [number, number][] = [[-hw - e, 0]];
  for (let i = 0; i < steps; i++) {
    const yy = (h * (i + 1)) / (steps + 1) + e;
    L.push([-(hw - (i * (hw - tw)) / steps) - e, yy]);
    L.push([-(hw - ((i + 1) * (hw - tw)) / steps) - e, yy]);
  }
  L.push([-tw - e, h + e]);
  const R = L.map(([x, y]) => [-x, y] as [number, number]).reverse();
  return poly([...L, ...R]);
}

function neckShape(hw: number, h: number, e: number, stone: boolean) {
  const nw = hw * 0.46;
  const sh = h * 0.36;
  const claw = sh + h * 0.27;
  const ped = h * 0.82;
  const s = new THREE.Shape();
  s.moveTo(-hw - e, 0);
  s.lineTo(-hw - e, sh + e);
  if (stone) s.bezierCurveTo(-hw - e, sh + (claw - sh) * 0.75, -nw - e - (hw - nw) * 0.55, sh + (claw - sh) * 0.15, -nw - e, claw);
  else s.lineTo(-nw - e, sh + e);
  if (stone) {
    // the stone pediment that crowns the neck
    s.lineTo(-nw - e, ped);
    s.lineTo(-nw - 0.02 - e, ped);
    s.lineTo(-nw - 0.02 - e, ped + 0.02);
    s.lineTo(0, h + e);
    s.lineTo(nw + 0.02 + e, ped + 0.02);
    s.lineTo(nw + 0.02 + e, ped);
    s.lineTo(nw + e, ped);
    s.lineTo(nw + e, claw);
    s.bezierCurveTo(nw + e + (hw - nw) * 0.55, sh + (claw - sh) * 0.15, hw + e, sh + (claw - sh) * 0.75, hw + e, sh + e);
  } else {
    s.lineTo(-nw - e, ped);
    s.lineTo(nw + e, ped);
    s.lineTo(nw + e, sh + e);
    s.lineTo(hw + e, sh + e);
  }
  s.lineTo(hw + e, 0);
  s.closePath();
  return s;
}

function bellShape(hw: number, h: number, e: number) {
  const nw = Math.min(hw * 0.5, h * 0.4);
  const foot = h * 0.1;
  const neck = h * 0.55;
  const top = h - nw;
  const s = new THREE.Shape();
  s.moveTo(-hw - e, 0);
  s.lineTo(-hw - e, foot + e);
  s.bezierCurveTo(-hw - e, foot + (neck - foot) * 0.6, -nw - e, foot + (neck - foot) * 0.4, -nw - e, neck);
  s.lineTo(-nw - e, top);
  s.absarc(0, top, nw + e, Math.PI, 0, true);
  s.lineTo(nw + e, neck);
  s.bezierCurveTo(nw + e, foot + (neck - foot) * 0.4, hw + e, foot + (neck - foot) * 0.6, hw + e, foot + e);
  s.lineTo(hw + e, 0);
  s.closePath();
  return s;
}

function spoutShape(hw: number, h: number, e: number) {
  const tw = Math.max(0.04, hw * 0.22);
  const sh = h * 0.12;
  return poly([
    [-hw - e, 0], [-hw - e, sh + e], [-tw - e, h - 0.07 + e], [-tw - e, h + e],
    [tw + e, h + e], [tw + e, h - 0.07 + e], [hw + e, sh + e], [hw + e, 0],
  ]);
}

/* ---------------------------------------------------------------- facade parts */

/**
 * A cross window (kruiskozijn): a white frame proud of the wall, four lights; the upper ones
 * glazed and catching the sky, the lower ones glazed or behind closed shutters.
 */
function crossWindow(k: Kit, x: number, y: number, ww: number, wh: number, z: number, frame: C, lower: C, cols = 2) {
  k.box(ww, wh, 0.014, x, y, z + 0.003, frame);
  const b = Math.min(0.014, ww * 0.12);
  const zz = z + 0.0118;
  const up = wh * 0.34;
  const lo = wh - up - b * 3;
  const gw = (ww - b * (cols + 1)) / cols;
  for (let i = 0; i < cols; i++) {
    const px = x - ww / 2 + b + gw / 2 + i * (gw + b);
    pane(k, gw, lo, px, y + b, zz, lower);
    pane(k, gw, up, px, y + 2 * b + lo, zz, GLASS_HI);
  }
}

/** A stone relieving arch over a window, its tympanum filled with brick. */
function reliefArch(k: Kit, x: number, y: number, r: number, z: number, fill: C) {
  disc(k, r, x, y, z + 0.004, STONE, 6, true);
  disc(k, r * 0.62, x, y, z + 0.0055, fill, 5, true);
}

/** Front door in a stone surround with a fanlight. */
function frontDoor(k: Kit, x: number, y: number, z: number, color: C) {
  k.box(0.13, 0.245, 0.014, x, y - 0.01, z + 0.003, STONE);
  pane(k, 0.088, 0.155, x, y, z + 0.0118, color);
  pane(k, 0.088, 0.05, x, y + 0.168, z + 0.0118, GLASS);
}

/** Stone steps up to the door, with iron rails either side. */
function stoop(k: Kit, x: number, z: number) {
  k.box(0.17, 0.035, 0.1, x, 0, z + 0.05, STONE2);
  k.box(0.17, 0.07, 0.05, x, 0, z + 0.025, STONE2);
  for (const sx of [-1, 1]) {
    k.box(0.007, 0.006, 0.1, x + sx * 0.082, 0.13, z + 0.05, IRON);
    k.box(0.007, 0.13, 0.007, x + sx * 0.082, 0, z + 0.097, IRON);
  }
}

/** Hoist beam with its hook, under the top of the gable. */
function hoist(k: Kit, x: number, y: number, z: number) {
  k.box(0.024, 0.024, 0.11, x, y, z + 0.05, TIMBER);
  k.box(0.006, 0.035, 0.006, x, y - 0.035, z + 0.098, IRON);
}

function chimney(k: Kit, x: number, y: number, z: number, h: number, brick: C) {
  k.box(0.085, h, 0.12, x, y, z, brick);
  k.box(0.105, 0.022, 0.14, x, y + h, z, STONE2);
}

/* ---------------------------------------------------------------- the canal house */

type GableKind = 'step' | 'neck' | 'bell' | 'spout' | 'cornice';
interface Spec {
  x: number;
  w: number;
  floors: number[];
  gable: GableKind;
  wall: C;
  roof: C;
  frame: C;
  /** Colour of the lower lights: glass, or closed shutters. */
  lower: C;
  /** Open shutters beside the lower windows. */
  shutter: C | null;
  door: C;
  bays: number;
  doorBay: number;
  /** Hendrick de Keyser's manner: stone bands and relieving arches over the windows. */
  renaissance: boolean;
  quoins: boolean;
  warehouse: boolean;
  grand: boolean;
}

// house body from the street front (z = ZF, facing the water) to the back wall; the strip in
// front is the quay with the stoops
const ZF = 0.3;
const ZB = -0.44;
const HD = ZF - ZB;
const ZC = (ZF + ZB) / 2;
const FLOORS = [0.33, 0.27, 0.25, 0.23, 0.22];
const STORES = [0.3, 0.22, 0.22, 0.21, 0.21, 0.2];

function gabledSpec(r: Rng, x: number, w: number, tall: number): Spec {
  const g = r();
  const gable: GableKind = g < 0.36 ? 'step' : g < 0.7 ? 'neck' : 'bell';
  const n = Math.max(2, Math.min(5, 2 + tall + (r() < 0.5 ? 1 : 0)));
  const renaissance = gable === 'step' ? r() < 0.8 : r() < 0.1;
  const sc = pick(r, SHUTTERS);
  const sm = r();
  const bays = w > 0.6 ? 3 : 2;
  return {
    x,
    w,
    floors: FLOORS.slice(0, n),
    gable,
    wall: jitter(pick(r, BRICKS), r, 0.012, 0.05, 0.06),
    roof: jitter(r() < 0.55 ? pick(r, ROOF_RED) : pick(r, ROOF_BLUE), r, 0.01, 0.04, 0.05),
    frame: renaissance && r() < 0.3 ? OXBLOOD : pick(r, FRAMES),
    lower: sm < 0.4 ? sc : GLASS,
    shutter: sm > 0.72 ? sc : null,
    door: pick(r, DOORS),
    bays,
    doorBay: bays === 3 ? (r() < 0.6 ? 1 : 0) : r() < 0.5 ? 0 : 1,
    renaissance,
    quoins: w > 0.6 && r() < 0.45,
    warehouse: false,
    grand: false,
  };
}

function warehouseSpec(r: Rng, x: number, w: number, tall: number, wall: C, sc: C): Spec {
  return {
    x,
    w,
    floors: STORES.slice(0, Math.min(6, 4 + tall + (r() < 0.5 ? 1 : 0))),
    gable: 'spout',
    wall,
    roof: jitter(pick(r, ROOF_RED), r, 0.01, 0.04, 0.05),
    frame: '#d9d0bc',
    lower: sc,
    shutter: sc,
    door: sc,
    bays: 3,
    doorBay: -1,
    renaissance: false,
    quoins: false,
    warehouse: true,
    grand: false,
  };
}

function cornicedSpec(r: Rng, tall: number): Spec {
  const grand = r() < 0.35;
  const sc = pick(r, SHUTTERS);
  return {
    x: 0,
    w: 0.92,
    floors: FLOORS.slice(0, Math.max(3, Math.min(4, 3 + tall))),
    gable: 'cornice',
    wall: grand && r() < 0.4 ? jitter('#d9ceb4', r, 0.01, 0.03, 0.04) : jitter(pick(r, BRICKS), r, 0.012, 0.05, 0.06),
    roof: jitter(pick(r, ROOF_BLUE), r, 0.01, 0.04, 0.05),
    frame: pick(r, FRAMES),
    lower: r() < 0.3 ? sc : GLASS,
    shutter: r() < 0.3 ? sc : null,
    door: pick(r, DOORS),
    bays: 5,
    doorBay: 2,
    renaissance: false,
    quoins: !grand && r() < 0.4,
    warehouse: false,
    grand,
  };
}

/** One house of the row. Returns the height of its eaves and of its ridge. */
function townhouse(k: Kit, r: Rng, o: Spec, stoops: number[]) {
  const { x, w } = o;
  const hw = w / 2;
  const ys: number[] = [];
  let y = 0.06;
  for (const h of o.floors) {
    ys.push(y);
    y += h;
  }
  const H = y + 0.02;
  k.box(w, H, HD, x, 0, ZC, o.wall);
  // the tarred base of the front
  k.box(w + 0.004, 0.06, 0.012, x, 0, ZF, TAR);
  const pitch = w / o.bays;
  const bx = (i: number) => x - hw + pitch * (i + 0.5);
  const ww = o.renaissance ? Math.min(0.13, pitch * 0.55) : Math.min(0.15, pitch * 0.6);
  const centre = Math.floor(o.bays / 2);
  for (let s = 0; s < o.floors.length; s++) {
    const fh = o.floors[s];
    const y0 = ys[s];
    const wh = fh * (o.renaissance ? (s === 0 ? 0.52 : 0.55) : s === 0 ? 0.6 : 0.66);
    const wy = y0 + (s === 0 ? 0.085 : fh * 0.14);
    if ((o.renaissance || o.grand) && s > 0) k.box(w + 0.006, 0.018, 0.012, x, y0 - 0.006, ZF, STONE);
    if (o.renaissance) k.box(w + 0.006, 0.012, 0.01, x, wy + wh, ZF, STONE);
    if (o.quoins)
      for (const sx of [-1, 1])
        for (let q = 0; q < 2; q++) {
          const long = (s + q) % 2 === 0;
          const qw = long ? 0.075 : 0.045;
          k.box(qw, fh * 0.5 - 0.012, 0.012, x + sx * (hw - qw / 2 + 0.002), y0 + q * fh * 0.5 + 0.006, ZF, STONE);
        }
    for (let b = 0; b < o.bays; b++) {
      const cx = bx(b);
      if (s === 0 && b === o.doorBay) {
        frontDoor(k, cx, 0.075, ZF, o.door);
        stoop(k, cx, ZF);
        stoops.push(cx);
        continue;
      }
      if (o.warehouse) {
        if (b === centre) {
          if (s === 0) {
            // the arched cart door of the warehouse floor
            k.box(0.15, 0.2, 0.014, cx, 0.03, ZF + 0.003, STONE2);
            disc(k, 0.075, cx, 0.23, ZF + 0.004, STONE2, 6, true);
            pane(k, 0.05, 0.17, cx - 0.027, 0.04, ZF + 0.0118, o.door);
            pane(k, 0.05, 0.17, cx + 0.027, 0.04, ZF + 0.0118, o.door);
            disc(k, 0.054, cx, 0.21, ZF + 0.0118, GLASS, 5, true);
          } else {
            // loading doors, one storey above the next, open or shut
            const lh = fh * 0.72;
            const ly = y0 + fh * 0.1;
            k.box(0.13, lh + 0.02, 0.012, cx, ly - 0.01, ZF + 0.002, STONE2);
            if (r() < 0.55) {
              pane(k, 0.054, lh, cx - 0.028, ly, ZF + 0.0105, o.door);
              pane(k, 0.054, lh, cx + 0.028, ly, ZF + 0.0105, o.door);
            } else {
              pane(k, 0.11, lh, cx, ly, ZF + 0.0105, '#16130f');
              pane(k, 0.055, lh, cx - 0.085, ly, ZF + 0.006, o.door);
              pane(k, 0.055, lh, cx + 0.085, ly, ZF + 0.006, o.door);
            }
          }
        } else crossWindow(k, cx, y0 + fh * (s === 0 ? 0.3 : 0.22), 0.075, fh * (s === 0 ? 0.4 : 0.5), ZF, o.frame, o.lower, 1);
        continue;
      }
      const lower = s < 2 ? o.lower : GLASS;
      crossWindow(k, cx, wy, ww, wh, ZF, o.frame, lower);
      if (o.renaissance) reliefArch(k, cx, wy + wh + 0.006, ww / 2 + 0.004, ZF, o.wall);
      if (o.shutter && s < 2) for (const sx of [-1, 1]) pane(k, ww * 0.4, wh * 0.58, cx + sx * (ww * 0.7 + 0.004), wy, ZF + 0.007, o.shutter);
    }
  }
  // a cellar window in the tarred base beside the stoop
  if (!o.warehouse) {
    const cb = o.doorBay === 0 ? 1 : 0;
    pane(k, 0.09, 0.035, bx(cb), 0.012, ZF + 0.0075, '#120f0d');
  }
  // the back: plainer windows, a brick gable
  for (let s = 0; s < o.floors.length; s++)
    for (let b = 0, nb = o.warehouse ? 1 : Math.min(o.bays, 3); b < nb; b++) {
      const cx = x - hw + (w / nb) * (b + 0.5);
      const fh = o.floors[s];
      const by = ys[s] + fh * 0.18;
      pane(k, 0.11, fh * 0.6, cx, by, ZB - 0.004, o.frame, Math.PI);
      for (const sx of [-1, 1]) {
        pane(k, 0.042, fh * 0.3, cx + sx * 0.026, by + 0.012, ZB - 0.007, s === 0 && o.lower !== GLASS ? o.lower : GLASS, Math.PI);
        pane(k, 0.042, fh * 0.19, cx + sx * 0.026, by + fh * 0.6 - 0.012 - fh * 0.19, ZB - 0.007, GLASS_HI, Math.PI);
      }
    }

  /* the top of the front */
  const zs = ZF - 0.02;
  if (o.gable === 'cornice') {
    const cc = o.grand ? STONE : pick(r, ['#e8e0cc', '#ddd2ba', '#e8e0cc', TIMBER]);
    k.box(w - 0.004, 0.045, 0.008, x, H - 0.07, ZF + 0.002, STONE2);
    k.box(w + 0.02, 0.05, HD + 0.03, x, H - 0.02, ZC, cc);
    k.box(w + 0.03, 0.018, HD + 0.045, x, H + 0.012, ZC, cc);
    const rh = 0.3;
    k.hip(w - 0.01, HD - 0.03, rh, { ridge: w * 0.5, k: 1, x, y: H + 0.03, z: ZC }, o.roof);
    chimney(k, 0, H + rh - 0.06, -0.08, 0.18, o.wall);
    k.mark('smoke', 0, H + rh + 0.14, -0.08);
    chimney(k, x + hw - 0.12, H + 0.1, ZC - 0.1, 0.18, o.wall);
    if (o.grand) {
      // Vingboons' manner: stone pilasters and a pediment over the three middle bays
      for (const px of [x - hw + 0.025, x - hw + pitch, x + hw - pitch, x + hw - 0.025]) k.box(0.032, H - 0.22, 0.012, px, 0.12, ZF + 0.004, STONE);
      const ph = 0.16;
      slab(k, poly([[-pitch * 1.6, 0], [pitch * 1.6, 0], [0, ph]]), 0.05, x, H + 0.03, ZF - 0.012, STONE);
      disc(k, 0.035, x, H + 0.03 + ph * 0.4, ZF + 0.0135, GLASS, 8);
      k.sphere(0.022, x, H + 0.04 + ph, ZF - 0.012, STONE, 1, 0);
      for (const sx of [-1, 1]) k.sphere(0.02, x + sx * pitch * 1.55, H + 0.05, ZF - 0.012, STONE, 1, 0);
    } else {
      // a dormer with the hoist door
      const dz = ZF - 0.03;
      k.box(0.16, 0.17, 0.16, x, H + 0.02, dz - 0.08, '#e3dac6');
      k.gable(0.2, 0.19, 0.07, x, H + 0.19, dz - 0.09, o.roof, Math.PI / 2);
      k.tri(V(x - 0.095, H + 0.19, dz + 0.011), V(x + 0.095, H + 0.19, dz + 0.011), V(x, H + 0.26, dz + 0.011), '#e3dac6');
      pane(k, 0.09, 0.13, x, H + 0.04, dz + 0.002, '#1a1612');
      for (const sx of [-1, 1]) pane(k, 0.045, 0.13, x + sx * 0.075, H + 0.04, dz + 0.004, o.lower === GLASS ? pick(r, SHUTTERS) : o.lower);
      hoist(k, x, H + 0.21, dz);
    }
    return { H, ridge: H + 0.03 + rh };
  }

  const gh = o.gable === 'step' ? w * 0.95 : o.gable === 'spout' ? w * 1.05 : w * 1.08;
  const roofH = o.gable === 'step' || o.gable === 'spout' ? gh * 0.96 : gh * 0.8;
  k.gable(HD - 0.03, w - 0.004, roofH, x, H, ZC - 0.012, o.roof, Math.PI / 2);
  k.tri(V(x - hw, H, ZB - 0.001), V(x + hw, H, ZB - 0.001), V(x, H + roofH, ZB - 0.001), o.wall);
  const steps = w > 0.6 ? 5 : 3 + (r() < 0.5 ? 1 : 0);
  const shape = (e: number) =>
    o.gable === 'step' ? stepShape(hw, gh, steps, e) : o.gable === 'neck' ? neckShape(hw, gh, e, e > 0) : o.gable === 'bell' ? bellShape(hw, gh, e) : spoutShape(hw, gh, e);
  slab(k, shape(0), 0.05, x, H, zs, o.wall);
  slab(k, shape(o.warehouse ? 0.01 : 0.016), 0.04, x, H, zs - 0.006, o.warehouse ? STONE2 : STONE);
  // windows and hatches in the gable
  const gy = H + 0.03;
  if (o.warehouse) {
    k.box(0.12, 0.16, 0.012, x, gy, ZF + 0.002, STONE2);
    pane(k, 0.1, 0.15, x, gy + 0.005, ZF + 0.0105, o.door);
    if (gh > 0.4) crossWindow(k, x, gy + 0.21, 0.06, 0.08, ZF, o.frame, o.lower, 1);
    // the little hood over the hoist beam
    k.box(0.09, 0.02, 0.13, x, H + gh - 0.04, ZF + 0.04, o.roof);
    hoist(k, x, H + gh - 0.075, ZF);
  } else {
    if (w > 0.6) {
      for (const sx of [-1, 1]) crossWindow(k, x + sx * pitch * 0.55, gy, ww * 0.9, 0.16, ZF, o.frame, GLASS);
      crossWindow(k, x, gy + 0.22, 0.1, 0.13, ZF, o.frame, GLASS);
    } else if (r() < 0.4) {
      // hoist doors in the gable, shutters open
      pane(k, 0.09, 0.16, x, gy, ZF + 0.0075, '#1a1612');
      for (const sx of [-1, 1]) pane(k, 0.045, 0.16, x + sx * 0.07, gy, ZF + 0.008, o.lower === GLASS ? pick(r, SHUTTERS) : o.lower);
      k.box(0.11, 0.012, 0.016, x, gy + 0.16, ZF, STONE);
    } else crossWindow(k, x, gy, ww * 0.95, 0.16, ZF, o.frame, GLASS);
    if (gh > 0.42 && w <= 0.6) disc(k, 0.028, x, gy + 0.25, ZF + 0.008, GLASS, 8);
    if (o.renaissance && w <= 0.6) reliefArch(k, x, gy + 0.17, ww / 2 + 0.012, ZF, o.wall);
    hoist(k, x, H + gh - (o.gable === 'step' ? 0.05 : o.gable === 'neck' ? gh * 0.2 : gh * 0.26), ZF);
    if (o.gable === 'step') k.sphere(0.02, x, H + gh + 0.035, zs, STONE, 1.4, 0);
    if (o.gable === 'bell') k.sphere(0.024, x, H + gh + 0.03, zs - 0.006, STONE, 1, 0);
  }
  return { H, ridge: H + roofH };
}

/* ---------------------------------------------------------------- quay furniture */

function barrel(k: Kit, x: number, y: number, z: number, lying = false) {
  const c = '#7a5434';
  if (lying) {
    const m = new THREE.Matrix4().compose(V(x, y + 0.032, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2), ONE);
    k.add(new THREE.CylinderGeometry(0.03, 0.03, 0.075, 7), c, m);
  } else {
    k.cyl(0.03, 0.03, 0.075, 7, x, y, z, c);
    k.cyl(0.031, 0.031, 0.008, 7, x, y + 0.06, z, IRON);
  }
}

/** A goods sledge: carts were kept off the city's soft streets, so barrels went by sled. */
function sledge(k: Kit, x: number, z: number, ry: number) {
  const s = at(k, x, 0, z, ry);
  for (const sz of [-0.04, 0.04]) {
    s.box(0.2, 0.014, 0.012, 0, 0, sz, TIMBER);
    beam(s, V(0.1, 0.008, sz), V(0.135, 0.05, sz), 0.012, TIMBER);
  }
  s.box(0.17, 0.012, 0.1, -0.01, 0.014, 0, '#6a5440');
  barrel(s, -0.05, 0.026, 0, true);
  barrel(s, 0.03, 0.026, 0, true);
}

/** Jan van der Heyden's street lamp of 1669 on its post. */
function lantern(k: Kit, x: number, z: number, y = 0) {
  k.cyl(0.008, 0.011, 0.3, 5, x, y, z, '#3a3430');
  k.box(0.04, 0.05, 0.04, x, y + 0.3, z, '#c9bb8a');
  k.cyl(0, 0.032, 0.03, 4, x, y + 0.35, z, IRON, Math.PI / 4);
}

function quayTree(k: Kit, x: number, z: number, r: Rng) {
  k.cyl(0.02, 0.03, 0.78, 5, x, 0, z, '#55432f');
  const g = r() < 0.5 ? '#4d7536' : '#56803c';
  k.sphere(0.24, x, 0.98, z, g, 1.15, 1);
  k.sphere(0.17, x + 0.1, 1.16, z - 0.04, jitter(g, r, 0.02, 0.05, 0.08), 1.1, 0);
  k.sphere(0.15, x - 0.11, 0.86, z + 0.03, jitter(g, r, 0.02, 0.05, 0.08), 1.1, 0);
}

/* ---------------------------------------------------------------- bridges */

const BRIDGE_W = 0.5;

/** A vertical strip at z through points (x, bottom, top). */
function strip(k: Kit, pts: [number, number, number][], z: number, color: C) {
  const pos: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, a0, b0] = pts[i];
    const [x1, a1, b1] = pts[i + 1];
    pos.push(x0, a0, z, x1, a1, z, x1, b1, z, x0, a0, z, x1, b1, z, x0, b0, z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  k.add(g, color);
}

/** A surface through points (x, y) spanning z0 … z1. */
function sheet(k: Kit, pts: [number, number][], z0: number, z1: number, color: C) {
  const pos: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    pos.push(x0, y0, z0, x0, y0, z1, x1, y1, z1, x0, y0, z0, x1, y1, z1, x1, y1, z0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  k.add(g, color);
}

/** A humped brick bridge, one arch per water cell, with white stone arch rings and coping. */
function brickBridge(k: Kit, j: number, n: number) {
  const A = -0.5 - j - 0.2;
  const B = n - j - 0.5 + 0.2;
  const a = j === 0 ? A : -0.5;
  const b = j === n - 1 ? B : 0.5;
  const rise = 0.1 + 0.05 * n;
  const top = (x: number) => 0.33 + rise * Math.sin((Math.PI * (x - A)) / (B - A));
  const half = 0.39;
  const crown = top(0) - 0.1;
  const spring = -0.03;
  const arch = (x: number) => (Math.abs(x) <= half ? spring + (crown - spring) * Math.sqrt(Math.max(0, 1 - (x / half) ** 2)) : -0.45);
  const xs = new Set<number>();
  const SEG = 14;
  for (let i = 0; i <= SEG; i++) xs.add(a + ((b - a) * i) / SEG);
  for (const v of [-half, half, -half * 0.96, half * 0.96, -half - 0.001, half + 0.001]) if (v > a && v < b) xs.add(v);
  const X = [...xs].sort((p, q) => p - q);
  const W = BRIDGE_W / 2;
  const brick = '#8a4632';
  const face: [number, number, number][] = X.map((x) => [x, arch(x), top(x) - 0.02]);
  for (const s of [-1, 1]) strip(k, face, s * W, brick);
  const inner = X.filter((x) => Math.abs(x) <= half);
  for (const s of [-1, 1]) strip(k, inner.map((x) => [x, arch(x), arch(x) + 0.035] as [number, number, number]), s * (W + 0.005), STONE);
  sheet(k, inner.map((x) => [x, arch(x)] as [number, number]), -W, W, '#6e3a2a');
  sheet(k, X.map((x) => [x, top(x)] as [number, number]), -W, W, '#9a6a52');
  for (let i = 0; i < X.length - 1; i++) {
    const x0 = X[i];
    const x1 = X[i + 1];
    if (x1 - x0 < 0.01) continue;
    for (const s of [-1, 1]) {
      const z = s * (W - 0.02);
      beam(k, V(x0 - 0.004, top(x0) + 0.045, z), V(x1 + 0.004, top(x1) + 0.045, z), 0.09, brick, 0.04);
      beam(k, V(x0 - 0.004, top(x0) + 0.1, z), V(x1 + 0.004, top(x1) + 0.1, z), 0.018, STONE, 0.056);
    }
  }
  // close the ends where the deck meets the bank
  if (j === 0) sheet(k, [[A, -0.45], [A, top(A)]], -W, W, brick);
  if (j === n - 1) sheet(k, [[B, -0.45], [B, top(B)]], -W, W, brick);
  // keystones and a lamp at the crown
  for (const s of [-1, 1]) k.box(0.05, 0.06, 0.012, 0, crown - 0.01, s * (W + 0.008), STONE);
  const mid = (A + B) / 2;
  if (mid >= a && mid < b) lantern(k, mid, -W + 0.02, top(mid) + 0.11);
}

/** The double drawbridge over a wide water: timber trestles, a portal and two balance beams. */
function drawBridge(k: Kit, j: number, n: number) {
  const paint = '#e2dccd';
  const deckY = 0.4;
  const A = j === 0 ? -0.7 : -0.5;
  const B = j === n - 1 ? 0.7 : 0.5;
  const W = BRIDGE_W / 2;
  const y = (x: number) => (j === 0 ? Math.min(deckY, 0.33 + ((x + 0.7) / 0.5) * 0.07) : j === n - 1 ? Math.min(deckY, 0.33 + ((0.7 - x) / 0.5) * 0.07) : deckY);
  // deck planks and railings
  const xs = [A, A + (B - A) * 0.25, A + (B - A) * 0.5, A + (B - A) * 0.75, B];
  sheet(k, xs.map((x) => [x, y(x)] as [number, number]), -W, W, '#7a6450');
  for (let i = 0; i < xs.length - 1; i++) {
    beam(k, V(xs[i], y(xs[i]) - 0.025, 0), V(xs[i + 1], y(xs[i + 1]) - 0.025, 0), 0.05, '#5a4636', BRIDGE_W);
    for (const s of [-1, 1]) {
      beam(k, V(xs[i], y(xs[i]) + 0.11, s * W), V(xs[i + 1], y(xs[i + 1]) + 0.11, s * W), 0.016, paint);
      beam(k, V(xs[i], y(xs[i]) + 0.055, s * W), V(xs[i + 1], y(xs[i + 1]) + 0.055, s * W), 0.01, paint);
    }
  }
  if (j !== 1) {
    // trestles of piles
    for (const px of [-0.25, 0.2]) {
      for (const s of [-1, 1]) k.cyl(0.018, 0.02, y(px) + 0.4, 5, px, -0.4, s * (W - 0.04), '#3e3228');
      k.box(0.04, 0.035, BRIDGE_W, px, y(px) - 0.085, 0, '#3e3228');
      beam(k, V(px, -0.05, -W + 0.04), V(px, y(px) - 0.07, W - 0.04), 0.014, '#3e3228');
    }
    for (let i = 0; i <= 4; i++) {
      const px = A + ((B - A) * i) / 4;
      for (const s of [-1, 1]) k.box(0.018, 0.12, 0.018, px, y(px), s * W, paint);
    }
    return;
  }
  // the movable middle: stone piers, two portals, balance beams and chains
  for (const sx of [-1, 1]) {
    const px = sx * 0.42;
    k.box(0.14, 0.8, BRIDGE_W + 0.08, px, -0.42, 0, '#8a8274');
    k.box(0.16, 0.025, BRIDGE_W + 0.1, px, 0.375, 0, STONE2);
    for (const s of [-1, 1]) k.box(0.05, 0.68, 0.05, px, deckY, s * (W + 0.03), paint);
    k.box(0.06, 0.06, BRIDGE_W + 0.12, px, deckY + 0.66, 0, paint);
    // the balance: two beams joined at both ends, the counterweight over the fixed span
    const tip = sx * 0.04;
    const tail = sx * 0.78;
    const by = deckY + 0.76;
    for (const s of [-1, 1]) {
      beam(k, V(tail, by + 0.03, s * (W - 0.02)), V(tip, by - 0.03, s * (W - 0.02)), 0.04, paint);
      beam(k, V(tip, by - 0.05, s * (W - 0.02)), V(tip, deckY + 0.02, s * (W - 0.02)), 0.008, IRON);
    }
    k.box(0.04, 0.04, BRIDGE_W - 0.02, tip, by - 0.06, 0, paint);
    k.box(0.1, 0.08, BRIDGE_W - 0.02, tail, by - 0.02, 0, paint);
    for (const s of [-1, 1]) beam(k, V(px, deckY + 0.66, s * (W - 0.02)), V(px, by, s * (W - 0.02)), 0.03, paint);
  }
  for (const s of [-1, 1]) k.box(0.84, 0.012, 0.016, 0, deckY + 0.11, s * W, paint);
}

/* ---------------------------------------------------------------- boats */

/**
 * A flat-bottomed Dutch hull along x (bow at +x): full, rounded bows that sweep up, a transom
 * stern. Built as an open loft with a coloured top strake.
 */
function hull(k: Kit, L: number, B: number, sheer: number, color: C, strake: C) {
  const N = 9;
  const low: THREE.Vector3[][] = [];
  const portTop: THREE.Vector3[][] = [];
  const stbTop: THREE.Vector3[][] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = -L / 2 + L * t;
    const bow = Math.max(0, (t - 0.62) / 0.38);
    const stern = Math.max(0, (0.18 - t) / 0.18);
    const hb = Math.max(0.006, (B / 2) * (1 - 0.9 * bow ** 2.2) * (1 - 0.22 * stern ** 2));
    const s = sheer + 0.08 * bow ** 2.5 + 0.02 * stern ** 2;
    const keel = -0.07 + 0.05 * bow ** 2;
    low.push([V(x, s - 0.025, -hb), V(x, -0.025, -hb * 0.95), V(x, keel, -hb * 0.55), V(x, keel, hb * 0.55), V(x, -0.025, hb * 0.95), V(x, s - 0.025, hb)]);
    portTop.push([V(x, s, -hb - 0.002), V(x, s - 0.026, -hb - 0.002)]);
    stbTop.push([V(x, s, hb + 0.002), V(x, s - 0.026, hb + 0.002)]);
  }
  k.add(loft(low, false), color);
  k.add(loft(portTop, false), strake);
  k.add(loft(stbTop, false), strake);
  // the transom
  const r0 = low[0];
  for (let i = 1; i < r0.length - 1; i++) k.tri(r0[0], r0[i], r0[i + 1], color);
  k.tri(portTop[0][0], r0[0], r0[5], strake);
  k.tri(portTop[0][0], r0[5], stbTop[0][0], strake);
  return { stern: -L / 2, bow: L / 2 };
}

function person(k: Kit, x: number, y: number, z: number, coat: C, hat = true) {
  k.cyl(0.02, 0.028, 0.085, 6, x, y, z, coat);
  k.cyl(0.024, 0.024, 0.008, 6, x, y + 0.083, z, '#efeadf');
  k.sphere(0.017, x, y + 0.104, z, SKIN, 1, 0);
  if (hat) {
    k.cyl(0.028, 0.028, 0.005, 7, x, y + 0.115, z, '#1c1a1a');
    k.cyl(0.014, 0.016, 0.026, 6, x, y + 0.118, z, '#1c1a1a');
  }
}

const COATS = ['#2a2a2e', '#3a3430', '#5a3a2a', '#2e3a4a', '#6a2a24'];

/** The trekschuit: the horse-towed passenger barge between the Holland towns, with its cabin. */
function trekschuit(k: Kit, rng: Rng) {
  hull(k, 1.04, 0.22, 0.05, '#3a2c22', pick(rng, ['#2f5a3c', '#8a2a22', '#c49a42']));
  k.box(0.86, 0.012, 0.2, 0, 0.02, 0, '#7a6450');
  const cab = '#7a5a3a';
  k.box(0.46, 0.1, 0.19, -0.15, 0.03, 0, cab);
  k.gable(0.48, 0.21, 0.04, -0.15, 0.13, 0, '#2e2a28');
  for (const s of [-1, 1]) {
    pane(k, 0.4, 0.045, -0.15, 0.075, s * 0.0955, '#d9cdb0', s < 0 ? Math.PI : 0);
    for (let i = 0; i < 5; i++) pane(k, 0.055, 0.032, -0.15 - 0.16 + i * 0.08, 0.082, s * 0.097, GLASS, s < 0 ? Math.PI : 0);
  }
  k.cyl(0.008, 0.011, 0.34, 4, 0.26, 0.02, 0, TIMBER);
  person(k, -0.44, 0.02, 0, pick(rng, COATS));
  k.box(0.012, 0.02, 0.012, -0.5, 0.06, 0, TIMBER);
  beam(k, V(-0.53, 0.0, 0), V(-0.53, 0.1, 0), 0.02, TIMBER, 0.08);
}

/** A sailing barge: leeboards, a spritsail and a staysail, a cargo of barrels, peat or cheese. */
function barge(k: Kit, rng: Rng) {
  const L = 0.9;
  const B = 0.3;
  hull(k, L, B, 0.06, pick(rng, ['#4b3526', '#3a2c22', '#5a4030']), pick(rng, ['#2f5a3c', '#8a2a22', '#c49a42', '#2a3a5a']));
  k.box(L * 0.82, 0.012, B * 0.84, -0.02, 0.02, 0, '#7a6450');
  // leeboards on both sides, half raised
  const lb = new THREE.Shape();
  lb.moveTo(-0.025, 0);
  lb.lineTo(0.025, 0);
  lb.quadraticCurveTo(0.075, -0.1, 0.065, -0.17);
  lb.quadraticCurveTo(0, -0.24, -0.065, -0.17);
  lb.quadraticCurveTo(-0.075, -0.1, -0.025, 0);
  for (const s of [-1, 1]) {
    const g = new THREE.ExtrudeGeometry(lb, { depth: 0.012, bevelEnabled: false, curveSegments: 3 });
    g.rotateZ(-0.7);
    g.translate(0.1, 0.08, s * (B / 2 + 0.012) - 0.006);
    k.add(g, '#3a2a20');
  }
  // mast, sprit and sails
  const mx = 0.14;
  k.cyl(0.009, 0.013, 1.0, 5, mx, 0.02, 0, TIMBER);
  const sail = pick(rng, ['#a0653a', '#c08a52', '#e6d8b8', '#8a4a2e', '#d8c49a']);
  const peak = V(-0.3, 1.02, 0.13);
  const clew = V(-0.33, 0.2, 0.15);
  k.tri(V(mx - 0.012, 0.16, 0), V(mx - 0.012, 0.88, 0), peak, sail);
  k.tri(V(mx - 0.012, 0.16, 0), peak, clew, sail);
  beam(k, V(mx, 0.2, 0.01), peak, 0.012, TIMBER);
  k.tri(V(mx + 0.012, 0.84, 0), V(0.47, 0.15, 0), V(mx + 0.06, 0.16, 0.05), sail);
  k.tri(V(mx, 1.0, 0), V(mx, 0.97, 0), V(mx - 0.2, 0.99, 0.03), '#b8322a');
  // cargo
  const cargo = rng();
  if (cargo < 0.35) for (let i = 0; i < 4; i++) barrel(k, -0.3 + (i % 2) * 0.07, 0.03, (Math.floor(i / 2) - 0.5) * 0.08);
  else if (cargo < 0.65) for (let i = 0; i < 3; i++) k.box(0.1, 0.07, 0.2, -0.32 + i * 0.1, 0.03, 0, jitter('#4a3426', rng));
  else for (let i = 0; i < 6; i++) k.sphere(0.03, -0.33 + (i % 3) * 0.065, 0.05, ((i / 3) | 0) * 0.07 - 0.035, '#e0b44a', 0.7, 0);
  person(k, -0.38, 0.03, 0.04, pick(rng, COATS));
  beam(k, V(-0.44, 0.1, 0), V(-0.3, 0.12, 0.03), 0.01, TIMBER);
  beam(k, V(-0.47, -0.06, 0), V(-0.47, 0.12, 0), 0.025, '#3a2a20', 0.09);
}

/** A rowing boat with a rower and a passenger in his good hat. */
function rowboat(k: Kit, rng: Rng) {
  hull(k, 0.48, 0.17, 0.045, pick(rng, ['#6a4e34', '#4a5a4a', '#5a3a2a']), pick(rng, ['#e0d6c0', '#2f5a3c', '#8a2a22']));
  k.box(0.04, 0.008, 0.16, 0.06, 0.03, 0, '#7a6450');
  k.box(0.04, 0.008, 0.16, -0.14, 0.03, 0, '#7a6450');
  person(k, 0.06, 0.0, 0, pick(rng, COATS), false);
  if (rng() < 0.7) person(k, -0.15, 0.0, 0, pick(rng, COATS));
  for (const s of [-1, 1]) beam(k, V(0.06, 0.06, s * 0.075), V(-0.02, -0.01, s * 0.3), 0.01, '#8a6a44');
}

/* ---------------------------------------------------------------- trees */

const AMS_TREES: Record<string, (k: Kit) => void> = {
  ...TREES,
  /** A canal linden: a tall clean trunk under a dense oval crown. */
  linden(k) {
    k.cyl(0.024, 0.036, 0.62, 5, 0, 0, 0, '#5a4636');
    k.sphere(0.27, 0, 0.86, 0, '#4d7536', 1.25, 1);
    k.sphere(0.19, 0.1, 1.08, 0.05, '#5c8842', 1.1, 1);
    k.sphere(0.17, -0.12, 0.8, -0.06, '#43692f', 1.1, 1);
  },
  /** A Dutch elm: the trunk forks into a wide vase of a crown. */
  iep(k) {
    k.cyl(0.03, 0.045, 0.42, 5, 0, 0, 0, '#5e4a38');
    beam(k, V(0, 0.38, 0), V(0.14, 0.7, 0.04), 0.035, '#5e4a38');
    beam(k, V(0, 0.38, 0), V(-0.12, 0.68, -0.06), 0.035, '#5e4a38');
    k.sphere(0.24, 0.15, 0.82, 0.05, '#527a3a', 0.75, 1);
    k.sphere(0.24, -0.14, 0.8, -0.07, '#4a7034', 0.75, 1);
    k.sphere(0.22, 0, 0.94, 0, '#5f8a44', 0.7, 1);
  },
  /** A pollard willow by the ditch: a stout stump and a head of thin silvery shoots. */
  knotwilg(k) {
    k.cyl(0.05, 0.06, 0.32, 6, 0, 0, 0, '#6a5a46');
    k.sphere(0.07, 0, 0.33, 0, '#6a5a46', 0.8, 0);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const lean = 0.25 + (i % 3) * 0.12;
      m.compose(V(Math.cos(a) * 0.06, 0.52, Math.sin(a) * 0.06), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(a) * lean, 0, -Math.cos(a) * lean)), ONE);
      k.add(new THREE.ConeGeometry(0.035, 0.42, 3), i % 2 ? '#93ab72' : '#a6bb84', m);
    }
    k.sphere(0.16, 0, 0.62, 0, '#9cb27a', 0.9, 1);
  },
  /** An alder: a narrow, dark oval. */
  els(k) {
    k.cyl(0.022, 0.03, 0.36, 5, 0, 0, 0, '#4e4034');
    k.sphere(0.2, 0, 0.66, 0, '#3f6334', 1.5, 1);
    k.sphere(0.13, 0.06, 0.86, 0.03, '#4a7038', 1.3, 0);
  },
};

/* ---------------------------------------------------------------- ground scatter */

function cow(base: string, patch: string) {
  return (k: Kit) => {
    k.box(0.15, 0.065, 0.065, 0, 0.045, 0, base);
    k.box(0.07, 0.066, 0.067, -0.02, 0.046, 0, patch);
    k.box(0.04, 0.03, 0.068, 0.05, 0.07, 0, patch);
    for (const [lx, lz] of [[0.055, 0.022], [0.055, -0.022], [-0.055, 0.022], [-0.055, -0.022]]) k.box(0.014, 0.05, 0.014, lx, 0, lz, base);
    // head down in the grass
    beam(k, V(0.07, 0.08, 0), V(0.105, 0.03, 0), 0.036, base, 0.032);
    k.box(0.035, 0.03, 0.03, 0.11, 0.005, 0, patch);
    k.box(0.008, 0.012, 0.05, 0.1, 0.06, 0, '#e8e0cc');
  };
}

function sheep(k: Kit) {
  k.sphere(0.05, 0, 0.065, 0, '#e8e2d2', 0.75, 0);
  k.sphere(0.03, 0.025, 0.075, 0.015, '#ece6d8', 0.8, 0);
  k.box(0.03, 0.03, 0.026, 0.06, 0.04, 0, '#3a3430');
  for (const [lx, lz] of [[0.025, 0.018], [0.025, -0.018], [-0.025, 0.018], [-0.025, -0.018]]) k.box(0.01, 0.04, 0.01, lx, 0, lz, '#3a3430');
}

/** A hay barrack: the haystack under a roof that slides up and down four poles. */
function hooiberg(k: Kit) {
  for (const [px, pz] of [[0.15, 0.15], [-0.15, 0.15], [0.15, -0.15], [-0.15, -0.15]]) k.cyl(0.01, 0.012, 0.56, 4, px, 0, pz, '#5a4a38');
  k.cyl(0.15, 0.16, 0.3, 7, 0, 0, 0, '#c8ac62');
  k.sphere(0.15, 0, 0.3, 0, '#d0b46a', 0.5, 0);
  k.cyl(0, 0.25, 0.16, 4, 0, 0.42, 0, '#6e6248', Math.PI / 4);
}

function reeds(a: string, b: string, h: number) {
  return (k: Kit) => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < 11; i++) {
      const ang = i * 2.4;
      const r = 0.015 + (i % 4) * 0.018;
      const hh = h * (0.7 + ((i * 5) % 4) * 0.12);
      m.compose(V(Math.cos(ang) * r, hh / 2, Math.sin(ang) * r), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.sin(ang) * 0.12, 0, Math.cos(ang) * 0.12)), ONE);
      k.add(new THREE.CylinderGeometry(0.002, 0.007, hh, 3), i % 2 ? a : b, m);
      if (i % 4 === 0) k.sphere(0.011, Math.cos(ang) * r, hh * 0.98, Math.sin(ang) * r, '#7a5a3a', 2.2, 0);
    }
  };
}

function mooringPost(k: Kit) {
  k.cyl(0.02, 0.024, 0.16, 6, 0, -0.04, 0, '#3e3228');
  k.cyl(0.026, 0.022, 0.015, 6, 0, 0.12, 0, '#2a2220');
}

/* ---------------------------------------------------------------- the Zuiderkerk */

/** A tall round-headed church window in its stone frame, in the wall's own frame (facing +z). */
function churchWindow(k: Kit, u: number, y: number, ww: number, wh: number, glass: C) {
  k.box(ww + 0.04, wh, 0.014, u, y, 0.003, STONE);
  disc(k, ww / 2 + 0.02, u, y + wh, 0.006, STONE, 8, true);
  pane(k, ww, wh - 0.02, u, y + 0.02, 0.0118, glass);
  disc(k, ww / 2, u, y + wh, 0.0118, glass, 8, true);
  pane(k, 0.01, wh + ww * 0.4, u, y + 0.02, 0.013, STONE);
  for (const f of [0.38, 0.72]) pane(k, ww, 0.009, u, y + wh * f, 0.013, STONE);
}

function triangleGable(k: Kit, hw: number, h: number, x: number, y: number, z: number, ry: number, brick: C) {
  slab(k, poly([[-hw, 0], [hw, 0], [0, h]]), 0.04, x, y, z, brick, ry);
  slab(k, poly([[-hw - 0.025, -0.001], [hw + 0.025, -0.001], [0, h + 0.03]]), 0.03, x - Math.sin(ry) * 0.01, y, z - Math.cos(ry) * 0.01, STONE, ry);
}

function zuiderkerk(k: Kit) {
  const brick = '#86392a';
  const roof = '#4b5360';
  const lead = '#55625f';
  const glass = '#3c4a54';
  const gold = '#d4a845';
  // the court and its churchyard
  plinth(k, 2.9, 2.9, '#5d574e');
  k.box(2.9, 0.03, 2.9, 0, 0, 0, '#a99c88');
  for (const sx of [-1, 1]) {
    k.box(0.56, 0.012, 2.3, sx * 1.07, 0.03, -0.12, '#6f9446');
    for (let i = 0; i < 12; i++) {
      const gx = sx * (0.92 + (i % 2) * 0.28);
      const gz = -1.1 + Math.floor(i / 2) * 0.36;
      k.box(0.12, 0.014, 0.2, gx, 0.035, gz, i % 3 ? '#b9b2a2' : '#9c968a');
    }
  }
  // flagged path to the tower door
  k.box(0.3, 0.008, 0.26, 0, 0.03, 1.3, '#c4baa6');
  // a low wall with stone coping, a gate with two stone balls (skulls on the real one of 1570)
  const wall = (w: number, d: number, x: number, z: number) => {
    k.box(w, 0.12, d, x, 0.03, z, brick);
    k.box(w + 0.02, 0.02, d + 0.02, x, 0.15, z, STONE2);
  };
  wall(1.22, 0.06, -0.83, 1.41);
  wall(1.22, 0.06, 0.83, 1.41);
  wall(0.06, 2.82, -1.41, 0);
  wall(0.06, 2.82, 1.41, 0);
  wall(2.82, 0.06, 0, -1.41);
  for (const sx of [-1, 1]) {
    k.box(0.1, 0.3, 0.1, sx * 0.19, 0.03, 1.41, STONE2);
    k.sphere(0.04, sx * 0.19, 0.37, 1.41, '#eee8da', 1, 0);
  }
  k.box(0.48, 0.05, 0.1, 0, 0.27, 1.41, STONE2);
  // lindens in the corners of the yard
  for (const [tx, tz] of [[-1.15, 1.12], [1.15, 1.12], [-1.15, -1.15], [1.15, -1.15]]) {
    k.cyl(0.025, 0.04, 0.6, 5, tx, 0.03, tz, '#5a4636');
    k.sphere(0.26, tx, 0.86, tz, '#4d7536', 1.2, 1);
    k.sphere(0.17, tx + 0.1, 1.05, tz - 0.04, '#5c8842', 1.1, 1);
  }

  /* the church: a brick hall with sandstone dressings and a row of cross gables down each side */
  const BX = 0.72;
  const Z0 = -1.32;
  const Z1 = 0.56;
  const L = Z1 - Z0;
  const zc = (Z0 + Z1) / 2;
  const EH = 0.89;
  k.box(BX * 2, EH - 0.03, L, 0, 0.03, zc, brick);
  k.box(BX * 2 + 0.03, 0.07, L + 0.03, 0, 0.03, zc, STONE2);
  k.box(BX * 2 + 0.02, 0.02, L + 0.02, 0, 0.62, zc, STONE);
  k.box(BX * 2 + 0.04, 0.035, L + 0.04, 0, EH - 0.035, zc, STONE);
  const bays = 5;
  const bl = L / bays;
  for (let b = 0; b < bays; b++) {
    const bz = Z0 + bl * (b + 0.5);
    for (const sx of [-1, 1]) {
      const face = at(k, sx * BX, 0, bz, (sx * Math.PI) / 2);
      churchWindow(face, 0, 0.14, 0.15, 0.42, glass);
      // the cross gable over the bay
      k.gable(0.5, bl - 0.03, 0.26, sx * 0.49, EH, bz, roof);
      triangleGable(k, (bl - 0.03) / 2, 0.26, sx * (BX + 0.005), EH, bz, (sx * Math.PI) / 2, brick);
      disc(at(k, sx * (BX + 0.028), EH + 0.08, bz, (sx * Math.PI) / 2), 0.045, 0, 0, 0, STONE, 8);
      disc(at(k, sx * (BX + 0.03), EH + 0.08, bz, (sx * Math.PI) / 2), 0.03, 0, 0, 0, glass, 8);
      k.sphere(0.022, sx * (BX + 0.005), EH + 0.29, bz, STONE, 1.3, 0);
    }
  }
  // pilaster strips between the bays and quoins at the corners
  for (let b = 0; b <= bays; b++) {
    const pz = Z0 + bl * b;
    for (const sx of [-1, 1]) k.box(0.02, EH - 0.12, 0.05, sx * (BX + 0.008), 0.08, pz, b === 0 || b === bays ? STONE2 : '#7a3326');
  }
  // the nave roof and its end gables
  k.gable(L + 0.02, 1.12, 0.8, 0, EH, zc, roof, Math.PI / 2);
  triangleGable(k, 0.56, 0.8, 0, EH, Z0 - 0.005, Math.PI, brick);
  churchWindow(at(k, 0, EH + 0.08, Z0 - 0.025, Math.PI), 0, 0, 0.13, 0.26, glass);
  k.sphere(0.03, 0, EH + 0.84, Z0, STONE, 1.3, 0);
  triangleGable(k, 0.56, 0.8, 0, EH, Z1 + 0.005, 0, brick);
  for (const sx of [-1, 1]) churchWindow(at(k, sx * 0.42, 0, Z0, Math.PI), 0, 0.14, 0.15, 0.42, glass);
  for (const sx of [-1, 1]) churchWindow(at(k, sx * 0.5, 0, Z1, 0), 0, 0.14, 0.13, 0.4, glass);

  /* the tower: square brick base, an open octagon on columns, the clock stage, the lead lantern, the spire */
  const TZ = 0.87;
  const TS = 0.62;
  const TH = 1.89;
  k.box(TS, TH - 0.03, TS, 0, 0.03, TZ, brick);
  k.box(TS + 0.04, 0.09, TS + 0.04, 0, 0.03, TZ, STONE2);
  for (const by of [0.68, 1.3]) k.box(TS + 0.016, 0.028, TS + 0.016, 0, by, TZ, STONE);
  k.box(TS + 0.06, 0.05, TS + 0.06, 0, TH - 0.05, TZ, STONE);
  for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]])
    for (let i = 0; i < 14; i++) {
      const long = i % 2 === 0;
      const yy = 0.12 + i * 0.12;
      if (yy > TH - 0.1) break;
      k.box(long ? 0.1 : 0.045, 0.06, long ? 0.045 : 0.1, cx * (TS / 2 - (long ? 0.05 : 0.0225) + 0.006), yy, TZ + cz * (TS / 2 - (long ? 0.0225 : 0.05) + 0.006), STONE);
    }
  // door and windows on three faces
  const front = at(k, 0, 0, TZ + TS / 2, 0);
  front.box(0.18, 0.26, 0.014, 0, 0.09, 0.003, STONE);
  disc(front, 0.09, 0, 0.35, 0.006, STONE, 8, true);
  pane(front, 0.12, 0.24, 0, 0.1, 0.0118, '#2c3a30');
  disc(front, 0.06, 0, 0.34, 0.0118, glass, 6, true);
  for (const [fx, fz, ry] of [[0, TS / 2, 0], [TS / 2, 0, Math.PI / 2], [-TS / 2, 0, -Math.PI / 2]] as const) {
    const f = at(k, fx, 0, TZ + fz, ry);
    churchWindow(f, 0, 0.82, 0.12, 0.3, glass);
    churchWindow(f, 0, 1.42, 0.12, 0.3, glass);
  }
  // balustrade round the top of the square, with urns on the corners
  for (let side = 0; side < 4; side++) {
    const ry = (side * Math.PI) / 2;
    const f = at(k, 0, TH, TZ, ry);
    f.box(TS + 0.04, 0.02, 0.03, 0, 0.09, TS / 2 + 0.01, STONE);
    for (let i = 0; i < 7; i++) f.box(0.016, 0.09, 0.016, -TS / 2 + 0.09 + i * 0.074, 0, TS / 2 + 0.01, STONE);
  }
  for (const [cx, cz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    k.box(0.06, 0.12, 0.06, cx * (TS / 2 + 0.01), TH, TZ + cz * (TS / 2 + 0.01), STONE);
    k.sphere(0.03, cx * (TS / 2 + 0.01), TH + 0.16, TZ + cz * (TS / 2 + 0.01), STONE, 1.3, 0);
  }
  // the open stone octagon on its columns
  const O = Math.PI / 8;
  let y = TH;
  k.cyl(0.27, 0.28, 0.05, 8, 0, y, TZ, STONE, O);
  y += 0.05;
  k.cyl(0.19, 0.19, 0.5, 8, 0, y, TZ, '#2a2e33', O);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + O;
    k.cyl(0.018, 0.022, 0.46, 6, Math.sin(a) * 0.245, y, TZ + Math.cos(a) * 0.245, STONE);
    const f = (i * Math.PI) / 4;
    k.box(0.16, 0.07, 0.03, Math.sin(f) * 0.215, y + 0.39, TZ + Math.cos(f) * 0.215, STONE, f);
    for (const ly of [0.14, 0.24]) k.box(0.13, 0.012, 0.03, Math.sin(f) * 0.19, y + ly, TZ + Math.cos(f) * 0.19, '#6a6258', f);
  }
  y += 0.46;
  k.cyl(0.28, 0.26, 0.07, 8, 0, y, TZ, STONE, O);
  y += 0.07;
  // the clock stage
  k.cyl(0.2, 0.215, 0.36, 8, 0, y, TZ, STONE, O);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + O;
    k.box(0.028, 0.34, 0.028, Math.sin(a) * 0.205, y, TZ + Math.cos(a) * 0.205, STONE2, a);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const f = at(k, Math.sin(a) * 0.198, y + 0.18, TZ + Math.cos(a) * 0.198, a);
    disc(f, 0.085, 0, 0, 0.002, gold, 12);
    disc(f, 0.074, 0, 0, 0.004, '#22304a', 12);
    pane(f, 0.008, 0.06, 0, -0.004, 0.006, gold);
    pane(f, 0.045, 0.008, 0.02, -0.004, 0.006, gold);
  }
  y += 0.36;
  k.cyl(0.235, 0.22, 0.05, 8, 0, y, TZ, STONE, O);
  y += 0.05;
  // the lead-clad lantern with its arched openings
  k.cyl(0.15, 0.165, 0.42, 8, 0, y, TZ, lead, O);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + O;
    k.cyl(0.012, 0.014, 0.4, 5, Math.sin(a) * 0.168, y, TZ + Math.cos(a) * 0.168, '#7d8a85');
    const f = (i * Math.PI) / 4;
    const p = at(k, Math.sin(f) * 0.15, y, TZ + Math.cos(f) * 0.15, f);
    pane(p, 0.06, 0.2, 0, 0.1, 0.004, '#1e2326');
    disc(p, 0.03, 0, 0.3, 0.004, '#1e2326', 5, true);
  }
  y += 0.42;
  k.cyl(0.19, 0.17, 0.04, 8, 0, y, TZ, '#6d7a76', O);
  y += 0.04;
  // the spire: a swelling bulb, a small open lantern, then the needle
  const prof: [number, number][] = [
    [0.17, 0], [0.15, 0.04], [0.1, 0.1], [0.085, 0.16], [0.13, 0.26], [0.135, 0.31], [0.11, 0.39], [0.06, 0.47],
    [0.038, 0.5], [0.055, 0.52], [0.055, 0.63], [0.034, 0.65], [0.022, 0.8], [0.011, 0.98], [0.002, 1.08],
  ];
  const lathe = new THREE.LatheGeometry(prof.map(([px, py]) => new THREE.Vector2(px, py)), 8, O);
  lathe.translate(0, y, TZ);
  k.add(lathe, lead);
  k.cyl(0.058, 0.058, 0.012, 8, 0, y + 0.52, TZ, gold, O);
  k.sphere(0.03, 0, y + 1.07, TZ, gold, 1, 1);
  k.cyl(0.005, 0.006, 0.2, 4, 0, y + 1.07, TZ, gold);
  pane(k, 0.07, 0.035, 0.035, y + 1.2, TZ, gold);
}

/* ---------------------------------------------------------------- the polder mill */

function polderMill(rng: Rng) {
  const k = new Kit();
  plinth(k, 0.7, 0.7, '#5d574e');
  const O = Math.PI / 8;
  // brick base and the stage (stelling) round it
  k.cyl(0.33, 0.35, 0.3, 8, 0, 0, 0, jitter('#7c3a2a', rng, 0.01, 0.04, 0.05), O);
  k.box(0.12, 0.2, 0.03, 0, 0.0, 0.33, '#2f2a24');
  k.cyl(0.47, 0.47, 0.025, 8, 0, 0.3, 0, '#5a4a3a', O);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + O;
    const b = ((i + 1) * Math.PI) / 4 + O;
    k.box(0.012, 0.08, 0.012, Math.sin(a) * 0.45, 0.325, Math.cos(a) * 0.45, TIMBER);
    beam(k, V(Math.sin(a) * 0.45, 0.4, Math.cos(a) * 0.45), V(Math.sin(b) * 0.45, 0.4, Math.cos(b) * 0.45), 0.012, TIMBER);
    beam(k, V(Math.sin(a) * 0.33, 0.12, Math.cos(a) * 0.33), V(Math.sin(a) * 0.45, 0.3, Math.cos(a) * 0.45), 0.018, TIMBER);
  }
  // the thatched octagon with its corner posts
  const thatch = jitter('#6e6550', rng, 0.01, 0.05, 0.06);
  const y0 = 0.32;
  const y1 = 1.12;
  const r0 = 0.28;
  const r1 = 0.19;
  k.cyl(r1, r0, y1 - y0, 8, 0, y0, 0, thatch, O);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + O;
    beam(k, V(Math.sin(a) * (r0 + 0.006), y0, Math.cos(a) * (r0 + 0.006)), V(Math.sin(a) * (r1 + 0.006), y1, Math.cos(a) * (r1 + 0.006)), 0.022, '#3e3428');
  }
  k.box(0.1, 0.16, 0.04, 0, 0.33, 0.265, '#3a2f26');
  k.box(0.05, 0.06, 0.03, 0.0, 0.75, 0.225, '#2a2622');
  // the cap, turned to the wind, its windshaft
  k.cyl(0.22, 0.22, 0.04, 8, 0, y1, 0, '#4a3a2c', O);
  k.hip(0.54, 0.42, 0.22, { ridge: 0.26, k: 0.7, y: y1 + 0.04, z: 0.02, ry: Math.PI / 2 }, jitter('#4e4a3c', rng, 0.01, 0.04, 0.05));
  k.box(0.06, 0.06, 0.44, 0, 1.2, 0.29, '#4a3a2c');
  // the tail pole and its struts down to the stage, with the winding wheel
  const foot = V(0, 0.34, -0.47);
  beam(k, V(0, 1.15, -0.2), foot, 0.035, '#5a4a3a');
  for (const sx of [-1, 1]) beam(k, V(sx * 0.17, 1.12, -0.06), V(0, 0.62, -0.38), 0.022, '#5a4a3a');
  const wheel = new THREE.TorusGeometry(0.07, 0.008, 4, 10);
  wheel.rotateY(Math.PI / 2);
  wheel.translate(0, 0.43, -0.47);
  k.add(wheel, '#4a3a2c');
  beam(k, V(0, 0.36, -0.47), V(0, 0.5, -0.47), 0.008, '#4a3a2c');
  beam(k, V(0, 0.43, -0.54), V(0, 0.43, -0.4), 0.008, '#4a3a2c');
  const body = k.build();

  // sails: two stocks through the hub, a lattice on each arm, sailcloth spread behind it
  const s = new Kit();
  s.box(0.09, 0.09, 0.08, 0, -0.045, 0, '#3a2a20');
  const stockC = '#5a4636';
  const lattice = '#6e5a44';
  const cloth = pick(rng, ['#ebe1cb', '#e6d8bc', '#ddd0b4']);
  s.add(new THREE.BoxGeometry(0.035, 1.7, 0.03), stockC);
  s.add(new THREE.BoxGeometry(1.7, 0.035, 0.03), stockC);
  for (let i = 0; i < 4; i++) {
    const m = new THREE.Matrix4().makeRotationZ((i / 4) * Math.PI * 2);
    const arm = new Placed(s, m);
    for (let j = 0; j < 9; j++) arm.box(0.17, 0.01, 0.012, 0.09, 0.15 + j * 0.083, 0.02, lattice);
    arm.box(0.012, 0.7, 0.012, 0.175, 0.13, 0.02, lattice);
    pane(arm, 0.155, 0.64, 0.092, 0.17, 0.008, cloth);
    pane(arm, 0.035, 0.6, -0.035, 0.2, 0.012, '#8a7a62');
  }
  return { body, sails: s.build({ ao: 0 }), hub: new THREE.Vector3(0, 1.23, 0.5) };
}

/* ---------------------------------------------------------------- the style */

export const amsterdam: Style = {
  id: 'amsterdam',
  name: { en: 'Amsterdam', zh: '阿姆斯特丹' },
  landmark: {
    name: { en: 'Zuiderkerk', zh: '南教堂' },
    short: { en: 'Church', zh: '南教堂' },
    note: { en: 'Hendrick de Keyser’s church of 1603–1611, the first built for Protestant worship in the city.', zh: '亨德里克·德·凯泽设计，1603—1611 年建成，城中第一座为新教礼拜而建的教堂。' },
  },
  sky: { top: '#6f93bb', horizon: '#f0e2cc', sun: '#ffe4b4' },
  fog: { color: '#dcd6ca', near: 40, far: 150 },
  sun: { color: '#ffdcaa', intensity: 2.5, dir: [-0.6, 0.52, 0.55] },
  hemi: { sky: '#c6d4e2', ground: '#7a6e58', intensity: 1.0 },
  exposure: 1.0,
  grade: { shadows: [0.015, 0.02, 0.04], highlights: [1.05, 1.0, 0.93], contrast: 1.05, saturation: 0.97, vignette: 0.32 },
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
    const tall = c.neighbours >= 5 ? 1 : c.neighbours <= 1 ? -1 : 0;
    k.box(0.92, 0.34, HD + 0.02, 0, -0.32, ZC, '#4a4440');
    const stoops: number[] = [];
    const roll = r();
    if (roll < 0.42) {
      // two narrow houses, each with its own gable
      const w = 0.455;
      const A = gabledSpec(r, -w / 2, w, tall);
      const B = gabledSpec(r, w / 2, w, tall);
      if (A.floors.length === B.floors.length && r() < 0.6) B.floors = FLOORS.slice(0, Math.max(2, B.floors.length - 1 + (r() < 0.5 ? 2 : 0)));
      const ha = townhouse(k, r, A, stoops).H;
      const hb = townhouse(k, r, B, stoops).H;
      chimney(k, 0, 0, -0.08, Math.max(ha, hb) + 0.14, A.wall);
      k.mark('smoke', 0, Math.max(ha, hb) + 0.16, -0.08);
    } else if (roll < 0.64) {
      const o = gabledSpec(r, 0, 0.9, tall);
      const { ridge } = townhouse(k, r, o, stoops);
      chimney(k, 0, ridge - 0.12, -0.08, 0.22, o.wall);
      k.mark('smoke', 0, ridge + 0.12, -0.08);
    } else if (roll < 0.82) {
      townhouse(k, r, cornicedSpec(r, tall), stoops);
    } else {
      // warehouses: a matched pair, or one broad one
      const wall = jitter(pick(r, DARK_BRICKS), r, 0.01, 0.04, 0.05);
      const sc = pick(r, SHUTTERS);
      if (r() < 0.6) {
        const w = 0.455;
        const t = tall + (r() < 0.5 ? 1 : 0);
        townhouse(k, r, warehouseSpec(r, -w / 2, w, t, wall, sc), stoops);
        townhouse(k, r, warehouseSpec(r, w / 2, w, t, wall, sc), stoops);
      } else townhouse(k, r, warehouseSpec(r, 0, 0.9, tall, wall, sc), stoops);
    }
    if (c.waterside) {
      // on the quay: mooring posts, barrels, a goods sledge, a lamp, a tree
      const free = [-0.36, -0.12, 0.12, 0.36].filter((x) => stoops.every((s) => Math.abs(s - x) > 0.13));
      for (const x of free) {
        const p = r();
        if (p < 0.25) k.cyl(0.016, 0.019, 0.12, 6, x, -0.02, 0.42, '#3e3228');
        else if (p < 0.42) {
          barrel(k, x, 0, 0.37);
          barrel(k, x + 0.062, 0, 0.375);
          if (r() < 0.5) barrel(k, x + 0.03, 0.075, 0.372);
        } else if (p < 0.5) sledge(k, x, 0.38, r() * 0.6 - 0.3);
        else if (p < 0.56) lantern(k, x, 0.4);
      }
      if (r() < 0.3 && free.includes(0.36)) quayTree(k, 0.4, 0.41, r);
    }
  },
  field(rng) {
    // mostly meadow and grain in their ditches; a rare bed of tulips (the bulb fields came later)
    const tulips = rng() < 0.12;
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
  trees: { shore: ['iep', 'knotwilg', 'linden', 'iep'], land: ['iep', 'linden', 'els', 'iep'], hill: ['iep'] },
  treeKits: AMS_TREES,
  bridge(k, j, n) {
    if (n === 3) drawBridge(k, j, n);
    else brickBridge(k, j, n);
  },
  windmill: polderMill,
  boat(k, rng) {
    const t = rng();
    if (t < 0.3) trekschuit(k, rng);
    else if (t < 0.72) barge(k, rng);
    else rowboat(k, rng);
  },
  buildLandmark: zuiderkerk,
  backdrop(k, rng) {
    // the flat land across the IJ and up the Amstel: low woods, polder islands, mills and spires
    for (let i = 0; i < 26; i++) {
      const a = rng() * Math.PI * 2;
      const r = 72 + rng() * 30;
      k.cyl(9 + rng() * 8, 10 + rng() * 9, 1.4, 9, Math.cos(a) * r, -1.2, Math.sin(a) * r, jitter('#8a9a66', rng, 0.02, 0.05, 0.05));
    }
    for (let i = 0; i < 46; i++) {
      const a = rng() * Math.PI * 2;
      const r = 70 + rng() * 34;
      k.sphere(3 + rng() * 4, Math.cos(a) * r, -0.6, Math.sin(a) * r, jitter('#6f7f60', rng), 0.4);
    }
    for (let i = 0; i < 9; i++) {
      const a = rng() * Math.PI * 2;
      const r = 74 + rng() * 22;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      k.cyl(0.45, 0.75, 2.4, 8, x, 0, z, '#5e5a4c');
      k.cyl(0, 0.6, 0.6, 8, x, 2.4, z, '#45423a');
      const ry = Math.PI / 2 - a + 0.4;
      const sx = x - Math.cos(a) * 0.7;
      const sz = z - Math.sin(a) * 0.7;
      k.box(0.22, 4.4, 0.12, sx, 0.4, sz, '#cfc6b2', ry);
      k.box(4.4, 0.22, 0.12, sx, 2.49, sz, '#cfc6b2', ry);
    }
    for (let i = 0; i < 3; i++) {
      const a = 1.2 + i * 1.6 + rng() * 0.4;
      const x = Math.cos(a) * 90;
      const z = Math.sin(a) * 90;
      k.box(3, 9, 3, x, 0, z, '#7e5a48');
      k.cyl(0, 1.8, 7, 8, x, 9, z, '#4c5656');
    }
    // East Indiamen at anchor in the IJ, a forest of masts
    for (let i = 0; i < 9; i++) {
      const x = -22 + i * 5.5 + (rng() - 0.5) * 3;
      const z = -34 - rng() * 12;
      const ry = rng() * 0.6 - 0.3;
      const c = Math.cos(ry);
      const sn = Math.sin(ry);
      k.box(4.2, 1.0, 1.1, x, -0.4, z, '#3a2c22', ry);
      k.box(4.25, 0.14, 1.14, x, 0.42, z, '#7a5a2a', ry);
      k.box(1.1, 0.9, 1.05, x - 1.6 * c, 0.55, z + 1.6 * sn, '#4a3424', ry);
      k.box(0.9, 0.14, 1.08, x - 1.65 * c, 1.42, z + 1.65 * sn, '#8a6a32', ry);
      k.box(1.6, 0.08, 0.08, x + 2.6 * c, 0.75, z - 2.6 * sn, '#3a2e26', ry + 0.0);
      for (const [m, hgt] of [[-1.1, 4.6], [0.25, 6], [1.45, 4.6]] as const) {
        const mx = x + m * c;
        const mz = z - m * sn;
        k.cyl(0.04, 0.07, hgt, 4, mx, 0.5, mz, '#3a2e26');
        for (const [f, len] of [[0.5, 2.2], [0.74, 1.7], [0.92, 1.1]] as const) k.box(0.18, 0.16, len - Math.abs(m) * 0.25, mx, 0.5 + hgt * f, mz, '#d8ccb0', ry);
      }
      k.tri({ x: x + 0.25 * c, y: 6.5, z: z - 0.25 * sn }, { x: x + 0.25 * c, y: 6.3, z: z - 0.25 * sn }, { x: x - 1.2 * c, y: 6.4, z: z + 1.2 * sn }, '#b8322a');
    }
  },
  notes: [523.25, 659.25, 783.99, 1046.5, 880, 1174.66],
  bonus: { label: { en: 'Windmills drain the polder', zh: '风车排干圩田' }, test: (s) => s.windmills >= 3 },
  bird: '#eef0f0',
  smoke: 0.22,
  scatter: [
    { zone: 'grass', kit: SCATTER.tuft('#6f9a48', '#86a858'), density: 1.6, scale: [0.8, 1.3] },
    { zone: 'grass', kit: SCATTER.flowers('#5a7a3a', ['#f2d23a', '#f4f0e6', '#f2d23a']), density: 0.35 },
    { zone: 'grass', kit: cow('#ece6da', '#2a2422'), density: 0.035, scale: [0.9, 1.1], shadow: true },
    { zone: 'grass', kit: cow('#e8dccb', '#7a4428'), density: 0.03, scale: [0.9, 1.1], shadow: true },
    { zone: 'grass', kit: sheep, density: 0.04, scale: [0.9, 1.15], shadow: true },
    { zone: 'grass', kit: hooiberg, density: 0.01, scale: [0.9, 1.2], shadow: true },
    { zone: 'shore', kit: reeds('#8a9a52', '#a2a65c', 0.26), density: 0.7, scale: [0.8, 1.3] },
    { zone: 'shore', kit: mooringPost, density: 0.05, shadow: true },
    { zone: 'shore', kit: SCATTER.stones('#8a8070', '#6e665a'), density: 0.08 },
    { zone: 'shallows', kit: reeds('#7f9248', '#98a058', 0.2), density: 0.22, scale: [0.8, 1.2] },
    { zone: 'shallows', kit: SCATTER.lily('#5a7f4a', '#f4f0e6'), density: 0.08, float: true },
  ],
  paving: { kind: 'brick', color: '#9a5e48', joint: '#6e5648' },
  people: { clothes: ['#2a2a2e', '#3a3430', '#5a3a2a', '#2e3a4a', '#7a2a24', '#2a2a2e', '#4a4440', '#6a5a40'], skin: SKIN },
  clouds: { color: '#fcf8f0', shade: '#b4bdc9', shadow: 0.38 },
};
